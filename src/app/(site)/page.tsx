import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CategorySection from '@/components/CategorySection';
import ServiceCard from '@/components/ServiceCard';
import { Category, ServiceWithCategory } from '@/types';

// 获取所有分类及其网站
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

// 获取热门网站
async function getPopularServices(): Promise<ServiceWithCategory[]> {
  const popularServices = await prisma.service.findMany({
    take: 12,
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
      <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
        <h2 className="font-bold mb-4 text-gray-800 pb-2">
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
      
      {/* 热门网站 */}
      {popularServices.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold mb-4 text-gray-800 pb-2">
            热门网站
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* 所有分类及网站 */}
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