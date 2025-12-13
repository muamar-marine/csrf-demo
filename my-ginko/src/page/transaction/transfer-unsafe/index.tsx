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

export default function TransferUnsafePage() {
  const [form] = Form.useForm();
  const cred = useAuth((state) => state.cred);
  const { message } = App.useApp();

  const transfer = useCallback(
    async (
      payload: { account_number: string; amount: string },
      cred: string | null
    ) => {
      try {
        await axios.post(
          'http://localhost:8000/transaction/transfer-unsafe',
          { account_number: payload.account_number, amount:payload.amount },
          {
            headers: {
              Authorization: `Bearer ${cred}`,
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

  const handleFinish: FormProps['onFinish'] = (values) => {
    transfer(values, cred);
  };

  return (
    <DefaultLayout>
      <main>
        <Title level={2}>Transfer Unsafe</Title>

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
