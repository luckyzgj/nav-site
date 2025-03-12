#!/bin/bash

echo "===== 开始清理Nginx缓存 ====="

# 如果您使用的是标准Nginx缓存目录，可以使用以下命令
# 注意：需要sudo权限，请根据您的服务器配置调整路径
# sudo rm -rf /var/cache/nginx/*

# 如果您使用的是自定义缓存目录，请调整以下路径
sudo rm -rf /www/server/nginx/proxy_cache_dir/*

# 重启Nginx服务
sudo systemctl restart nginx
# 或
# sudo service nginx restart

echo "请根据您的Nginx配置，取消注释并调整上述命令"
echo "执行此脚本需要sudo权限"

echo "===== Nginx缓存清理脚本准备完成 =====" 