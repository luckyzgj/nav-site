import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// AI工具分类的测试数据
const aiToolsData = [
  { name: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI开发的对话式AI助手，可以回答问题、创作内容、编写代码等。" },
  { name: "Midjourney", url: "https://www.midjourney.com", description: "AI图像生成工具，可以根据文本描述创建高质量艺术图像。" },
  { name: "DALL-E", url: "https://openai.com/dall-e-3", description: "OpenAI的AI图像生成模型，可以根据文本提示创建详细的图像。" },
  { name: "Stable Diffusion", url: "https://stability.ai", description: "开源的AI图像生成模型，可以在本地或云端运行。" },
  { name: "Claude", url: "https://claude.ai", description: "Anthropic开发的AI助手，专注于有帮助、无害和诚实的对话。" },
  { name: "Gemini", url: "https://gemini.google.com", description: "Google的多模态AI模型，可以处理文本、图像、音频等多种输入。" },
  { name: "Jasper", url: "https://www.jasper.ai", description: "AI内容创作平台，帮助营销团队快速生成高质量内容。" },
  { name: "Copy.ai", url: "https://www.copy.ai", description: "AI写作助手，帮助创建营销文案、博客文章等内容。" },
  { name: "Runway", url: "https://runwayml.com", description: "创意工具套件，包含视频编辑、图像生成等AI功能。" },
  { name: "Synthesia", url: "https://www.synthesia.io", description: "AI视频生成平台，可以创建逼真的AI人物视频。" },
  { name: "Descript", url: "https://www.descript.com", description: "音频和视频编辑工具，具有AI转录和编辑功能。" },
  { name: "Otter.ai", url: "https://otter.ai", description: "AI会议记录和转录工具，实时记录和总结会议内容。" },
  { name: "Notion AI", url: "https://www.notion.so/product/ai", description: "Notion集成的AI助手，帮助写作、总结和组织信息。" },
  { name: "Grammarly", url: "https://www.grammarly.com", description: "AI写作助手，提供语法检查、风格建议和写作改进。" },
  { name: "Perplexity AI", url: "https://www.perplexity.ai", description: "AI搜索引擎，提供有来源的答案和深入的研究。" },
  { name: "Hugging Face", url: "https://huggingface.co", description: "AI社区和平台，提供开源模型、数据集和工具。" },
  { name: "Replicate", url: "https://replicate.com", description: "运行开源机器学习模型的平台，提供API访问。" },
  { name: "Anthropic", url: "https://www.anthropic.com", description: "AI安全研究公司，开发了Claude等AI助手。" },
  { name: "Cohere", url: "https://cohere.com", description: "提供NLP API的AI公司，专注于文本理解和生成。" },
  { name: "Adept", url: "https://www.adept.ai", description: "构建通用智能系统的AI研究公司，专注于行动型AI。" }
];

// 设计工具分类的测试数据
const designToolsData = [
  { name: "Figma", url: "https://www.figma.com", description: "基于浏览器的协作设计工具，用于UI/UX设计和原型制作。" },
  { name: "Adobe XD", url: "https://www.adobe.com/products/xd.html", description: "Adobe的UI/UX设计和原型制作工具。" },
  { name: "Sketch", url: "https://www.sketch.com", description: "Mac专用的矢量图形编辑器，主要用于UI/UX设计。" },
  { name: "InVision", url: "https://www.invisionapp.com", description: "数字产品设计平台，提供原型制作、协作和工作流工具。" },
  { name: "Canva", url: "https://www.canva.com", description: "在线图形设计平台，提供模板和简单的拖放界面。" },
  { name: "Adobe Photoshop", url: "https://www.adobe.com/products/photoshop.html", description: "专业图像编辑软件，用于照片编辑、合成和数字绘画。" },
  { name: "Adobe Illustrator", url: "https://www.adobe.com/products/illustrator.html", description: "矢量图形设计软件，用于创建徽标、图标和插图。" },
  { name: "Blender", url: "https://www.blender.org", description: "开源3D创作套件，支持建模、动画、渲染等功能。" },
  { name: "Webflow", url: "https://webflow.com", description: "视觉化网页设计工具，无需编码即可创建响应式网站。" },
  { name: "Framer", url: "https://www.framer.com", description: "交互式设计工具，用于创建动画和交互原型。" },
  { name: "Axure RP", url: "https://www.axure.com", description: "专业原型设计工具，支持复杂交互和规格文档。" },
  { name: "Marvel", url: "https://marvelapp.com", description: "设计、原型和协作平台，简化设计工作流程。" },
  { name: "Zeplin", url: "https://zeplin.io", description: "设计交付平台，帮助设计师和开发人员协作。" },
  { name: "Adobe After Effects", url: "https://www.adobe.com/products/aftereffects.html", description: "数字视觉效果、动态图形和合成软件。" },
  { name: "Procreate", url: "https://procreate.art", description: "iPad上的专业数字绘画应用程序。" },
  { name: "CorelDRAW", url: "https://www.coreldraw.com", description: "矢量插图和页面布局软件。" },
  { name: "Affinity Designer", url: "https://affinity.serif.com/designer", description: "专业矢量图形设计软件，是Adobe Illustrator的替代品。" },
  { name: "Affinity Photo", url: "https://affinity.serif.com/photo", description: "专业照片编辑软件，是Adobe Photoshop的替代品。" },
  { name: "ProtoPie", url: "https://www.protopie.io", description: "高保真交互原型设计工具，无需编码。" },
  { name: "Principle", url: "https://principleformac.com", description: "Mac应用程序，用于创建动画和交互式用户界面设计。" }
];

// 开发工具分类的测试数据
const devToolsData = [
  { name: "Visual Studio Code", url: "https://code.visualstudio.com", description: "微软开发的免费、开源代码编辑器，支持多种编程语言和扩展。" },
  { name: "GitHub", url: "https://github.com", description: "基于Git的代码托管和协作平台，支持版本控制和项目管理。" },
  { name: "GitLab", url: "https://gitlab.com", description: "DevOps平台，提供Git仓库管理、CI/CD、监控等功能。" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", description: "程序员问答社区，解决编程问题的最大资源之一。" },
  { name: "Docker", url: "https://www.docker.com", description: "容器化平台，简化应用程序的部署和运行。" },
  { name: "Kubernetes", url: "https://kubernetes.io", description: "容器编排系统，自动化容器部署、扩展和管理。" },
  { name: "Postman", url: "https://www.postman.com", description: "API开发工具，用于测试、文档和协作。" },
  { name: "JetBrains IDEs", url: "https://www.jetbrains.com", description: "专业开发工具套件，包括IntelliJ IDEA、PyCharm等。" },
  { name: "npm", url: "https://www.npmjs.com", description: "JavaScript包管理器，用于共享和重用代码。" },
  { name: "Jira", url: "https://www.atlassian.com/software/jira", description: "项目管理工具，用于敏捷开发和问题跟踪。" },
  { name: "Bitbucket", url: "https://bitbucket.org", description: "Git代码托管服务，集成了Jira和其他Atlassian工具。" },
  { name: "Heroku", url: "https://www.heroku.com", description: "云平台即服务(PaaS)，支持多种编程语言的应用部署。" },
  { name: "AWS", url: "https://aws.amazon.com", description: "亚马逊云服务，提供计算、存储、数据库等云服务。" },
  { name: "Firebase", url: "https://firebase.google.com", description: "Google的移动和Web应用开发平台，提供后端服务和工具。" },
  { name: "MongoDB", url: "https://www.mongodb.com", description: "NoSQL数据库，用于存储大量非结构化数据。" },
  { name: "Redis", url: "https://redis.io", description: "内存数据结构存储，用作数据库、缓存和消息代理。" },
  { name: "Vercel", url: "https://vercel.com", description: "前端开发平台，专注于React、Next.js等框架的部署。" },
  { name: "Netlify", url: "https://www.netlify.com", description: "现代Web项目的部署和托管平台。" },
  { name: "CircleCI", url: "https://circleci.com", description: "持续集成和持续部署平台，自动化构建、测试和部署。" },
  { name: "Jenkins", url: "https://www.jenkins.io", description: "开源自动化服务器，用于构建、部署和自动化项目。" }
];

// 生产力工具分类的测试数据
const productivityToolsData = [
  { name: "Notion", url: "https://www.notion.so", description: "多合一工作空间，结合了笔记、任务管理、数据库等功能。" },
  { name: "Trello", url: "https://trello.com", description: "基于看板的项目管理工具，视觉化任务和工作流程。" },
  { name: "Asana", url: "https://asana.com", description: "工作管理平台，帮助团队组织、跟踪和管理工作。" },
  { name: "Slack", url: "https://slack.com", description: "团队协作和沟通平台，支持频道、直接消息和集成。" },
  { name: "Microsoft Teams", url: "https://www.microsoft.com/microsoft-teams", description: "微软的团队协作平台，集成了聊天、会议和文件共享。" },
  { name: "Zoom", url: "https://zoom.us", description: "视频会议和网络研讨会平台，支持高质量视频和音频。" },
  { name: "Google Workspace", url: "https://workspace.google.com", description: "Google的生产力和协作工具套件，包括Gmail、Docs、Drive等。" },
  { name: "Microsoft 365", url: "https://www.microsoft.com/microsoft-365", description: "微软的生产力套件，包括Word、Excel、PowerPoint等应用程序。" },
  { name: "Evernote", url: "https://evernote.com", description: "笔记应用程序，用于捕获想法、组织信息和管理任务。" },
  { name: "Todoist", url: "https://todoist.com", description: "任务管理应用程序，帮助组织和优先处理任务。" },
  { name: "ClickUp", url: "https://clickup.com", description: "生产力平台，集成了任务、文档、目标、聊天等功能。" },
  { name: "Monday.com", url: "https://monday.com", description: "工作操作系统，帮助团队规划、跟踪和管理工作。" },
  { name: "Airtable", url: "https://airtable.com", description: "部分电子表格、部分数据库的协作平台。" },
  { name: "Calendly", url: "https://calendly.com", description: "约会调度软件，简化会议安排过程。" },
  { name: "Zapier", url: "https://zapier.com", description: "自动化工具，连接不同应用程序并自动化工作流程。" },
  { name: "IFTTT", url: "https://ifttt.com", description: "自动化服务，连接应用程序、设备和服务。" },
  { name: "Miro", url: "https://miro.com", description: "在线协作白板平台，用于远程团队协作。" },
  { name: "Figma", url: "https://www.figma.com", description: "协作设计平台，支持实时协作和设计系统。" },
  { name: "Loom", url: "https://www.loom.com", description: "视频消息平台，用于分享屏幕录制和视频消息。" },
  { name: "1Password", url: "https://1password.com", description: "密码管理器，安全存储密码和敏感信息。" }
];

// 营销工具分类的测试数据
const marketingToolsData = [
  { name: "HubSpot", url: "https://www.hubspot.com", description: "营销、销售和客户服务软件平台，提供CRM和自动化工具。" },
  { name: "Mailchimp", url: "https://mailchimp.com", description: "电子邮件营销平台，用于创建和管理电子邮件活动。" },
  { name: "SEMrush", url: "https://www.semrush.com", description: "SEO和内容营销工具，提供关键词研究、竞争分析等功能。" },
  { name: "Ahrefs", url: "https://ahrefs.com", description: "SEO工具，用于反向链接分析、关键词研究和网站审核。" },
  { name: "Google Analytics", url: "https://analytics.google.com", description: "网站分析工具，跟踪和报告网站流量和用户行为。" },
  { name: "Google Ads", url: "https://ads.google.com", description: "在线广告平台，在Google搜索结果和网络上投放广告。" },
  { name: "Facebook Ads Manager", url: "https://www.facebook.com/business/tools/ads-manager", description: "Facebook广告管理工具，创建和管理Facebook和Instagram广告。" },
  { name: "Hootsuite", url: "https://hootsuite.com", description: "社交媒体管理平台，管理多个社交媒体账户和调度内容。" },
  { name: "Buffer", url: "https://buffer.com", description: "社交媒体管理工具，用于调度帖子和分析性能。" },
  { name: "Canva", url: "https://www.canva.com", description: "在线设计工具，创建社交媒体图形、演示文稿等。" },
  { name: "Hotjar", url: "https://www.hotjar.com", description: "行为分析工具，提供热图、录像和转化漏斗分析。" },
  { name: "Moz", url: "https://moz.com", description: "SEO软件，提供网站审核、排名跟踪和链接研究。" },
  { name: "BuzzSumo", url: "https://buzzsumo.com", description: "内容营销工具，发现热门内容和影响者。" },
  { name: "Sprout Social", url: "https://sproutsocial.com", description: "社交媒体管理和分析平台，用于参与和监控。" },
  { name: "Unbounce", url: "https://unbounce.com", description: "着陆页构建器，用于创建和测试高转化率的着陆页。" },
  { name: "Optimizely", url: "https://www.optimizely.com", description: "A/B测试和实验平台，优化网站和产品体验。" },
  { name: "Yoast SEO", url: "https://yoast.com", description: "WordPress SEO插件，优化网站内容的搜索引擎可见性。" },
  { name: "Klaviyo", url: "https://www.klaviyo.com", description: "电子邮件和SMS营销平台，专为电子商务设计。" },
  { name: "Drift", url: "https://www.drift.com", description: "对话式营销平台，使用聊天机器人吸引网站访问者。" },
  { name: "SurveyMonkey", url: "https://www.surveymonkey.com", description: "在线调查平台，收集客户反馈和市场研究。" }
];

// 分类slug到数据集的映射
function getDataForCategory(slug: string): Array<{ name: string; url: string; description: string }> {
  // 设计相关分类
  if (slug === 'design' || slug.includes('image')) {
    return designToolsData;
  }
  
  // 开发相关分类
  if (slug === 'dev' || slug.includes('code') || slug.includes('develop')) {
    return devToolsData;
  }
  
  // 生产力相关分类
  if (slug === 'work' || slug === 'doc' || slug === 'academic' || slug.includes('productivity')) {
    return productivityToolsData;
  }
  
  // 营销相关分类
  if (slug === 'search' || slug === 'translate' || slug.includes('marketing')) {
    return marketingToolsData;
  }
  
  // 默认使用AI工具数据
  return aiToolsData;
}

// 定义品牌图标映射的类型
interface BrandIconData {
  iconPath: string;
  category: string;
  displayName: string;
}

// 随机图标URL生成函数
function getRandomIconUrl(category: string, index: number): string | null {
  try {
    // 尝试读取品牌图标映射文件
    const mappingFilePath = path.join('public', 'icons', 'brand-icons-mapping.json');
    if (fs.existsSync(mappingFilePath)) {
      const mappingData = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8')) as Record<string, BrandIconData>;
      
      // 获取该分类下的所有图标
      const categoryIcons = Object.entries(mappingData)
        .filter(([, data]) => data.category === category)
        .map(([name, data]) => ({ name, iconPath: data.iconPath }));
      
      if (categoryIcons.length > 0) {
        // 使用索引选择图标，确保每个服务使用不同的图标
        const iconIndex = index % categoryIcons.length;
        return categoryIcons[iconIndex].iconPath;
      }
    }
    
    // 如果没有找到品牌图标映射文件或该分类下没有图标，使用生成的图标
    // 90%的概率有图标
    if (Math.random() > 0.1) {
      // 使用已生成的图标，每个分类有20个图标（0-19）
      const iconIndex = index % 20;
      return `/icons/${category}/${iconIndex}.svg`;
    }
    return null;
  } catch (error) {
    console.error('获取图标URL时出错:', error);
    return null;
  }
}

// 主函数：添加测试数据
async function seedTestData() {
  try {
    console.log('开始添加测试数据...');
    
    // 获取所有分类
    const categories = await prisma.category.findMany();
    console.log(`找到 ${categories.length} 个分类`);
    
    // 为每个分类添加服务
    for (const category of categories) {
      console.log(`处理分类: ${category.name} (${category.slug})`);
      
      // 获取该分类的测试数据
      const testData = getDataForCategory(category.slug);
      
      // 检查该分类下已有的服务数量
      const existingServicesCount = await prisma.service.count({
        where: { categoryId: category.id }
      });
      
      console.log(`分类 ${category.name} 已有 ${existingServicesCount} 个服务`);
      
      // 如果已有服务少于20个，则添加更多服务
      if (existingServicesCount < 20) {
        const servicesToAdd = 20 - existingServicesCount;
        console.log(`将为分类 ${category.name} 添加 ${servicesToAdd} 个服务`);
        
        // 选择要添加的服务
        const selectedServices = testData.slice(0, servicesToAdd);
        
        // 添加服务
        for (let i = 0; i < selectedServices.length; i++) {
          const service = selectedServices[i];
          await prisma.service.create({
            data: {
              name: service.name,
              url: service.url,
              description: service.description,
              icon: getRandomIconUrl(category.slug, i + existingServicesCount),
              clickCount: Math.floor(Math.random() * 100), // 随机点击次数
              categoryId: category.id
            }
          });
          console.log(`已添加服务: ${service.name}`);
        }
      } else {
        console.log(`分类 ${category.name} 已有足够的服务，跳过`);
      }
    }
    
    console.log('测试数据添加完成！');
  } catch (error) {
    console.error('添加测试数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行主函数
seedTestData(); 