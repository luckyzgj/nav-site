import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, serverErrorResponse } from '@/utils/api';

// 增加服务点击次数
export async function POST(request: NextRequest) {
  try {
    // 从URL中获取ID参数
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idStr = pathParts[pathParts.length - 2]; // 获取倒数第二个部分，即ID
    const id = parseInt(idStr, 10);
    
    if (isNaN(id)) {
      return errorResponse('无效的服务ID');
    }
    
    // 查找服务
    const service = await prisma.service.findUnique({
      where: { id },
    });
    
    if (!service) {
      return errorResponse('服务不存在', 404);
    }
    
    // 更新点击次数
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
    
    return successResponse({ clickCount: updatedService.clickCount });
  } catch (error) {
    return serverErrorResponse(error);
  }
} 