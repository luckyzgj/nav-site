// 分类类型定义
export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  services?: Service[];
}

// 服务类型定义
export interface Service {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: string | null;
  clickCount: number;
  categoryId: number;
  category?: {
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
  categorySlug?: string;
}

// 带有分类的服务类型
export interface ServiceWithCategory extends Service {
  categoryName: string;
  categorySlug: string;
} 