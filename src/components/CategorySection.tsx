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
    <section id={`category-${category.slug}`}>
      <div className="flex justify-between items-center mb-4 pb-2">
        <h2 className="font-bold text-gray-800">
          {category.name}
        </h2>
        <Link 
          href={`/category/${category.slug}`}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          更多 &raquo;
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
} 