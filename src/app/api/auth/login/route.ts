import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { setAuthCookie } from '@/utils/auth';
import { errorResponse, serverErrorResponse } from '@/utils/api';

export async function POST(request: NextRequest) {
  try {
    // 记录请求信息
    console.log('收到登录请求:', request.url);
    
    let body;
    try {
      body = await request.json();
      console.log('登录请求体解析成功');
    } catch (parseError) {
      console.error('解析请求体失败:', parseError);
      return errorResponse('无效的请求格式');
    }
    
    const { username, password } = body;
    
    // 验证请求数据
    if (!username || !password) {
      console.log('登录参数不完整:', { username: !!username, password: !!password });
      return errorResponse('用户名和密码不能为空');
    }
    
    // 查找管理员
    let admin;
    try {
      admin = await prisma.admin.findUnique({
        where: { username },
      });
      console.log('数据库查询结果:', { found: !!admin });
    } catch (dbError) {
      console.error('数据库查询失败:', dbError);
      return serverErrorResponse(dbError);
    }
    
    // 验证管理员存在
    if (!admin) {
      return errorResponse('用户名或密码错误');
    }
    
    // 验证密码
    let passwordValid;
    try {
      passwordValid = await compare(password, admin.password);
      console.log('密码验证结果:', passwordValid);
    } catch (bcryptError) {
      console.error('密码比对失败:', bcryptError);
      return serverErrorResponse(bcryptError);
    }
    
    if (!passwordValid) {
      return errorResponse('用户名或密码错误');
    }
    
    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        id: admin.id,
        username: admin.username,
      },
    });
    
    // 设置认证Cookie
    try {
      const token = setAuthCookie(response, admin.id);
      console.log('认证Cookie设置成功:', !!token);
    } catch (cookieError) {
      console.error('设置Cookie失败:', cookieError);
      return serverErrorResponse(cookieError);
    }
    
    console.log('登录成功，返回响应');
    return response;
  } catch (error) {
    console.error('登录处理错误:', error);
    return serverErrorResponse(error);
  }
} 