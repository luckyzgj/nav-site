'use client';

import ServiceCard from './ServiceCard';
import { Category, Service } from '@/types';

interface CategorySectionProps {
  category: Category;
  services: Service[];
}

export default function CategorySection({ category, services }: CategorySectionProps) {
  if (services.length === 0) return null;
  
  return (
    <section id={`category-${category.slug}`} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
        {category.name}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
} 