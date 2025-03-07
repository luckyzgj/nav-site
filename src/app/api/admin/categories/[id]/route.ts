import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/utils/auth';
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse } from '@/utils/api';

// 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析ID
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return errorResponse('无效的分类ID');
    }
    
    // 查找分类
    const category = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!category) {
      return errorResponse('分类不存在', 404);
    }
    
    return successResponse(category);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析ID
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return errorResponse('无效的分类ID');
    }
    
    // 解析请求数据
    const body = await request.json();
    const { name, slug } = body;
    
    // 验证数据
    if (!name || typeof name !== 'string') {
      return errorResponse('分类名称不能为空');
    }
    
    if (!slug || typeof slug !== 'string') {
      return errorResponse('英文标识不能为空');
    }
    
    // 验证slug格式
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return errorResponse('英文标识只能包含小写字母、数字和连字符');
    }
    
    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!category) {
      return errorResponse('分类不存在', 404);
    }
    
    // 检查分类名称是否已存在（排除当前分类）
    const existingCategoryByName = await prisma.category.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });
    
    if (existingCategoryByName) {
      return errorResponse('分类名称已存在');
    }
    
    // 检查slug是否已存在（排除当前分类）
    const existingCategoryBySlug = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      } as { slug: string; id: { not: number } },
    });
    
    if (existingCategoryBySlug) {
      return errorResponse('英文标识已存在');
    }
    
    // 更新分类
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, slug } as { name: string; slug: string },
    });
    
    return successResponse(updatedCategory, '更新分类成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析ID
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return errorResponse('无效的分类ID');
    }
    
    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        services: {
          select: { id: true },
        },
      },
    });
    
    if (!category) {
      return errorResponse('分类不存在', 404);
    }
    
    // 检查分类下是否有服务
    if (category.services.length > 0) {
      // 可以选择返回错误，或者将服务移动到默认分类
      // 这里我们选择返回错误，要求用户先处理分类下的服务
      return errorResponse('该分类下还有服务，请先移动或删除这些服务');
    }
    
    // 删除分类
    await prisma.category.delete({
      where: { id },
    });
    
    return successResponse(null, '删除分类成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
} 