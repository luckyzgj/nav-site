'use client';

import Link from 'next/link';

type FooterProps = {
  siteName: string;
  siteDescription?: string;
  statisticsCode?: string;
};

export default function Footer({ siteName, siteDescription, statisticsCode }: FooterProps) {
  const year = new Date().getFullYear();
  
  return (
    <>
      <footer className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800">{siteName}</h3>
              {siteDescription && (
                <p className="text-gray-600 mt-1">{siteDescription}</p>
              )}
            </div>
            
            <div className="flex space-x-6 items-center">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                首页
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                关于
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                管理
              </Link>
            </div>
          </div>
          
          <div className="text-center text-gray-500">
            <p>&copy; {year} 123.SS All Rights Reserved</p>
          </div>
        </div>
      </footer>
      
      {/* 统计代码 */}
      {statisticsCode && (
        <div dangerouslySetInnerHTML={{ __html: statisticsCode }} />
      )}
    </>
  );
} 