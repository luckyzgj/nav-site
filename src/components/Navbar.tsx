'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBox from './SearchBox';

type NavbarProps = {
  siteName: string;
};

export default function Navbar({ siteName }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // 初始检查滚动位置
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="text-4xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
            <Image src="/logo.svg" alt={siteName} width={48} height={48} className="mr-1" />
            <div>123<span className="text-normal text-brand-400">.SS</span></div>
          </Link>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <SearchBox />
            </div>
            
            <nav className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    href="/" 
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${
                      pathname === '/' ? 'font-semibold text-blue-600' : ''
                    }`}
                  >
                    首页
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${
                      pathname === '/about' ? 'font-semibold text-blue-600' : ''
                    }`}
                  >
                    关于
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin" 
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${
                      pathname === '/admin' ? 'font-semibold text-blue-600' : ''
                    }`}
                  >
                    管理
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 