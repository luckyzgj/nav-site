import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/utils/api';

const prisma = new PrismaClient();

// 清空所有网站数据的 API
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse('未授权访问');
    }

    // 删除所有网站数据
    await prisma.service.deleteMany({});

    return successResponse('所有网站数据已清空');
  } catch (error) {
    console.error('清空网站数据失败:', error);
    return serverErrorResponse('清空网站数据失败');
  } finally {
    await prisma.$disconnect();
  }
}
