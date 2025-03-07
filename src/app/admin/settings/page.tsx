'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Card,
  Typography,
  Divider
} from 'antd';

const { Title } = Typography;

interface SettingsFormValues {
  siteName: string;
  siteDescription: string;
}

export default function SettingsPage() {
  const [form] = Form.useForm<SettingsFormValues>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 初始加载
  useEffect(() => {
    // 获取设置函数移到useEffect内部
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        if (data.success) {
          form.setFieldsValue(data.data);
        } else {
          message.error(data.message || '获取设置失败');
        }
      } catch (error) {
        console.error('获取设置失败:', error);
        message.error('获取设置失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  // 保存设置
  const handleSave = async (values: SettingsFormValues) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (data.success) {
        message.success('设置保存成功');
      } else {
        message.error(data.message || '保存设置失败');
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      message.error('保存设置失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Title level={2}>系统设置</Title>
      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Divider orientation="left">基本设置</Divider>
          
          <Form.Item
            name="siteName"
            label="网站名称"
            rules={[{ required: true, message: '请输入网站名称' }]}
          >
            <Input placeholder="请输入网站名称" />
          </Form.Item>
          
          <Form.Item
            name="siteDescription"
            label="网站描述"
            rules={[{ required: true, message: '请输入网站描述' }]}
          >
            <Input.TextArea 
              placeholder="请输入网站描述" 
              rows={3}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={saving}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 