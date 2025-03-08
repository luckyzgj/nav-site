import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import { getSiteSettings } from '@/utils/settings';

// 服务类型定义
type Service = {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: string | null;
  clickCount: number;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
};

// 动态生成元数据
export async function generateMetadata(): Promise<Metadata> {
  // 获取网站设置
  const settings = await getSiteSettings();
  
  return {
    title: `搜索 - ${settings.siteName}`,
    description: settings.siteDescription,
  };
}

// 搜索服务
async function searchServices(query: string): Promise<Service[]> {
  if (!query) return [];
  
  try {
    // 使用MySQL搜索API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.success) {
      return [];
    }
    
    return data.data;
  } catch {
    return [];
  }
}

// 重写页面组件，使用 searchParams 参数但不指定类型
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function SearchPage({ searchParams }: { searchParams: any }) {
  // 从 searchParams 获取查询参数
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  
  // 如果没有查询参数，重定向到首页
  if (!query) {
    redirect('/');
  }
  
  // 直接搜索网站
  const services = await searchServices(query);
  
  // 按分类分组
  const servicesByCategory: Record<string, Service[]> = {};
  services.forEach(service => {
    const categoryName = service.categoryName || '未分类';
    if (!servicesByCategory[categoryName]) {
      servicesByCategory[categoryName] = [];
    }
    servicesByCategory[categoryName].push(service);
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            &ldquo;{query}&rdquo; 的搜索结果
          </h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            返回首页
          </Link>
        </div>
        
        {services.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">没有找到相关结果</p>
            <p className="mt-2 text-sm text-gray-400">
              请尝试使用其他关键词搜索
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(servicesByCategory).map(([categoryName, categoryServices]) => (
              <div key={categoryName} className="border-t pt-4 first:border-t-0 first:pt-0">
                <h3 className="text-lg font-medium mb-3 text-gray-700">
                  {categoryName} ({categoryServices.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categoryServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">
          没有找到您需要的AI服务？请联系管理员添加更多服务。
        </p>
      </div>
    </div>
  );
} 