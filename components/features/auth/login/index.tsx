'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Card, App } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { loginApi, saveTokenApi } from '@/libs/api-client/auth.api';

export default function LoginComponent() {
  const router = useRouter();
  const {message} = App.useApp();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await loginApi(values.email, values.password);
      if (!res.status){
        message.error(res.message || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }
      await saveTokenApi(res.data.token);
      localStorage.setItem('token', res.data.token);
      message.success('Đăng nhập thành công!');
      const redirectTo = searchParams.get('from') || '/dashboard';
      router.push(redirectTo);
    } catch (err: any) {
      message.error(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
      }}
    >
      <Card
        title="Đăng nhập"
        style={{ width: 360, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Tên đăng nhập (email)"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
