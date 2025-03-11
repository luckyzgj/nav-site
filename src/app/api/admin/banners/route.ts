import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/utils/auth';
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
} from '@/utils/api';

// 获取所有Banner
export async function GET(request: NextRequest) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }

    // 获取所有Banner，按sortOrder和创建时间排序
    const banners = await prisma.banner.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return successResponse(banners);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// 创建Banner
export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }

    // 解析请求数据
    const body = await request.json();

    // 验证数据
    if (!body.title || !body.url || !body.imageUrl) {
      return errorResponse('标题、链接地址和图片URL不能为空');
    }

    // 创建Banner
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        url: body.url,
        imageUrl: body.imageUrl,
        description: body.description || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        sortOrder: body.sortOrder || 0,
      },
    });

    return successResponse(banner, '头图创建成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
}
