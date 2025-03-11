'use client';

import Link from 'next/link';
import ServiceCard from './ServiceCard';
import { Category, Service } from '@/types';
interface CategorySectionProps {
  category: Category;
  services: Service[];
}

export default function CategorySection({ category, services }: CategorySectionProps) {
  if (services.length === 0) return null;

  return (
    <section
      id={`category-${category.slug}`}
      className="scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24"
    >
      <div className="flex justify-between items-center mb-4 pb-2">
        <h2 className="font-bold text-2xl text-gray-800 flex items-center">
          <Link href={`/t/${category.slug}`} className="flex items-center">
            {category.name}
          </Link>
        </h2>
        <Link
          href={`/t/${category.slug}`}
          className="text-sm text-brand-300 hover:text-brand-500 shadow-sm bg-white px-4 py-1.5 rounded-full"
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
