/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // 添加构建ID，确保每次构建生成不同的资源URL
  generateBuildId: async () => {
    // 使用时间戳或环境变量作为构建ID
    return process.env.BUILD_ID || Date.now().toString();
  },
  // 添加HTTP头，控制缓存
  async headers() {
    return [
      {
        // 对所有静态资源应用这些头
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 