// 分类类型定义
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
  services?: Service[];
}

// 网站类型定义
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
  tags?: Tag[];
}

// 带有分类的网站类型
export interface ServiceWithCategory extends Service {
  categoryName: string;
  categorySlug: string;
}

// 带有标签关联的服务类型
export interface ServiceWithTagRelations extends Omit<Service, 'tags'> {
  tags: {
    tag: Tag;
  }[];
}

// 标签类型定义
export interface Tag {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// 服务标签关联类型
export interface ServiceTag {
  serviceId: number;
  tagId: number;
  service?: Service;
  tag?: Tag;
  createdAt: Date;
}

// Prisma 批量操作结果类型
export interface BatchPayload {
  count: number;
}
