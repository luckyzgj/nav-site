import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

// 定义需要获取图标的品牌列表
const brandsList = [
  // AI工具
  { name: 'openai', category: 'chat', displayName: 'ChatGPT' },
  { name: 'midjourney', category: 'image', displayName: 'Midjourney' },
  { name: 'google', category: 'chat', displayName: 'Gemini' },
  { name: 'anthropic', category: 'chat', displayName: 'Claude' },
  { name: 'perplexity', category: 'chat', displayName: 'Perplexity AI' },
  { name: 'huggingface', category: 'chat', displayName: 'Hugging Face' },
  { name: 'replicate', category: 'image', displayName: 'Replicate' },
  { name: 'notion', category: 'write', displayName: 'Notion AI' },
  { name: 'grammarly', category: 'write', displayName: 'Grammarly' },
  
  // 设计工具
  { name: 'figma', category: 'design', displayName: 'Figma' },
  { name: 'adobe', category: 'design', displayName: 'Adobe XD' },
  { name: 'adobe', category: 'design', displayName: 'Adobe Photoshop' },
  { name: 'adobe', category: 'design', displayName: 'Adobe Illustrator' },
  { name: 'sketch', category: 'design', displayName: 'Sketch' },
  { name: 'canva', category: 'design', displayName: 'Canva' },
  { name: 'blender', category: 'design', displayName: 'Blender' },
  { name: 'adobe', category: 'design', displayName: 'Adobe After Effects' },
  { name: 'framer', category: 'design', displayName: 'Framer' },
  
  // 开发工具
  { name: 'visualstudiocode', category: 'dev', displayName: 'Visual Studio Code' },
  { name: 'github', category: 'dev', displayName: 'GitHub' },
  { name: 'gitlab', category: 'dev', displayName: 'GitLab' },
  { name: 'stackoverflow', category: 'dev', displayName: 'Stack Overflow' },
  { name: 'docker', category: 'dev', displayName: 'Docker' },
  { name: 'kubernetes', category: 'dev', displayName: 'Kubernetes' },
  { name: 'postman', category: 'dev', displayName: 'Postman' },
  { name: 'npm', category: 'dev', displayName: 'npm' },
  { name: 'jira', category: 'dev', displayName: 'Jira' },
  { name: 'bitbucket', category: 'dev', displayName: 'Bitbucket' },
  { name: 'amazonaws', category: 'dev', displayName: 'AWS' },
  { name: 'firebase', category: 'dev', displayName: 'Firebase' },
  { name: 'mongodb', category: 'dev', displayName: 'MongoDB' },
  { name: 'redis', category: 'dev', displayName: 'Redis' },
  { name: 'vercel', category: 'dev', displayName: 'Vercel' },
  { name: 'netlify', category: 'dev', displayName: 'Netlify' },
  
  // 生产力工具
  { name: 'notion', category: 'work', displayName: 'Notion' },
  { name: 'trello', category: 'work', displayName: 'Trello' },
  { name: 'asana', category: 'work', displayName: 'Asana' },
  { name: 'slack', category: 'work', displayName: 'Slack' },
  { name: 'microsoft', category: 'work', displayName: 'Microsoft Teams' },
  { name: 'zoom', category: 'work', displayName: 'Zoom' },
  { name: 'google', category: 'work', displayName: 'Google Workspace' },
  { name: 'microsoft', category: 'work', displayName: 'Microsoft 365' },
  { name: 'evernote', category: 'work', displayName: 'Evernote' },
  { name: 'todoist', category: 'work', displayName: 'Todoist' },
  { name: 'clickup', category: 'work', displayName: 'ClickUp' },
  { name: 'monday', category: 'work', displayName: 'Monday.com' },
  { name: 'airtable', category: 'work', displayName: 'Airtable' },
  { name: 'calendly', category: 'work', displayName: 'Calendly' },
  { name: 'zapier', category: 'work', displayName: 'Zapier' },
  { name: 'ifttt', category: 'work', displayName: 'IFTTT' },
  { name: 'miro', category: 'work', displayName: 'Miro' },
  { name: 'loom', category: 'work', displayName: 'Loom' },
  { name: 'lastpass', category: 'work', displayName: '1Password' },
  
  // 营销工具
  { name: 'hubspot', category: 'search', displayName: 'HubSpot' },
  { name: 'mailchimp', category: 'search', displayName: 'Mailchimp' },
  { name: 'google', category: 'search', displayName: 'Google Analytics' },
  { name: 'google', category: 'search', displayName: 'Google Ads' },
  { name: 'facebook', category: 'search', displayName: 'Facebook Ads Manager' },
  { name: 'hootsuite', category: 'search', displayName: 'Hootsuite' },
  { name: 'buffer', category: 'search', displayName: 'Buffer' },
  { name: 'hotjar', category: 'search', displayName: 'Hotjar' },
  { name: 'wordpress', category: 'search', displayName: 'WordPress' },
  { name: 'shopify', category: 'search', displayName: 'Shopify' },
  { name: 'woocommerce', category: 'search', displayName: 'WooCommerce' },
  { name: 'google', category: 'search', displayName: 'Google Cloud' },
  { name: 'microsoft', category: 'search', displayName: 'Microsoft Azure' },
  { name: 'digitalocean', category: 'search', displayName: 'DigitalOcean' },
  { name: 'cloudflare', category: 'search', displayName: 'Cloudflare' },
];

// 确保目录存在
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 从Simple Icons获取SVG图标
async function fetchSimpleIcon(brand: string): Promise<string | null> {
  try {
    // 使用更可靠的Simple Icons API URL
    const url = `https://simpleicons.org/icons/${brand}.svg`;
    const response = await axios.get(url, {
      headers: {
        'Accept': 'image/svg+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000 // 设置超时时间为5秒
    });
    
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`获取 ${brand} 图标失败:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

// 生成默认SVG图标
function generateDefaultIcon(brand: string): string {
  // 从品牌名称生成一个稳定的颜色
  const hash = brand.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <rect width="24" height="24" fill="hsl(${hue}, 70%, 50%)" rx="6" ry="6"/>
    <text x="12" y="16" font-family="Arial" font-size="12" fill="white" text-anchor="middle">
      ${brand.substring(0, 1).toUpperCase()}
    </text>
  </svg>`;
}

// 保存SVG图标到文件
function saveSvgIcon(category: string, brand: string, svgContent: string) {
  const dirPath = path.join('public', 'icons', category);
  ensureDirectoryExists(dirPath);
  
  const filePath = path.join(dirPath, `${brand}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`已保存图标: ${filePath}`);
  
  return `/icons/${category}/${brand}.svg`;
}

// 创建映射文件，将品牌名称映射到图标路径
function createMappingFile(mappings: Array<{ name: string, category: string, iconPath: string, displayName: string }>) {
  const mappingData = mappings.reduce((acc, { name, category, iconPath, displayName }) => {
    acc[name] = {
      iconPath,
      category,
      displayName
    };
    return acc;
  }, {} as Record<string, { iconPath: string, category: string, displayName: string }>);
  
  const mappingFilePath = path.join('public', 'icons', 'brand-icons-mapping.json');
  fs.writeFileSync(mappingFilePath, JSON.stringify(mappingData, null, 2));
  console.log(`已创建图标映射文件: ${mappingFilePath}`);
}

// 主函数：获取并保存所有品牌图标
async function fetchAndSaveBrandIcons() {
  try {
    console.log('开始获取品牌图标...');
    
    const mappings: Array<{ name: string, category: string, iconPath: string, displayName: string }> = [];
    const processedBrands = new Set<string>(); // 用于跟踪已处理的品牌
    
    // 为每个品牌获取图标
    for (const { name, category, displayName } of brandsList) {
      // 如果已经处理过这个品牌和分类的组合，则跳过
      const brandCategoryKey = `${name}-${category}`;
      if (processedBrands.has(brandCategoryKey)) {
        console.log(`跳过重复的品牌-分类组合: ${name} (${category})`);
        continue;
      }
      
      processedBrands.add(brandCategoryKey);
      console.log(`获取 ${name} 图标...`);
      
      // 获取SVG内容
      let svgContent = await fetchSimpleIcon(name);
      let iconPath: string;
      
      if (svgContent) {
        // 保存SVG文件
        iconPath = saveSvgIcon(category, name, svgContent);
      } else {
        console.log(`无法获取 ${name} 图标，将使用默认图标`);
        // 生成并保存默认图标
        svgContent = generateDefaultIcon(name);
        iconPath = saveSvgIcon(category, name, svgContent);
      }
      
      // 添加到映射
      mappings.push({
        name,
        category,
        iconPath,
        displayName
      });
      
      // 添加延迟，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // 创建映射文件
    createMappingFile(mappings);
    
    console.log('品牌图标获取完成！');
  } catch (error) {
    console.error('获取品牌图标时出错:', error);
  }
}

// 执行主函数
fetchAndSaveBrandIcons(); 