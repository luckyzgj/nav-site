import * as fs from 'fs';
import * as path from 'path';

// 定义分类列表
const categories = [
  'chat', 'image', 'write', 'audio', 'video', 'dev', 'doc', 
  'design', 'academic', 'work', 'search', 'translate', 'tools', 'others'
];

// 定义一组简单的SVG图标模板
const iconTemplates = [
  // 简单圆形图标
  (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
    <circle cx="12" cy="12" r="10" fill="${color}" />
  </svg>`,
  
  // 简单方形图标
  (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="${color}" />
  </svg>`,
  
  // 简单六边形图标
  (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
    <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" fill="${color}" />
  </svg>`,
  
  // 简单三角形图标
  (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
    <path d="M12 2L22 20H2L12 2Z" fill="${color}" />
  </svg>`,
  
  // 简单星形图标
  (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="${color}" />
  </svg>`,
  
  // 简单菱形图标
  (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
    <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="${color}" />
  </svg>`,
];

// 定义一组颜色
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA5A5', '#A5FFD6', 
  '#FFC145', '#FF6B8B', '#845EC2', '#D65DB1', '#FF9671', 
  '#FFC75F', '#F9F871', '#00C9A7', '#C34A36', '#008B74',
  '#FF8066', '#788BFF', '#B8F2E6', '#FFA69E', '#AED9E0'
];

// 确保目录存在
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成图标
async function generateIcons() {
  try {
    console.log('开始生成图标...');
    
    // 为每个分类创建目录并生成图标
    for (const category of categories) {
      const categoryDir = path.join('public', 'icons', category);
      ensureDirectoryExists(categoryDir);
      
      console.log(`为分类 ${category} 生成图标...`);
      
      // 为每个分类生成20个图标
      for (let i = 0; i < 20; i++) {
        // 随机选择一个图标模板和颜色
        const templateIndex = Math.floor(Math.random() * iconTemplates.length);
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        const template = iconTemplates[templateIndex];
        const color = colors[colorIndex];
        
        // 生成SVG内容
        const svgContent = template(color);
        
        // 写入文件
        const filePath = path.join(categoryDir, `${i}.svg`);
        fs.writeFileSync(filePath, svgContent);
        
        console.log(`已生成图标: ${filePath}`);
      }
    }
    
    console.log('图标生成完成！');
  } catch (error) {
    console.error('生成图标时出错:', error);
  }
}

// 执行生成函数
generateIcons(); 