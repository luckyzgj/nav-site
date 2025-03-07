'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [siteName, setSiteName] = useState('AI导航');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // 获取网站名称
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SITE_NAME) {
      setSiteName(process.env.NEXT_PUBLIC_SITE_NAME);
    }
  }, []);
  
  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-gray-50 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              {siteName}
            </Link>
            
            <div className="hidden md:flex ml-8 space-x-6">
              <Link 
                href="/" 
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname === '/' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                首页
              </Link>
              <Link 
                href="/about" 
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname === '/about' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                关于
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-auto md:max-w-md">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
} 