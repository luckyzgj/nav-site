#!/bin/bash

echo "===== 开始部署流程 ====="

# 安装依赖
echo "安装依赖..."
npm install

# 生成Prisma客户端
echo "生成Prisma客户端..."
npx prisma generate

# 清除缓存
echo "清理缓存..."
./clear-cache.sh

# 应用数据库迁移（如果需要）
# echo "应用数据库迁移..."
# npx prisma migrate deploy

# 构建应用
echo "构建应用..."
npm run build

# 重启应用（根据您的部署环境调整）
echo "重启应用..."
# pm2 restart nav-site
# 或
# systemctl restart nav-site

echo "===== 部署完成 =====" 