import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import esClient from '@/lib/elasticsearch';
import ServiceCard from '@/components/ServiceCard';

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
};

// Elasticsearch搜索结果类型
interface SearchHit {
  _source: {
    id: number;
    name: string;
    url: string;
    description: string;
    icon: string | null;
    clickCount: number;
    categoryId: number;
    categoryName?: string;
  };
}

export const metadata: Metadata = {
  title: '搜索结果 - AI导航',
  description: '搜索AI服务和应用',
};

// 搜索服务
async function searchServices(query: string): Promise<Service[]> {
  if (!query) return [];
  
  try {
    const response = await esClient.search({
      index: 'services',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name^3', 'description^2', 'categoryName'],
            fuzziness: 'AUTO',
          },
        },
        sort: [
          { _score: { order: 'desc' } },
          { clickCount: { order: 'desc' } },
        ],
      },
    });
    
    // 提取搜索结果
    const hits = (response.hits?.hits || []) as SearchHit[];
    return hits.map((hit) => ({
      id: hit._source.id,
      name: hit._source.name,
      url: hit._source.url,
      description: hit._source.description,
      icon: hit._source.icon,
      clickCount: hit._source.clickCount,
      categoryId: hit._source.categoryId,
      categoryName: hit._source.categoryName,
    }));
  } catch (error) {
    console.error('搜索服务失败:', error);
    return [];
  }
}

// 使用函数参数直接获取searchParams
export default async function SearchPage() {
  // 从URL中获取查询参数
  const url = new URL(globalThis.location?.href || 'http://localhost:3000');
  const query = url.searchParams.get('q') || '';
  
  // 如果没有查询参数，重定向到首页
  if (!query) {
    redirect('/');
  }
  
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
            &ldquo;{query}&rdquo; 的搜索结果 ({services.length})
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