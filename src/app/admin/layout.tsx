'use client';

// 导入Ant Design的React 19兼容补丁
import '@ant-design/v5-patch-for-react-19';
// 导入后台专用的Tailwind基础类
import './globals.css';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, theme } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';
import VersionInfo from '@/components/VersionInfo';

const { Header, Content, Sider } = Layout;

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [siteName, setSiteName] = useState('导航');
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 处理客户端渲染
  useEffect(() => {
    setIsClient(true);
    
    // 获取网站设置
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success && data.data.siteName) {
          setSiteName(data.data.siteName);
        }
      } catch (error) {
        console.error('获取设置失败:', error);
      }
    };
    
    fetchSettings();
  }, []);

  // 处理登出
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 如果是登录页面，直接显示内容
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 服务器端渲染时不显示内容
  if (!isClient) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="h-8 leading-8 m-4 text-white font-bold text-center overflow-hidden">
          {!collapsed ? `${siteName}管理后台` : siteName.charAt(0)}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname]}
          mode="inline"
          items={[
            {
              key: '/admin',
              icon: <DashboardOutlined />,
              label: <Link href="/admin">控制面板</Link>,
            },
            {
              key: '/admin/services',
              icon: <AppstoreOutlined />,
              label: <Link href="/admin/services">网站管理</Link>,
            },
            {
              key: '/admin/categories',
              icon: <TagsOutlined />,
              label: <Link href="/admin/categories">分类管理</Link>,
            },
            {
              key: '/admin/banners',
              icon: <PictureOutlined />,
              label: <Link href="/admin/banners">头图管理</Link>,
            },
            {
              key: '/admin/settings',
              icon: <SettingOutlined />,
              label: <Link href="/admin/settings">系统设置</Link>,
            },
            {
              key: '/admin/account',
              icon: <UserOutlined />,
              label: <Link href="/admin/account">账号设置</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-end items-center h-full px-4">
            <Link href="/" className="mr-4">
              <Button
                type="text"
                icon={<HomeOutlined />}
              >
                访问首页
              </Button>
            </Link>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
      <footer className="p-4 border-t">
        <VersionInfo className="text-right" />
      </footer>
    </Layout>
  );
} 