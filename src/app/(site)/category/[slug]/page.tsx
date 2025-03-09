import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import { Category } from '@/types';
import { getSiteSettings } from '@/utils/settings';
import Image from 'next/image';
import { NoData } from '@/components/icons/NoData';

// 定义路由参数类型
export interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 动态生成元数据
export async function generateMetadata(
  { params, searchParams }: CategoryPageProps
): Promise<Metadata> {
  // 解析Promise获取参数
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // 解析searchParams
  await searchParams;
  
  // 查找分类
  const category = await prisma.category.findUnique({
    where: { slug: slug } as { slug: string },
  }) as unknown as Category | null;
  
  if (!category) {
    return {
      title: '分类不存在',
    };
  }
  
  // 获取网站设置
  const settings = await getSiteSettings();
  
  return {
    title: `${category.name} - ${settings.siteName}`,
    description: category.description || `${category.name}分类下的AI服务和应用`,
  };
}

// 获取分类及其网站
async function getCategoryWithServices(slug: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { slug: slug } as { slug: string },
    include: {
      services: {
        orderBy: {
          clickCount: 'desc',
        },
      },
    },
  }) as unknown as Category | null;
  
  return category;
}

export default async function CategoryPage(
  { params, searchParams }: CategoryPageProps
) {
  // 解析Promise获取参数
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // 解析searchParams
  await searchParams;
  
  const category = await getCategoryWithServices(slug);
  
  // 如果分类不存在，返回404
  if (!category) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-brand-400 hover:text-brand-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          返回首页
        </Link>
      </div>
      <div className="bg-white bg-opacity-60 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex sm:flex-row flex-col items-center justify-center sm:justify-start">
          <h1 className="text-3xl font-bold flex items-center">
            {category.icon ? (
              <div className="relative w-10 h-10 mr-2 flex-shrink-0">
                <Image
                  src={category.icon}
                  alt={category.name}
                  fill
                  className="object-contain"
                  unoptimized={category.icon.endsWith('.svg')}
                  priority
                />
              </div>
            ) : (
              <div className="w-10 h-10 mr-2 flex items-center justify-center bg-brand-100 rounded-full flex-shrink-0">
                <span className="text-lg font-bold text-brand-700">{category.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span className="ml-1">{category.name}</span>
          </h1>

          {category.description && (
          <div className="mt-2 sm:mt-0 ml-0 sm:ml-8 text-center">
            <p className="text-gray-500 leading-relaxed">{category.description}</p>
          </div>
        )}
        </div>
      </div>

      <h3 className="text-gray-500 mb-4">共 {category.services?.length || 0} 个网站</h3>
      
      {(category.services?.length || 0) > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-10 text-center flex flex-col items-center justify-center">
          <NoData />
          <p className="text-gray-400 mt-8">该分类下暂无数据</p>
        </div>
      )}
    </div>
  );
} 