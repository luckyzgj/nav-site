import './globals.css';
import Link from 'next/link';
import { getSiteSettings } from '@/utils/settings';
import SearchBox from '@/components/SearchBox';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
              {settings.siteName || 'AI导航'}
            </Link>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
              <div className="w-full md:w-auto">
                <SearchBox />
              </div>
              
              <nav className="mt-4 md:mt-0">
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-blue-600">
                      首页
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-600 hover:text-blue-600">
                      关于
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="text-gray-600 hover:text-blue-600">
                      管理
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-100 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} {settings.siteName || 'AI导航'} - 收录优质AI服务和应用</p>
        </div>
      </footer>
      
      {/* 统计代码 */}
      {settings.statisticsCode && (
        <div dangerouslySetInnerHTML={{ __html: settings.statisticsCode }} />
      )}
    </>
  );
} 