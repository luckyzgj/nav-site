'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  Typography,
  Divider
} from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 管理员信息类型
interface AdminInfo {
  id: number;
  username: string;
}

// 修改密码表单类型
interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [form] = Form.useForm();

  // 获取管理员信息
  const fetchAdminInfo = async () => {
    try {
      const response = await fetch('/api/admin/account');
      const data = await response.json();
      
      if (data.success) {
        setAdminInfo(data.data);
      } else {
        message.error(data.message || '获取账号信息失败');
      }
    } catch (error) {
      console.error('获取账号信息失败:', error);
      message.error('获取账号信息失败，请稍后重试');
    }
  };

  // 初始加载
  useEffect(() => {
    fetchAdminInfo();
  }, []);

  // 修改密码
  const handleChangePassword = async (values: ChangePasswordForm) => {
    // 验证两次输入的密码是否一致
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/account/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        message.success('密码修改成功');
        form.resetFields();
      } else {
        message.error(data.message || '密码修改失败');
      }
    } catch (error) {
      console.error('密码修改失败:', error);
      message.error('密码修改失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Title level={2}>账号设置</Title>
      
      <Card title="账号信息" className="mb-6">
        <div className="py-2">
          <p className="mb-2">
            <strong>用户名：</strong> {adminInfo?.username || '加载中...'}
          </p>
        </div>
      </Card>
      
      <Card title="修改密码">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入当前密码" 
            />
          </Form.Item>
          
          <Divider />
          
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6个字符' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入新密码" 
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请再次输入新密码" 
            />
          </Form.Item>
          
          <Form.Item className="mb-0 text-right">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 