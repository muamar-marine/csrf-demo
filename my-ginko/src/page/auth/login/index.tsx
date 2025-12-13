import './style.css';

import { Button, Form, Input, type FormProps, App } from 'antd';
import axios, { AxiosError } from 'axios';

import companyLogo from '../../../assets/logo.svg';
import { useAuth } from '../../../stores/auth';

export default function LoginPage() {
  const setCred = useAuth((state) => state.setCred);

  const [form] = Form.useForm();

  const { message } = App.useApp();

  const login = async (payload: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/auth/login',
        payload
      );
      const token = response?.data.data?.access_token;

      localStorage.setItem('cred', token);
      setCred(token);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.message === 'user is invalid') {
          form.setFields([
            { name: 'email', errors: ['Wrong Email or Password'] },
            { name: 'password', errors: ['Wrong Email or Password'] },
          ]);
          return;
        }
        form.setFields([
          { name: 'email', errors: [error.response?.data.message] },
          { name: 'password', errors: [error.response?.data.message] },
        ]);
        return;
      }
      message.error('Unknown error occured');
    }
  };

  const handleFinish: FormProps['onFinish'] = async (values) => {
    await login(values);
  };

  return (
    <main className="g-login">
      <section className="g-login__card">
        <img
          src={companyLogo}
          className="g-login__card__logo"
          alt="Company Logo"
        />
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          requiredMark={false}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message: 'Email invalid',
              },
              {
                required: true,
                message: 'Email required',
              },
            ]}>
            <Input placeholder="E.g.: john@mail.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Password required',
              },
            ]}>
            <Input.Password placeholder="E.g.: ••••••••" />
          </Form.Item>

          <Button htmlType="submit" type="primary" block>
            Login
          </Button>
        </Form>
      </section>
    </main>
  );
}
