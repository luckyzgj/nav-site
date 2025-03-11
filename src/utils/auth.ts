import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 身份验证Cookie名称
const AUTH_COOKIE_NAME = 'admin_token';

// 设置身份验证Cookie
export const setAuthCookie = (response: NextResponse, adminId: number) => {
  // 简单的身份验证令牌，实际项目中应使用JWT或其他更安全的方式
  const token = Buffer.from(`${adminId}:${Date.now()}`).toString('base64');

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7天
    sameSite: 'strict',
  });

  return token;
};

// 清除身份验证Cookie
export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.delete(AUTH_COOKIE_NAME);
};

// 从请求中获取管理员ID
export const getAdminIdFromRequest = (request: NextRequest): number | null => {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [adminId] = decoded.split(':');
    const id = parseInt(adminId, 10);
    return id;
  } catch (error) {
    console.error('解析Cookie失败:', error);
    return null;
  }
};

// 验证管理员身份 - 仅检查Cookie是否存在，不查询数据库
// 这个函数可以在中间件中使用，因为它不依赖Prisma
export const verifyAdminToken = (request: NextRequest): boolean => {
  const adminId = getAdminIdFromRequest(request);
  const isValid = adminId !== null && adminId > 0;
  return isValid;
};

// 验证管理员身份 - 完整验证，包括数据库查询
// 这个函数不应在中间件中使用，只能在API路由或页面组件中使用
export const verifyAdmin = async (request: NextRequest): Promise<boolean> => {
  const adminId = getAdminIdFromRequest(request);
  if (!adminId) {
    return false;
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    const isValid = !!admin;
    return isValid;
  } catch (error) {
    console.error('验证管理员失败:', error);
    return false;
  }
};
