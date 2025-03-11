import { prisma } from '@/lib/prisma';
import CategorySection from '@/components/CategorySection';
import ServiceCard from '@/components/ServiceCard';
import { Category, ServiceWithCategory } from '@/types';
import SmoothScrollScript from '@/components/SmoothScrollScript';
import BackToTopButton from '@/components/BackToTopButton';
import CategoryNavStyles from '@/components/CategoryNavStyles';
import CategoryIcon from '@/components/CategoryIcon';
import { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
// 获取所有分类及其网站
async function getCategoriesWithServices(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      services: {
        take: 12,
        orderBy: {
          clickCount: 'desc',
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    } as Prisma.CategoryOrderByWithRelationInput,
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

// 定义Banner类型
interface Banner {
  id: number;
  title: string;
  url: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// 获取头图数据
async function getActiveBanner(): Promise<Banner | null> {
  try {
    // 获取一个启用状态的头图，按排序和创建时间排序
    // 由于Prisma客户端尚未更新，使用原始SQL查询
    const banners = await prisma.$queryRaw<Banner[]>`
      SELECT * FROM Banner 
      WHERE isActive = true 
      ORDER BY sortOrder ASC, createdAt DESC 
      LIMIT 1
    `;

    return banners && banners.length > 0 ? banners[0] : null;
  } catch (error) {
    console.error('获取头图失败:', error);
    return null;
  }
}

export default async function Home() {
  const categories = await getCategoriesWithServices();
  const popularServices = await getPopularServices();
  const banner = await getActiveBanner();

  return (
    <div className="relative">
      {/* 左侧分类导航 - 固定在左侧，不影响主内容宽度 */}
      <div className="hidden xl:block w-30 fixed left-[max(0px,calc(50%-610px))] top-[103px] bg-white bg-opacity-80 backdrop-blur-sm shadow-sm rounded-lg overflow-y-auto max-h-[calc(100vh-120px)] z-10">
        <h2 className="font-medium text-brand-400 px-3 py-1.5 border-b-2 border-brand-50">分类</h2>
        <div className="flex flex-col space-y-1 p-2">
          {categories.map(category => (
            <a
              key={category.id}
              href={`#category-${category.slug}`}
              className="category-nav-link text-gray-600 px-3 py-1 border-2 border-transparent hover:border-brand-100 hover:bg-brand-50 rounded transition-all duration-200 relative group flex items-center"
            >
              <CategoryIcon icon={category.icon} name={category.name} size={20} />
              <span className="truncate ml-2">{category.name}</span>
              <span className="absolute inset-0 bg-brand-50 border-brand-100 opacity-0 group-[.active-category]:opacity-100 rounded transition-opacity -z-10"></span>
            </a>
          ))}
        </div>

        {/* 返回顶部链接 */}
        <div className="border-t-2 border-brand-50 p-2">
          <BackToTopButton className="flex items-center justify-center text-gray-500 text-sm w-full px-2 py-1.5 border-2 bg-brand-50/50 hover:text-brand-400 border-brand-50 hover:bg-brand-50 hover:border-brand-100 rounded transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
            返回顶部
          </BackToTopButton>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8 max-w-[960px]">
        {/* 头图 New */}
        <div className="flex justify-between items-center mb-10 p-4 bg-white bg-opacity-80 rounded-lg shadow-sm">
          <div className="p-4">
            <Link
              href="/t/claude"
              className="text-2xl font-bold text-gray-800 hover:text-brand-500"
            >
              Claude 3.7 Sonnet and Claude Code
            </Link>
            <p className="text-gray-500 text-sm">
              Claude 3.7 Sonnet and Claude Code 是 Claude 3.7 的两个版本，分别是 Sonnet 和 Code。
            </p>
          </div>
          <div>
            <Image src="/public/claude3.7.png" alt="Claude" width={450} height={150} />
          </div>
        </div>

        {/* 头图 */}
        {banner && (
          <div className="w-full h-[200px] bg-brand-50 rounded-lg mb-10 overflow-hidden">
            <a
              href={banner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative"
            >
              <div className="relative w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/50 bg-opacity-50 text-white py-3 px-4">
                <h3 className="text-lg font-medium">{banner.title}</h3>
              </div>
            </a>
          </div>
        )}

        {/* 移动端分类导航 */}
        <div className="xl:hidden mb-10">
          <h2 className="text-2xl font-bold mb-2 pb-2">分类</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {categories.map(category => (
              <a
                key={category.id}
                href={`#category-${category.slug}`}
                className="px-4 py-2 bg-white outline-2 outline-none hover:outline-brand-200 transition-all duration-200 rounded-lg shadow-sm text-gray-700 hover:text-gray-900 flex items-center"
                data-category-id={`category-${category.slug}`}
              >
                <CategoryIcon icon={category.icon} name={category.name} size={20} />
                <span className="ml-2">{category.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 热门网站 */}
        {popularServices.length > 0 && (
          <div className="mb-10">
            <h2 className="font-bold text-2xl mb-2 text-gray-800 pb-2">热门</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* 所有分类及网站 */}
        <div className="space-y-10">
          {categories.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              services={category.services || []}
            />
          ))}
        </div>

        {/* 移动端返回顶部按钮 */}
        <div className="xl:hidden fixed bottom-6 right-6">
          <BackToTopButton className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg text-gray-400 hover:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
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
