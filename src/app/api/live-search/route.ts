import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, serverErrorResponse } from '@/utils/api';

// 实时搜索API
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // 如果没有查询参数，返回空数组
    if (!query || query.trim() === '') {
      return successResponse([]);
    }

    // 使用MySQL的LIKE查询搜索服务
    const services = await prisma.service.findMany({
      where: {
        OR: [{ name: { contains: query } }, { description: { contains: query } }],
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        clickCount: 'desc',
      },
      take: 10, // 只返回前10个结果
    });

    // 格式化结果
    const formattedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      url: service.url,
      description: service.description,
      icon: service.icon,
      clickCount: service.clickCount,
      categoryId: service.categoryId,
      categoryName: service.category.name,
      categorySlug: service.category.slug,
    }));

    return successResponse(formattedServices);
  } catch (error) {
    console.error('实时搜索失败:', error);
    return serverErrorResponse(error);
  }
}
