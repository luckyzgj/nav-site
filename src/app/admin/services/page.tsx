'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select,
  Upload,
  message, 
  Popconfirm,
  Typography,
  Image
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 服务类型定义
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 获取服务列表
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/services');
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      } else {
        message.error(data.message || '获取服务列表失败');
      }
    } catch (error) {
      console.error('获取服务列表失败:', error);
      message.error('获取服务列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
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
  };

  // 初始加载
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  // 添加或更新服务
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
        message.success(editingId ? '更新服务成功' : '添加服务成功');
        setModalVisible(false);
        form.resetFields();
        setEditingId(null);
        setFileList([]);
        fetchServices();
      } else {
        message.error(data.message || (editingId ? '更新服务失败' : '添加服务失败'));
      }
    } catch (error) {
      console.error(editingId ? '更新服务失败:' : '添加服务失败:', error);
      message.error(editingId ? '更新服务失败，请稍后重试' : '添加服务失败，请稍后重试');
    }
  };

  // 删除服务
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        message.success('删除服务成功');
        fetchServices();
      } else {
        message.error(data.message || '删除服务失败');
      }
    } catch (error) {
      console.error('删除服务失败:', error);
      message.error('删除服务失败，请稍后重试');
    }
  };

  // 编辑服务
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

  // 添加服务
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
  const columns: ColumnsType<Service> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon) => (
        icon ? (
          <Image 
            src={icon} 
            alt="图标" 
            width={40} 
            height={40} 
            style={{ objectFit: 'contain' }}
            preview={{ src: icon }}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
            无
          </div>
        )
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '点击次数',
      dataIndex: 'clickCount',
      key: 'clickCount',
      sorter: (a, b) => a.clickCount - b.clickCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => window.open(record.url, '_blank')}
          >
            访问
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个服务吗？"
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>服务管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          添加服务
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={services} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingId ? '编辑服务' : '添加服务'}
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
            label="服务名称"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          
          <Form.Item
            name="url"
            label="服务网址"
            rules={[
              { required: true, message: '请输入服务网址' },
              { type: 'url', message: '请输入有效的URL' }
            ]}
          >
            <Input placeholder="请输入服务网址，例如：https://example.com" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="服务简介"
            rules={[{ required: true, message: '请输入服务简介' }]}
          >
            <TextArea 
              placeholder="请输入服务简介" 
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
            label="服务图标"
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
          
          <Form.Item className="mb-0 text-right">
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="预览" style={{ width: '100%' }} src={previewImage || ''} />
      </Modal>
    </div>
  );
} 