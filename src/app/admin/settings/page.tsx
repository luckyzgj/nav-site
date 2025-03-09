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
  Alert,
  Divider
} from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

interface SettingsFormValues {
  siteName: string;
  siteDescription: string;
  statisticsCode: string;
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
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
            <TextArea 
              placeholder="请输入网站描述" 
              rows={3}
            />
          </Form.Item>
          
          <Divider orientation="left">SEO 设置</Divider>
          
          <Form.Item
            name="seoTitle"
            label="SEO 标题"
            tooltip="用于网站首页的HTML标题标签，如不填写则使用网站名称"
          >
            <Input placeholder="请输入SEO标题" />
          </Form.Item>
          
          <Form.Item
            name="seoKeywords"
            label="SEO 关键词"
            tooltip="用于网站首页的meta keywords标签，多个关键词请用英文逗号分隔"
          >
            <Input placeholder="请输入SEO关键词，多个关键词用英文逗号分隔" />
          </Form.Item>
          
          <Form.Item
            name="seoDescription"
            label="SEO 描述"
            tooltip="用于网站首页的meta description标签，如不填写则使用网站描述"
          >
            <TextArea 
              placeholder="请输入SEO描述" 
              rows={3}
            />
          </Form.Item>
          
          <Divider orientation="left">统计代码</Divider>
          
          <Form.Item
            name="statisticsCode"
            label="统计代码"
            tooltip="添加第三方统计代码，如Google Analytics、百度统计等，将显示在前台页面底部"
            extra="请输入完整的JavaScript代码，包括<script>标签"
          >
            <TextArea 
              placeholder="请输入统计代码，例如：<script>...</script>" 
              rows={6}
              className="font-mono text-sm"
            />
          </Form.Item>
          
          <Alert
            message="安全提示"
            description="请确保添加的统计代码来自可信任的来源，恶意代码可能会影响网站安全和用户体验。"
            type="warning"
            showIcon
            className="mb-4"
          />
          
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