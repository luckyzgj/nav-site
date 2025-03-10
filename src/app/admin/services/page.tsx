'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select,
  Upload,
  Popconfirm,
  Typography,
  Card,
  Flex,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import Image from 'next/image';
import { useAdminApp } from '@/components/AdminAppProvider';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 网站类型定义
interface Service {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: string | null;
  clickCount: number;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

// 分类类型定义
interface Category {
  id: number;
  name: string;
}

// 表单值类型
interface ServiceFormValues {
  name: string;
  url: string;
  description: string;
  categoryId: number;
  icon?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { message } = useAdminApp();

  // 获取网站列表
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
        setFilteredServices(data.data);
      } else {
        message.error(data.message || '获取网站列表失败');
      }
    } catch (error) {
      console.error('获取网站列表失败:', error);
      message.error('获取网站列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [message]);

  // 获取分类列表
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        message.error(data.message || '获取分类列表失败');
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
      message.error('获取分类列表失败，请稍后重试');
    }
  }, [message]);

  // 初始加载
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices, fetchCategories]);

  // 筛选网站列表
  const filterServices = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    if (categoryId === null) {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service => service.categoryId === categoryId);
      setFilteredServices(filtered);
    }
  };

  // 重置筛选
  const resetFilter = () => {
    setSelectedCategoryId(null);
    setFilteredServices(services);
  };

  // 添加或更新网站
  const handleSave = async (values: ServiceFormValues) => {
    try {
      // 处理图标上传
      let iconPath = values.icon;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append('file', fileList[0].originFileObj);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          iconPath = uploadData.data.path;
        } else {
          message.error(uploadData.message || '上传图标失败');
          return;
        }
      }
      
      // 准备请求数据
      const serviceData = {
        ...values,
        icon: iconPath,
      };
      
      // 发送请求
      const url = editingId 
        ? `/api/admin/services/${editingId}` 
        : '/api/admin/services';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        message.success(editingId ? '更新网站成功' : '添加网站成功');
        setModalVisible(false);
        form.resetFields();
        setEditingId(null);
        setFileList([]);
        fetchServices();
      } else {
        message.error(data.message || (editingId ? '更新网站失败' : '添加网站失败'));
      }
    } catch (error) {
      console.error(editingId ? '更新网站失败:' : '添加网站失败:', error);
      message.error(editingId ? '更新网站失败，请稍后重试' : '添加网站失败，请稍后重试');
    }
  };

  // 删除网站
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        message.success('删除网站成功');
        fetchServices();
      } else {
        message.error(data.message || '删除网站失败');
      }
    } catch (error) {
      console.error('删除网站失败:', error);
      message.error('删除网站失败，请稍后重试');
    }
  };

  // 编辑网站
  const handleEdit = (record: Service) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      url: record.url,
      description: record.description,
      categoryId: record.categoryId,
      icon: record.icon,
    });
    
    // 设置图标预览
    if (record.icon) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: record.icon,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setModalVisible(true);
  };

  // 添加网站
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  // 处理图标上传
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 预览图标
  const handlePreview = async (file: UploadFile) => {
    if (file.url) {
      setPreviewImage(file.url);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 60,
      render: (icon: string | null) => (
        icon ? (
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <Image 
              src={icon}
              alt="网站图标"
              fill
              style={{ objectFit: 'contain' }}
              onClick={() => setPreviewImage(icon)}
            />
          </div>
        ) : (
          <Flex 
            style={{ 
              width: 40, 
              height: 40, 
              background: '#f0f0f0', 
              borderRadius: 4 
            }} 
            justify="center" 
            align="center"
          >
            无
          </Flex>
        )
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      sorter: (a: Service, b: Service) => a.name.localeCompare(b.name),
    },
    {
      title: '点击量',
      dataIndex: 'clickCount',
      key: 'clickCount',
      width: 100,
      sorter: (a: Service, b: Service) => a.clickCount - b.clickCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: Service) => (
        <Space size="middle">
          <Button 
            type="default" 
            icon={<EyeOutlined />}
            onClick={() => window.open(record.url, '_blank')}
          >
            访问
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个网站吗？"
            description="删除后无法恢复。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <div className="admin-services-page">
      
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>网站管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          添加网站
        </Button>
      </Flex>

      {/* 分类筛选卡片 */}
      <Card style={{ marginBottom: 16, backgroundColor: '#f8f8f8' }}>
        <Row gutter={[10, 10]}>
          <Col>
            <Button 
              type={selectedCategoryId === null ? 'primary' : 'default'}
              onClick={resetFilter}
            >
              全部
            </Button>
          </Col>
          {categories.map(category => (
            <Col key={category.id}>
              <Button
                type={selectedCategoryId === category.id ? 'primary' : 'default'}
                onClick={() => filterServices(category.id)}
              >
                {category.name}
              </Button>
            </Col>
          ))}
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={resetFilter}
              title="重置筛选"
            />
          </Col>
        </Row>
      </Card>

      <Table 
        columns={columns} 
        dataSource={filteredServices} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      
      <Modal
        title={editingId ? '编辑网站' : '添加网站'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ categoryId: categories[0]?.id }}
        >
          <Form.Item
            name="name"
            label="网站名称"
            rules={[{ required: true, message: '请输入网站名称' }]}
          >
            <Input placeholder="请输入网站名称" />
          </Form.Item>
          
          <Form.Item
            name="url"
            label="网站网址"
            rules={[
              { required: true, message: '请输入网站网址' },
              { type: 'url', message: '请输入有效的URL' }
            ]}
          >
            <Input placeholder="请输入网站网址，例如：https://example.com" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="网站简介"
            rules={[{ required: true, message: '请输入网站简介' }]}
          >
            <TextArea 
              placeholder="请输入网站简介" 
              rows={4} 
              showCount 
              maxLength={500} 
            />
          </Form.Item>
          
          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择所属分类' }]}
          >
            <Select placeholder="请选择所属分类">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="icon"
            label="网站图标"
            valuePropName="file"
            getValueFromEvent={(e) => e?.file}
            extra="建议上传正方形图片，支持JPG、PNG、GIF、WebP、SVG格式，大小不超过2MB"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              onPreview={handlePreview}
              beforeUpload={() => false}
              maxCount={1}
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 图片预览 */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
      >
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
          {previewImage && (
            <Image
              src={previewImage}
              alt="预览"
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
              priority
            />
          )}
        </div>
      </Modal>
    </div>
  );
} 