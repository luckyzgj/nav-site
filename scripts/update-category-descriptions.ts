import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 分类介绍数据
const categoryDescriptions: { [key: string]: string } = {
  'chat': '智能对话助手集合，包括ChatGPT、Claude等AI聊天工具，帮助回答问题、创作内容和提供智能对话服务。',
  'image': '图像生成与处理工具，涵盖AI绘画、图像编辑和设计软件，让创意无限可能。',
  'write': '智能写作与内容创作工具，提供文案撰写、文本优化和语法检查，提升写作效率与质量。',
  'audio': '音频处理与生成工具，包括语音合成、音乐创作和音频编辑，满足各类音频需求。',
  'video': '视频制作与编辑工具，涵盖AI视频生成、剪辑软件和特效处理，让视频创作更简单高效。',
  'dev': '开发者工具与资源，包括代码编辑器、版本控制和云服务平台，助力软件开发全流程。',
  'doc': '文档管理与协作工具，提供文档编辑、知识管理和团队协作功能，提升信息组织效率。',
  'design': '设计工具与资源，涵盖UI/UX设计、平面设计和3D建模，满足各类设计创作需求。',
  'academic': '学术研究与教育工具，包括论文写作、文献管理和学习辅助，支持学术研究与教育活动。',
  'work': '办公与生产力工具，提供项目管理、团队协作和效率提升应用，优化工作流程。',
  'search': '搜索与信息获取工具，包括搜索引擎、数据分析和市场调研，帮助发现和整理信息。',
  'translate': '翻译与语言工具，提供多语言翻译、语言学习和跨文化交流服务，打破语言障碍。',
  'tools': '实用工具集合，涵盖各类日常应用和专业工具，解决各种实际问题和需求。',
  'others': '其他实用资源，收录不属于以上分类的优质工具和服务，满足多样化需求。'
};

// 更新分类介绍
async function updateCategoryDescriptions() {
  try {
    console.log('开始更新分类介绍...');
    
    // 获取所有分类
    const categories = await prisma.category.findMany();
    console.log(`找到 ${categories.length} 个分类`);
    
    // 更新每个分类的介绍
    for (const category of categories) {
      const description = categoryDescriptions[category.slug];
      
      if (description) {
        await prisma.category.update({
          where: { id: category.id },
          data: { description }
        });
        console.log(`已更新分类 "${category.name}" 的介绍`);
      } else {
        console.log(`警告: 未找到分类 "${category.name}" (${category.slug}) 的介绍`);
      }
    }
    
    console.log('分类介绍更新完成！');
  } catch (error) {
    console.error('更新分类介绍时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行更新
updateCategoryDescriptions(); 