'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, message, Row, Col, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // 创建一个消息实例，避免使用静态方法
  const [messageApi, contextHolder] = message.useMessage();

  // 使用useCallback包装消息显示函数，避免不必要的重渲染
  const showMessage = useCallback((type: 'success' | 'error', content: string) => {
    // 使用try-catch包装消息调用，捕获可能的错误
    try {
      messageApi[type](content);
    } catch (error) {
      console.error('显示消息时出错:', error);
      // 如果消息API出错，使用原生alert作为备选
      if (type === 'error') {
        alert(`错误: ${content}`);
      }
    }
  }, [messageApi]);

  // 登录成功后强制跳转
  useEffect(() => {
    if (loginSuccess) {
      try {
        showMessage('success', '登录成功，正在跳转...');
        // 使用setTimeout确保消息显示后再跳转
        const timer = setTimeout(() => {
          // 使用硬跳转确保页面完全刷新，避免客户端路由问题
          window.location.href = '/admin';
        }, 1500);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('跳转过程中出错:', error);
        // 如果出错，尝试直接跳转
        window.location.href = '/admin';
      }
    }
  }, [loginSuccess, showMessage]);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include', // 确保包含Cookie
      });
      
      // 记录响应状态
      console.log('登录响应状态:', response.status, response.statusText);
      
      // 尝试解析响应
      let data;
      try {
        data = await response.json();
        console.log('登录响应数据:', data);
      } catch (parseError) {
        console.error('解析响应数据失败:', parseError);
        showMessage('error', '服务器响应格式错误，请联系管理员');
        setLoading(false);
        return;
      }
      
      if (data.success) {
        // 登录成功，设置状态触发跳转
        // 先关闭loading状态，再设置登录成功状态，避免状态更新冲突
        setLoading(false);
        // 使用setTimeout确保状态更新在不同的渲染周期
        setTimeout(() => {
          setLoginSuccess(true);
        }, 0);
      } else {
        setLoading(false);
        showMessage('error', data.message || '登录失败');
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      // 提供更具体的错误信息
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showMessage('error', '网络请求失败，请检查网络连接');
      } else {
        showMessage('error', '登录请求失败，请稍后重试');
      }
      setLoading(false);
    }
  };

  // 自定义卡片标题，包含Logo和文字
  const cardTitle = (
    <Space align="center" style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <div style={{ position: 'relative', width: '36px', height: '36px' }}>
        <Image
          src="/logo.svg"
          alt="网站Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      <Title level={4} style={{ margin: 0 }}>管理员登录</Title>
    </Space>
  );

  return (
    <>
      {contextHolder}
      <Row 
        justify="center" 
        align="middle" 
        style={{ 
          minHeight: '100vh', 
          background: '#f0f2f5' 
        }}
      >
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card 
            title={cardTitle}
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.03)' }}
          >
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
} 