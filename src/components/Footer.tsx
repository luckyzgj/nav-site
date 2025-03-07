'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [siteName, setSiteName] = useState('AI导航');
  const [year, setYear] = useState(new Date().getFullYear());
  
  // 获取网站名称
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SITE_NAME) {
      setSiteName(process.env.NEXT_PUBLIC_SITE_NAME);
    }
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{siteName}</h3>
            <p className="text-gray-400 mt-1">收录优质AI服务和应用的导航网站</p>
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