import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CategorySection from '@/components/CategorySection';
import ServiceLink from '@/components/ServiceLink';
import { Category, ServiceWithCategory } from '@/types';

// 获取所有分类及其服务
async function getCategoriesWithServices(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      services: {
        orderBy: {
          clickCount: 'desc',
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });
  
  return categories as unknown as Category[];
}

// 获取热门服务
async function getPopularServices(): Promise<ServiceWithCategory[]> {
  const popularServices = await prisma.service.findMany({
    take: 10,
    orderBy: {
      clickCount: 'desc',
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        } as { name: boolean; slug: boolean },
      },
    },
  });
  
  return popularServices.map(service => ({
    ...service,
    categoryName: service.category.name,
    categorySlug: service.category.slug,
  })) as unknown as ServiceWithCategory[];
}

export default async function Home() {
  const categories = await getCategoriesWithServices();
  const popularServices = await getPopularServices();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 分类导航 */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          分类导航
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* 热门服务 */}
      {popularServices.length > 0 && (
        <div className="mb-10 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            热门服务
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {popularServices.map((service) => (
              <div key={service.id} className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Link 
                    href={`/category/${service.categorySlug}`}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                  >
                    {service.categoryName}
                  </Link>
                  <span className="ml-auto text-xs text-gray-500">
                    {service.clickCount} 次点击
                  </span>
                </div>
                <ServiceLink 
                  serviceId={service.id}
                  url={service.url}
                  className="font-medium text-blue-600 hover:text-blue-800 block truncate"
                >
                  {service.name}
                </ServiceLink>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 所有分类及服务 */}
      <div className="space-y-10">
        {categories.map((category) => (
          <CategorySection 
            key={category.id} 
            category={category} 
            services={category.services || []}
          />
        ))}
      </div>
    </div>
  );
} 