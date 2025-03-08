'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [siteName, setSiteName] = useState('123导航');
  const [siteDescription, setSiteDescription] = useState('收录优质AI服务和应用的导航网站');
  const [year, setYear] = useState(new Date().getFullYear());
  
  // 获取网站名称和描述
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data.success) {
          setSiteName(data.data.siteName || '123导航');
          setSiteDescription(data.data.siteDescription || '收录优质AI服务和应用的导航网站');
        }
      } catch (error) {
        console.error('获取网站设置失败:', error);
      }
    };
    
    fetchSettings();
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{siteName}</h3>
            <p className="text-gray-400 mt-1">{siteDescription}</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 items-center">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              首页
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              关于我们
            </Link>
            <Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors">
              管理入口
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; {year} {siteName}. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
} 