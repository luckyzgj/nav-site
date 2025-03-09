#!/bin/bash

# 获取版本信息
VERSION=$(node -e "console.log(require('./package.json').version)")
BUILD_TIME=$(date "+%Y-%m-%d %H:%M:%S")
BUILD_ID=$(date +%s)

echo "===== 开始部署流程 ====="
echo "版本: $VERSION"
echo "构建时间: $BUILD_TIME"
echo "构建ID: $BUILD_ID"

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
NEXT_PUBLIC_APP_VERSION=$VERSION BUILD_ID=$BUILD_ID npm run build

# 创建版本信息文件
echo "创建版本信息文件..."
mkdir -p .next/static/version
cat > .next/static/version/info.json << EOF
{
  "version": "$VERSION",
  "buildTime": "$BUILD_TIME",
  "buildId": "$BUILD_ID"
}
EOF

# 重启应用（根据您的部署环境调整）
echo "重启应用..."
# pm2 restart nav-site
# 或
# systemctl restart nav-site

echo "===== 部署完成 =====" 