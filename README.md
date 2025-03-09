# 导航网站

一个收录AI服务和应用的导航网站，方便用户快速访问和检索AI工具。

## 技术栈

- 前端：Next.js + TypeScript + Tailwind CSS
- 后台：Ant Design
- 数据库：MySQL

## 功能特点

- 响应式设计，适配各种设备
- 分类展示AI服务
- 实时搜索功能
- 点击统计功能
- 独立的管理后台

## 开发环境准备

### 前提条件

- Node.js 18+
- MySQL 8.0+

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制`.env.example`文件为`.env`，并根据实际情况修改配置：

```
# 数据库配置
DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"

# 应用配置
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_SITE_NAME="123导航"
NEXT_PUBLIC_UPLOAD_DIR="uploads"
```

### 初始化数据库

```bash
npx prisma migrate dev --name init
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 系统初始化

首次运行时，访问 [http://localhost:3000/api/init](http://localhost:3000/api/init) 初始化系统，这将创建默认的管理员账户和分类。

默认管理员账户：
- 用户名：admin
- 密码：admin123

## 管理后台

访问 [http://localhost:3000/admin](http://localhost:3000/admin) 进入管理后台。

## 项目优化

项目优化工作已完成，包括：

1. 移除调试代码：在生产环境中禁用了console.log等调试输出
2. 优化错误处理：改进了错误处理逻辑，确保用户体验不受影响
3. 删除冗余文件：移除了不需要的配置文件和临时文件
4. 改进安全性：添加了noopener,noreferrer属性到外部链接
5. 类型定义整理：统一了API类型定义，提高了代码可维护性

## 部署说明

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 许可证

MIT
