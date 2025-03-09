import { NextResponse } from 'next/server';

// 成功响应
export function successResponse<T>(data: T, message = '操作成功') {
  return NextResponse.json({
    success: true,
    message,
    data,
  });
}

// 错误响应
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

// 未授权响应
export function unauthorizedResponse(message = '未授权访问') {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 401 }
  );
}

// 未找到响应
export function notFoundResponse(message = '资源不存在') {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 404 }
  );
}

// 服务器错误响应
export function serverErrorResponse(error: Error | unknown) {
  console.error('服务器错误:', error);
  return NextResponse.json(
    {
      success: false,
      message: '服务器内部错误',
    },
    { status: 500 }
  );
} 