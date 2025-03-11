#!/bin/bash

# 设置变量
DB_USER="root"
DB_PASSWORD="your_production_password"
DB_NAME="ai_nav_db"
DB_HOST="localhost"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始数据库迁移部署...${NC}"

# 执行手动迁移文件
echo -e "${YELLOW}执行手动迁移文件...${NC}"

# 添加描述字段到Banner表
echo -e "${YELLOW}添加描述字段到Banner表...${NC}"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < prisma/migrations/manual_add_description_to_banner/migration.sql
if [ $? -eq 0 ]; then
  echo -e "${GREEN}成功添加描述字段到Banner表${NC}"
else
  echo -e "${RED}添加描述字段到Banner表失败${NC}"
  exit 1
fi

# 更新Prisma客户端
echo -e "${YELLOW}更新Prisma客户端...${NC}"
npx prisma generate
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Prisma客户端更新成功${NC}"
else
  echo -e "${RED}Prisma客户端更新失败${NC}"
  exit 1
fi

echo -e "${GREEN}数据库迁移部署完成!${NC}" 