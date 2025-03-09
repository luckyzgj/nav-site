'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect, useReducer } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber,
  message, 
  Popconfirm,
  Typography,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Title } = Typography;
const { TextArea } = Input;

// 分类类型定义
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 定义reducer函数
type CategoriesAction = 
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'MOVE_UP'; payload: { currentId: number; prevId: number } }
  | { type: 'MOVE_DOWN'; payload: { currentId: number; nextId: number } }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: number };

function categoriesReducer(state: Category[], action: CategoriesAction): Category[] {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return action.payload;
    case 'MOVE_UP': {
      const { currentId, prevId } = action.payload;
      const newState = [...state];
      const currentIndex = newState.findIndex(item => item.id === currentId);
      const prevIndex = newState.findIndex(item => item.id === prevId);
      
      if (currentIndex !== -1 && prevIndex !== -1) {
        const tempSortOrder = newState[currentIndex].sortOrder;
        newState[currentIndex].sortOrder = newState[prevIndex].sortOrder;
        newState[prevIndex].sortOrder = tempSortOrder;
        return [...newState].sort((a, b) => a.sortOrder - b.sortOrder);
      }
      return state;
    }
    case 'MOVE_DOWN': {
      const { currentId, nextId } = action.payload;
      const newState = [...state];
      const currentIndex = newState.findIndex(item => item.id === currentId);
      const nextIndex = newState.findIndex(item => item.id === nextId);
      
      if (currentIndex !== -1 && nextIndex !== -1) {
        const tempSortOrder = newState[currentIndex].sortOrder;
        newState[currentIndex].sortOrder = newState[nextIndex].sortOrder;
        newState[nextIndex].sortOrder = tempSortOrder;
        return [...newState].sort((a, b) => a.sortOrder - b.sortOrder);
      }
      return state;
    }
    case 'ADD_CATEGORY':
      return [...state, action.payload].sort((a, b) => a.sortOrder - b.sortOrder);
    case 'UPDATE_CATEGORY': {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        const newState = [...state];
        newState[index] = action.payload;
        return newState;
      }
      return state;
    }
    case 'DELETE_CATEGORY':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
}

export default function CategoriesPage() {
  // 使用useReducer替代useState来管理分类列表
  const [categories, dispatch] = useReducer(categoriesReducer, []);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 获取分类列表
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        // 确保按sortOrder排序
        const sortedCategories = [...data.data].sort((a, b) => a.sortOrder - b.sortOrder);
        // 使用dispatch更新状态
        dispatch({ type: 'SET_CATEGORIES', payload: sortedCategories });
      } else {
        message.error(data.message || '获取分类列表失败');
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
      message.error('获取分类列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchCategories();
  }, []);

  // 添加分类
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  // 上传图标前的处理
  const beforeUpload = (file: File) => {
    // 检查文件类型
    const validTypes = [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'image/webp', 
      'image/svg+xml'
    ];
    
    const isValidType = validTypes.includes(file.type);
    if (!isValidType) {
      message.error('文件类型不支持，请上传图片文件（支持JPG、PNG、GIF、WebP、SVG格式）');
      return false;
    }
    
    // 检查文件大小
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
      return false;
    }
    
    return false; // 阻止自动上传
  };

  // 处理文件列表变化
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      if (file.originFileObj) {
        file.preview = URL.createObjectURL(file.originFileObj);
      }
    }
    setPreviewImage(file.url || file.preview || null);
  };

  // 添加或更新分类
  const handleSave = async (values: { name: string, slug: string, description?: string, sortOrder?: number }) => {
    try {
      setUploading(true);
      
      // 处理图标上传
      let iconPath = null;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append('file', fileList[0].originFileObj as File);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          iconPath = uploadData.data.path;
        } else {
          message.error(uploadData.message || '图标上传失败');
          setUploading(false);
          return;
        }
      } else if (editingId) {
        // 如果是编辑且没有新上传图标，保留原图标
        const currentCategory = categories.find(c => c.id === editingId);
        iconPath = currentCategory?.icon || null;
      }
      
      const url = editingId 
        ? `/api/admin/categories/${editingId}` 
        : '/api/admin/categories';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          icon: iconPath,
          sortOrder: values.sortOrder !== undefined ? Number(values.sortOrder) : 0
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        message.success(editingId ? '更新分类成功' : '添加分类成功');
        setModalVisible(false);
        form.resetFields();
        setEditingId(null);
        setFileList([]);
        fetchCategories();
      } else {
        message.error(data.message || (editingId ? '更新分类失败' : '添加分类失败'));
      }
    } catch (error) {
      console.error(editingId ? '更新分类失败:' : '添加分类失败:', error);
      message.error(editingId ? '更新分类失败，请稍后重试' : '添加分类失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  // 删除分类
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        message.success('删除分类成功');
        fetchCategories();
      } else {
        message.error(data.message || '删除分类失败');
      }
    } catch (error) {
      console.error('删除分类失败:', error);
      message.error('删除分类失败，请稍后重试');
    }
  };

  // 编辑分类
  const handleEdit = (record: Category) => {
    setEditingId(record.id);
    form.setFieldsValue({ 
      name: record.name,
      slug: record.slug,
      description: record.description || '',
      sortOrder: record.sortOrder
    });
    
    // 如果有图标，设置文件列表
    if (record.icon) {
      setFileList([
        {
          uid: '-1',
          name: record.icon.split('/').pop() || 'icon',
          status: 'done',
          url: record.icon,
        }
      ]);
    } else {
      setFileList([]);
    }
    
    setModalVisible(true);
  };

  // 上移下移函数
  const handleMoveUp = async (record: Category) => {
    try {
      setLoading(true); // 显示加载状态
      
      // 获取所有分类
      const allCategories = [...categories];
      // 找到当前分类的索引
      const currentIndex = allCategories.findIndex(item => item.id === record.id);
      
      // 如果已经是第一个，则不能再上移
      if (currentIndex === 0) {
        message.info('已经是第一个分类，无法上移');
        setLoading(false);
        return;
      }
      
      // 获取上一个分类
      const prevCategory = allCategories[currentIndex - 1];
      
      // 交换排序值
      const tempSortOrder = record.sortOrder;
      
      // 使用批量更新API
      const updateData = [
        {
          id: record.id,
          sortOrder: Number(prevCategory.sortOrder)
        },
        {
          id: prevCategory.id,
          sortOrder: Number(tempSortOrder)
        }
      ];
      
      // 发送请求
      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      // 解析响应
      const data = await response.json();
      
      if (response.ok && data.success) {
        message.success('排序更新成功');
        // 重新获取分类列表
        await fetchCategories();
      } else {
        message.error(data.message || '排序更新失败');
      }
    } catch (error) {
      console.error('上移分类出错:', error);
      message.error('上移分类出错');
    } finally {
      setLoading(false); // 隐藏加载状态
    }
  };
  
  const handleMoveDown = async (record: Category) => {
    try {
      setLoading(true); // 显示加载状态
      
      // 获取所有分类
      const allCategories = [...categories];
      // 找到当前分类的索引
      const currentIndex = allCategories.findIndex(item => item.id === record.id);
      
      // 如果已经是最后一个，则不能再下移
      if (currentIndex === allCategories.length - 1) {
        message.info('已经是最后一个分类，无法下移');
        setLoading(false);
        return;
      }
      
      // 获取下一个分类
      const nextCategory = allCategories[currentIndex + 1];
      
      // 交换排序值
      const tempSortOrder = record.sortOrder;
      
      // 使用批量更新API
      const updateData = [
        {
          id: record.id,
          sortOrder: Number(nextCategory.sortOrder)
        },
        {
          id: nextCategory.id,
          sortOrder: Number(tempSortOrder)
        }
      ];
      
      // 发送请求
      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      // 解析响应
      const data = await response.json();
      
      if (response.ok && data.success) {
        message.success('排序更新成功');
        // 重新获取分类列表
        await fetchCategories();
      } else {
        message.error(data.message || '排序更新失败');
      }
    } catch (error) {
      console.error('下移分类出错:', error);
      message.error('下移分类出错');
    } finally {
      setLoading(false); // 隐藏加载状态
    }
  };

  // 上传按钮
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>上传图标</div>
    </div>
  );

  // 表格列定义
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      sorter: (a, b) => a.sortOrder - b.sortOrder,
      defaultSortOrder: 'ascend',
      render: (sortOrder: number, record: Category) => (
        <InputNumber
          min={0}
          value={sortOrder}
          onChange={(value) => handleSortOrderChange(record.id, value)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon: string | null) => (
        icon ? (
          <div className="w-10 h-10 relative cursor-pointer" onClick={() => setPreviewImage(icon)}>
            <Image
              src={icon}
              alt="分类图标"
              fill
              className="rounded object-contain"
              unoptimized={icon.endsWith('.svg')}
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <PlusOutlined />
          </div>
        )
      ),
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '英文标识',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: '简介',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string | null) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record, index) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<ArrowUpOutlined />} 
            onClick={() => handleMoveUp(record)}
            disabled={index === 0}
            title="上移"
          />
          <Button 
            type="text" 
            icon={<ArrowDownOutlined />} 
            onClick={() => handleMoveDown(record)}
            disabled={index === categories.length - 1}
            title="下移"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这个分类吗?"
            description="删除后无法恢复，该分类下的网站将失去分类关联。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 修改sortOrder的函数
  const handleSortOrderChange = async (id: number, value: number | null) => {
    if (value === null) return;
    
    try {
      setLoading(true);
      
      // 获取当前分类
      const category = categories.find(c => c.id === id);
      if (!category) return;
      
      // 发送请求
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          sortOrder: Number(value)
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        message.success('排序更新成功');
        // 重新获取分类列表
        await fetchCategories();
      } else {
        message.error(data.message || '排序更新失败');
      }
    } catch (error) {
      console.error('修改排序值出错:', error);
      message.error('修改排序值出错');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2} style={{ margin: 0 }}>分类管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          添加分类
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={categories} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        scroll={{ x: 'max-content' }}
      />
      
      <Modal
        title={editingId ? '编辑分类' : '添加分类'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          
          <Form.Item
            name="slug"
            label="英文标识"
            rules={[
              { required: true, message: '请输入英文标识' },
              { 
                pattern: /^[a-z0-9-]+$/, 
                message: '只能包含小写字母、数字和连字符' 
              }
            ]}
            extra="用于URL，只能包含小写字母、数字和连字符，例如：ai-tools"
          >
            <Input placeholder="请输入英文标识" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="分类简介"
            extra="简要描述该分类的特点和包含的内容"
          >
            <TextArea 
              placeholder="请输入分类简介" 
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>
          
          <Form.Item
            name="sortOrder"
            label="排序"
            rules={[{ required: true, message: '请输入排序数值!' }]}
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            label="分类图标"
            extra="建议上传正方形图标，支持PNG、JPG、GIF、WebP、SVG格式，大小不超过2MB"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onPreview={handlePreview}
              maxCount={1}
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={uploading}
              >
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
        <div className="relative w-full" style={{ height: '500px' }}>
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