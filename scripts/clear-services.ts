import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearServices() {
  try {
    console.log('开始清除服务数据...');
    
    // 删除所有服务
    const deletedCount = await prisma.service.deleteMany({});
    
    console.log(`已删除 ${deletedCount.count} 个服务`);
    console.log('服务数据清除完成！');
  } catch (error) {
    console.error('清除服务数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行清除函数
clearServices(); 