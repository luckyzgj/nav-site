#!/bin/bash

# 安装依赖
npm install

# 生成Prisma客户端
npx prisma generate

# 应用数据库迁移（如果需要）
# npx prisma migrate deploy

# 构建应用
npm run build

# 启动应用
# npm start 