import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/utils/auth';
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse, notFoundResponse } from '@/utils/api';
import { RouteContext } from '../../categories/[id]/route';

// 获取单个Banner
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析Promise获取参数
    const resolvedParams = await context.params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return errorResponse('无效的ID');
    }
    
    // 获取Banner
    const banner = await prisma.banner.findUnique({
      where: { id }
    });
    
    if (!banner) {
      return notFoundResponse('头图不存在');
    }
    
    return successResponse(banner);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// 更新Banner
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析Promise获取参数
    const resolvedParams = await context.params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return errorResponse('无效的ID');
    }
    
    // 解析请求数据
    const body = await request.json();
    
    // 验证数据
    if (!body.title || !body.url || !body.imageUrl) {
      return errorResponse('标题、链接地址和图片URL不能为空');
    }
    
    // 检查Banner是否存在
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });
    
    if (!existingBanner) {
      return notFoundResponse('头图不存在');
    }
    
    // 更新Banner
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title,
        url: body.url,
        imageUrl: body.imageUrl,
        isActive: body.isActive !== undefined ? body.isActive : existingBanner.isActive,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : existingBanner.sortOrder
      }
    });
    
    return successResponse(banner, '头图更新成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// 删除Banner
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析Promise获取参数
    const resolvedParams = await context.params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return errorResponse('无效的ID');
    }
    
    // 检查Banner是否存在
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });
    
    if (!existingBanner) {
      return notFoundResponse('头图不存在');
    }
    
    // 删除Banner
    await prisma.banner.delete({
      where: { id }
    });
    
    return successResponse(null, '头图删除成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
} 