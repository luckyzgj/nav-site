import { prisma } from '@/lib/prisma';
import CategorySection from '@/components/CategorySection';
import ServiceCard from '@/components/ServiceCard';
import { Category, ServiceWithCategory } from '@/types';
import SmoothScrollScript from '@/components/SmoothScrollScript';
import BackToTopButton from '@/components/BackToTopButton';
import CategoryNavStyles from '@/components/CategoryNavStyles';

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
    <div className="relative">
      {/* 左侧分类导航 - 固定在左侧，不影响主内容宽度 */}
      <div className="hidden xl:block w-36 fixed left-[max(0px,calc(50%-640px))] top-24 bg-white bg-opacity-70 backdrop-blur-sm shadow-sm rounded-lg overflow-y-auto max-h-[calc(100vh-120px)] z-10">
        <h2 className="font-bold text-gray-700 px-3 py-2 border-b-2 border-brand-50">
          分类导航
        </h2>
        <div className="flex flex-col space-y-1 mt-2">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#category-${category.slug}`}
              className="category-nav-link px-3 py-2 border-l-4 border-transparent hover:border-brand-400 hover:bg-gray-50 transition-all duration-200 rounded text-gray-700 hover:text-gray-900 relative group"
            >
              {category.name}
              <span className="absolute inset-0 bg-brand-50 opacity-0 group-[.active-category]:opacity-100 rounded transition-opacity -z-10"></span>
            </a>
          ))}
          
          {/* 返回顶部链接 */}
          <div className="pt-4 mt-2 border-t-2 border-brand-50">
            <BackToTopButton className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              返回顶部
            </BackToTopButton>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 - 保持原有宽度 */}
      <div className="container mx-auto px-4 py-8">
        {/* 移动端分类导航 */}
        <div className="xl:hidden mb-10">
          <h2 className="font-bold mb-2 text-gray-800 pb-2">
            分类导航
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#category-${category.slug}`}
                className="category-nav-link px-4 py-2 bg-white border-2 border-brand-100 hover:border-brand-300 transition-all duration-200 rounded-full text-gray-700 hover:text-gray-900"
                data-category-id={`category-${category.slug}`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
        
        {/* 热门网站 */}
        {popularServices.length > 0 && (
          <div className="mb-10">
            <h2 className="font-bold mb-2 text-gray-800 pb-2">
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
        
        {/* 移动端返回顶部按钮 */}
        <div className="xl:hidden fixed bottom-6 right-6">
          <BackToTopButton className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </BackToTopButton>
        </div>
      </div>
      
      {/* 添加分类导航样式 */}
      <CategoryNavStyles />
      
      {/* 添加平滑滚动功能 */}
      <SmoothScrollScript />
    </div>
  );
} 