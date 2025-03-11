import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/utils/auth';

export async function POST() {
  // 创建响应
  const response = NextResponse.json({
    success: true,
    message: '登出成功',
  });

  // 清除认证Cookie
  clearAuthCookie(response);

  return response;
}
