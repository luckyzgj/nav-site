#!/usr/bin/env node

/**
 * 清空所有网站数据的脚本
 * 使用方法：
 * 1. 确保已登录管理员账号
 * 2. 运行 node scripts/clear-services.mjs [域名]
 * 
 * 例如：node scripts/clear-services.mjs http://localhost:3000
 * 或者：node scripts/clear-services.mjs https://your-domain.com
 */

import readline from 'readline';
import fetch from 'node-fetch';

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 获取域名参数
const domain = process.argv[2] || 'http://localhost:3000';

// 确认提示
rl.question(`⚠️ 警告：此操作将删除 ${domain} 上的所有网站数据，且无法恢复！\n确定要继续吗？(y/N) `, async (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      console.log('正在清空网站数据...');
      
      // 获取管理员 cookie
      const loginResponse = await fetch(`${domain}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: process.env.ADMIN_USERNAME || 'admin',
          password: process.env.ADMIN_PASSWORD || 'password'
        })
      });
      
      const loginData = await loginResponse.json();
      if (!loginData.success) {
        console.error('登录失败:', loginData.message);
        rl.close();
        return;
      }
      
      // 获取 cookie
      const cookies = loginResponse.headers.get('set-cookie');
      
      // 调用清空 API
      const response = await fetch(`${domain}/api/admin/services/clear`, {
        method: 'DELETE',
        headers: {
          Cookie: cookies
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ 成功：', data.message);
      } else {
        console.error('❌ 失败：', data.message);
      }
    } catch (error) {
      console.error('❌ 执行出错：', error.message);
    }
  } else {
    console.log('操作已取消');
  }
  
  rl.close();
}); 