'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { loginApi, saveTokenApi } from '@/libs/network/auth.api';
import useBrowserInfo from '@/libs/hooks/useBrowserInfo';
import { useAntdApp } from '@/libs/hooks/useAntdApp';

export default function LoginComponent() {
  const router = useRouter();
  const { notification } = useAntdApp();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { ipAddress, userAgent, coordinates, isLoading: browserInfoLoading, error: browserInfoError } = useBrowserInfo();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {

      if (browserInfoLoading) {
        notification.info({
          message: 'Vui lòng chờ',
          description: 'Đang lấy thông tin trình duyệt, vui lòng thử lại sau.',
        });
        setLoading(false);
        return;
      }

      if (browserInfoError) {
        notification.error({
          message: 'Lấy thông tin trình duyệt thất bại',
          description: `Lỗi lấy thông tin trình duyệt: ${browserInfoError}`,
        });
        setLoading(false);
        return;
      }

      const res = await loginApi(values.email, values.password, ipAddress, userAgent, coordinates);
      if (!res.status) {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: res.message || 'Đăng nhập thất bại, vui lòng thử lại.',
        });
        setLoading(false);
        return;
      }
      await saveTokenApi(res.data.token);
      localStorage.setItem('token', res.data.token);
      notification.success({
        message: 'Đăng nhập thành công',
        description: 'Bạn đã đăng nhập thành công. Vui lòng chờ chuyển hướng...',
      });
      const redirectTo = searchParams.get('from') || '/dashboard';
      router.push(redirectTo);
    } catch (err: any) {
      notification.error({
        message: 'Lỗi đăng nhập',
        description: err.message || 'Đã xảy ra lỗi không mong muốn, vui lòng thử lại sau.',
      });
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
