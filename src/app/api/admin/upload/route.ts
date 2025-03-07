import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/utils/auth';
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse } from '@/utils/api';
import { saveFile } from '@/utils/upload';

// 处理文件上传
export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // 验证文件
    if (!file) {
      return errorResponse('未提供文件');
    }
    
    // 验证文件类型
    const validTypes = [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'image/webp', 
      'image/svg+xml'  // 添加SVG MIME类型
    ];
    if (!validTypes.includes(file.type)) {
      return errorResponse('文件类型不支持，请上传图片文件（支持JPG、PNG、GIF、WebP、SVG格式）');
    }
    
    // 验证文件大小（最大2MB）
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return errorResponse('文件大小超过限制，最大2MB');
    }
    
    // 保存文件
    const path = await saveFile(file);
    
    return successResponse({ path }, '文件上传成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
} 