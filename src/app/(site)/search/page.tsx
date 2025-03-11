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

// 定义页面参数类型
interface SearchPageProps {
  params: Promise<Record<string, never>>; // 空参数对象，因为搜索页面没有路由参数
  searchParams: Promise<{ q?: string }>;
}

// 动态生成元数据
export async function generateMetadata({
  searchParams,
  params,
}: SearchPageProps): Promise<Metadata> {
  // 解析Promise获取参数
  await params;

  // 解析searchParams
  const resolvedSearchParams = await searchParams;

  // 获取网站设置
  const settings = await getSiteSettings();
  const query = resolvedSearchParams?.q || '';

  return {
    title: query ? `${query} - 搜索结果 - ${settings.siteName}` : `搜索 - ${settings.siteName}`,
    description: settings.siteDescription,
  };
}

// 搜索服务
async function searchServices(query: string): Promise<Service[]> {
  if (!query) return [];

  try {
    // 使用MySQL搜索API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/search?q=${encodeURIComponent(query)}`,
      {
        cache: 'no-store',
      }
    );

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

// 使用正确的Next.js 15参数类型
export default async function SearchPage({ searchParams, params }: SearchPageProps) {
  // 解析Promise获取参数
  await params;

  // 解析searchParams
  const resolvedSearchParams = await searchParams;

  // 从 searchParams 获取查询参数
  const query = typeof resolvedSearchParams?.q === 'string' ? resolvedSearchParams.q : '';

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
    <div className="container mx-auto px-4 py-8 max-w-[960px]">
      <div className="pl-4 relative -bottom-1">
        <Link
          href="/"
          className="text-brand-300 hover:text-brand-400 bg-white bg-opacity-80 pl-2 pr-3.5 py-1 rounded-t-lg text-sm inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-brand-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回首页
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6 bg-white bg-opacity-60 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold">
          关键词 <span className="text-brand-400">&ldquo;{query}&rdquo;</span> 的搜索结果：
        </h2>
      </div>

      <div className="">
        {services.length === 0 ? (
          <div className="bg-white bg-opacity-60 rounded-lg shadow-sm p-6 text-center py-10">
            <p className="text-gray-500">没有找到相关结果</p>
            <p className="mt-2 text-sm text-gray-400">请尝试使用其他关键词搜索</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(servicesByCategory).map(([categoryName, categoryServices]) => (
              <div key={categoryName} className="bg-white bg-opacity-60 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-medium mb-3 text-gray-700">
                  {categoryName} ({categoryServices.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryServices.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
