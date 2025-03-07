import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import { Category } from '@/types';
import { getSiteSettings } from '@/utils/settings';

// 动态生成元数据
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  // 确保params是已解析的
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
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
    description: `${category.name}分类下的AI服务和应用`,
  };
}

// 获取分类及其服务
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
  { params }: { params: Promise<{ slug: string }> }
) {
  // 确保params是已解析的
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const category = await getCategoryWithServices(slug);
  
  // 如果分类不存在，返回404
  if (!category) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          返回首页
        </Link>
        <h1 className="text-3xl font-bold mt-2">{category.name}</h1>
        <p className="text-gray-600">共 {category.services?.length || 0} 个服务</p>
      </div>
      
      {(category.services?.length || 0) > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {category.services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">该分类下暂无服务</p>
        </div>
      )}
    </div>
  );
} 