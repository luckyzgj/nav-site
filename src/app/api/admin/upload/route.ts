import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyAdmin } from '@/utils/auth';
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse } from '@/utils/api';

// 文件上传API
export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return unauthorizedResponse();
    }
    
    // 解析FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return errorResponse('未找到文件');
    }
    
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return errorResponse('不支持的文件类型，请上传JPG、PNG、GIF或WEBP格式的图片');
    }
    
    // 验证文件大小（最大5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return errorResponse('文件大小不能超过5MB');
    }
    
    // 生成文件名
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop() || 'jpg';
    const fileName = `banner_${timestamp}.${extension}`;
    
    // 确保上传目录存在
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'banners');
    await mkdir(uploadDir, { recursive: true });
    
    // 保存文件
    const filePath = join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // 返回文件URL
    const fileUrl = `/uploads/banners/${fileName}`;
    
    return successResponse({ url: fileUrl }, '文件上传成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
} 