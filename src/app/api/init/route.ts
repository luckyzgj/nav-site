import { initializeSystem } from '@/lib/init';
import { successResponse, serverErrorResponse } from '@/utils/api';

// 初始化系统
export async function GET() {
  try {
    await initializeSystem();
    return successResponse(null, '系统初始化成功');
  } catch (error) {
    return serverErrorResponse(error);
  }
}
