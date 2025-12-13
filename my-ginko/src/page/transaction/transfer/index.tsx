// * In here, to make a transfer request, we need a CSRF Token

import { useCallback } from 'react';
import { DefaultLayout } from '../../../layouts';

import {
  App,
  Button,
  Form,
  InputNumber,
  Typography,
  type FormProps,
} from 'antd';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../../stores/auth';

const { Title } = Typography;

export default function TransferPage() {
  const [form] = Form.useForm();
  const cred = useAuth((state) => state.cred);
  const { message } = App.useApp();

  const transfer = useCallback(
    async (
      payload: { account_number: string; amount: string },
      cred: string,
      csrfToken: string
    ) => {
      try {
        await axios.post(
          'http://localhost:8000/transaction/transfer',
          payload,
          {
            headers: {
              Authorization: `Bearer ${cred}`,
              'x-csrf-token': csrfToken,
            },
          }
        );

        message.success('Transfer success!');
        form.resetFields();
      } catch (error) {
        if (error instanceof AxiosError) {
          message.error(error.response?.data?.message);
          return;
        }
        message.error('Unknown error occured');
      }
    },
    [form, message]
  );

  const getToken = useCallback(
    async (payload: {
      cred: string | null;
      account_number: string;
      amount: string;
    }) => {
      if (!payload.cred) return;

      try {
        const response = await axios.get(
          'http://localhost:8000/security/csrf',
          {
            headers: { Authorization: `Bearer ${payload.cred}` },
          }
        );

        const csrf_token = response?.data?.data?.csrf_token;
        transfer(
          {
            account_number: payload.account_number,
            amount: payload.amount,
          },

          payload.cred,
          csrf_token
        );
      } catch (err) {
        if (err instanceof AxiosError) {
          message.error(err.response?.data?.message);
          return;
        }

        message.error('Unknown error occured');
      }
    },
    [message, transfer]
  );

  const handleFinish: FormProps['onFinish'] = (values) => {
    getToken({ ...values, cred });
  };

  return (
    <DefaultLayout>
      <main>
        <Title level={2}>Transfer</Title>

        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          style={{ maxWidth: 512 }}>
          <Form.Item
            label="Account Number"
            name="account_number"
            rules={[
              {
                required: true,
                message: 'Required',
              },
            ]}>
            <InputNumber
              placeholder="e.g.: 1234xxxxxxxxxxxx"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: 'Required',
              },
            ]}>
            <InputNumber
              placeholder="e.g.: 50000"
              addonBefore="Rp."
              style={{ width: '100%' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </div>
        </Form>
      </main>
    </DefaultLayout>
  );
}
