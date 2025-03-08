'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Avatar } from 'antd';
import { 
  AppstoreOutlined, 
  TagsOutlined, 
  BarChartOutlined,
  EyeOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import Image from 'next/image';

// 统计数据类型
interface Stats {
  serviceCount: number;
  categoryCount: number;
  totalClicks: number;
}

// 热门网站类型
interface PopularService {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  clickCount: number;
  categoryName: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    serviceCount: 0,
    categoryCount: 0,
    totalClicks: 0,
  });
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取统计数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取统计数据
        const statsResponse = await fetch('/api/admin/stats');
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.data);
        }
        
        // 获取热门网站
        const popularResponse = await fetch('/api/admin/popular-services');
        const popularData = await popularResponse.json();
        
        if (popularData.success) {
          setPopularServices(popularData.data);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 判断文件是否为SVG
  const isSvg = (filename: string | null): boolean => {
    if (!filename) return false;
    return filename.toLowerCase().endsWith('.svg');
  };

  // 表格列定义
  const columns = [
    {
      title: '网站名称',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: PopularService) => (
        <div className="flex items-center">
          {record.icon ? (
            <div className="mr-2 flex-shrink-0">
              {isSvg(record.icon) ? (
                <Image
                  src={record.icon}
                  alt={record.name}
                  width={24}
                  height={24}
                  className="rounded"
                  unoptimized
                />
              ) : (
                <Image
                  src={record.icon}
                  alt={record.name}
                  width={24}
                  height={24}
                  className="rounded"
                />
              )}
            </div>
          ) : (
            <Avatar 
              icon={<GlobalOutlined />} 
              size={24} 
              className="mr-2 flex-shrink-0" 
            />
          )}
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: '所属分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '点击次数',
      dataIndex: 'clickCount',
      key: 'clickCount',
      sorter: (a: PopularService, b: PopularService) => a.clickCount - b.clickCount,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: PopularService) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => window.open(record.url, '_blank')}
        >
          访问
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">控制面板</h1>
      
      <Row gutter={16} className="mb-8">
        <Col span={8}>
          <Card>
            <Statistic
              title="网站总数"
              value={stats.serviceCount}
              prefix={<AppstoreOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="分类总数"
              value={stats.categoryCount}
              prefix={<TagsOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总点击次数"
              value={stats.totalClicks}
              prefix={<BarChartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      
      <Card title="热门网站" className="mb-8">
        <Table
          columns={columns}
          dataSource={popularServices}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
} 