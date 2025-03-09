#!/bin/bash

echo "开始清理缓存..."

# 清除Next.js缓存
if [ -d ".next" ]; then
  echo "清理Next.js构建缓存..."
  rm -rf .next/cache
fi

# 清除node_modules缓存
if [ -d "node_modules/.cache" ]; then
  echo "清理node_modules缓存..."
  rm -rf node_modules/.cache
fi

# 清除样式相关缓存
if [ -d ".next/static/css" ]; then
  echo "清理CSS缓存..."
  rm -rf .next/static/css
fi

echo "缓存清理完成!" 