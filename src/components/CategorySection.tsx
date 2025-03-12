'use client';

import Link from 'next/link';
import ServiceCard from './ServiceCard';
import { Category, Service, Tag } from '@/types';

interface CategorySectionProps {
  category: Category;
  services: Service[];
  tags?: Tag[];
}

export default function CategorySection({ category, services, tags = [] }: CategorySectionProps) {
  if (services.length === 0) return null;

  return (
    <section
      id={`category-${category.slug}`}
      className="scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24"
    >
      <div className="flex flex-wrap justify-between items-center mb-4 pb-2">
        <div className="flex flex-1 items-center flex-wrap min-w-0 pr-4">
          <h2 className="font-bold text-2xl text-gray-800 mr-10 whitespace-nowrap">
            <Link href={`/t/${category.slug}`} className="-space-y-2">
              <span className="relative -top-0.5">{category.name}</span>
              <span className="bg-brand-200 h-2 block w-full"></span>
            </Link>
          </h2>

          {/* 分类下的热门标签 */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-4 overflow-hidden">
              {tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  className="text-sm px-3 py-1 text-gray-600 hover:text-brand-400 hover:bg-white/80 rounded-full transition-colors flex items-center"
                >
                  <span className="mr-1 text-brand-300">#</span>
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/t/${category.slug}`}
          className="text-sm text-brand-300 hover:text-brand-400 shadow-sm bg-white px-3 py-1 rounded-full whitespace-nowrap"
        >
          更多
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
