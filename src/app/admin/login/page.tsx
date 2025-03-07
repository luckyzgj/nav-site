'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // 登录成功后强制跳转
  useEffect(() => {
    if (loginSuccess) {
      message.success('登录成功，正在跳转...');
      // 使用setTimeout确保消息显示后再跳转
      const timer = setTimeout(() => {
        // 使用硬跳转确保页面完全刷新，避免客户端路由问题
        window.location.href = '/admin';
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess]);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    
    try {
      console.log('开始登录请求...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include', // 确保包含Cookie
      });
      
      const data = await response.json();
      console.log('登录响应:', data);
      
      if (data.success) {
        // 登录成功，设置状态触发跳转
        setLoginSuccess(true);
      } else {
        message.error(data.message || '登录失败');
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      message.error('登录请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="管理员登录" className="w-full max-w-md">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 