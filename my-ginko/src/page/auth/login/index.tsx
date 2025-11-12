import companyLogo from '../../../assets/logo.svg';

import { Button, Form, Input, type FormProps } from 'antd';
import './style.css';

export default function LoginPage() {
  const [form] = Form.useForm();

  const handleFinish: FormProps['onFinish'] = (values) => {
    localStorage.setItem('cred', JSON.stringify(values));
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
