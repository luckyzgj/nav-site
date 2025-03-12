import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/utils/auth';
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
} from '@/utils/api';
import { redisHelper } from '@/lib/redis';
import { Prisma } from '@prisma/client';
import type { Tag } from '@prisma/client';

// 缓存时间（秒）
const CACHE_TTL = 30; // 30秒

// 获取所有标签
export async function GET(request: NextRequest) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }

    // 获取分页参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const sortOrder = searchParams.get('sortOrder') || 'descend';

    // 构建缓存键
    const cacheKey = `admin:tags:${page}:${pageSize}:${sortOrder}`;

    // 尝试从缓存获取结果
    const cachedResult = await redisHelper.get(cacheKey);
    if (cachedResult) {
      return successResponse(cachedResult);
    }

    // 获取所有标签及其关联的服务数量
    const tags = await prisma.$queryRaw<Array<Tag & { serviceCount: bigint }>>`
      SELECT 
        t.*,
        COUNT(st.tagId) as serviceCount
      FROM Tag t
      LEFT JOIN ServiceTag st ON t.id = st.tagId
      GROUP BY t.id
      ORDER BY 
        serviceCount ${sortOrder === 'descend' ? Prisma.sql`DESC` : Prisma.sql`ASC`},
        t.name ASC
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `;

    // 获取总数
    const total = await prisma.tag.count();

    // 格式化返回数据
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      serviceCount: Number(tag.serviceCount),
    }));

    const result = {
      data: formattedTags,
      pagination: {
        current: page,
        pageSize,
        total,
      },
    };

    // 缓存结果
    await redisHelper.set(cacheKey, result, {
      ex: CACHE_TTL,
    });

    return successResponse(result);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return serverErrorResponse('获取标签列表失败');
  }
}

// 创建新标签
export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }

    // 解析请求体
    const body = await request.json();
    const { name } = body;

    // 验证必填字段
    if (!name) {
      return errorResponse('标签名称不能为空');
    }

    // 检查标签名是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: {
        name,
      },
    });

    if (existingTag) {
      // 如果标签已存在，直接返回已存在的标签
      return successResponse(existingTag);
    }

    // 创建新标签
    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });

    // 清除标签列表缓存
    const keys = await redisHelper.keys('admin:tags:*');
    if (keys.length > 0) {
      await redisHelper.del(...keys);
    }

    return successResponse(tag);
  } catch (error) {
    console.error('创建标签失败:', error);
    return serverErrorResponse('创建标签失败');
  }
}
