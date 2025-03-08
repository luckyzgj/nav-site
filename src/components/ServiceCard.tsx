'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useServiceClick } from '@/hooks/useServiceClick';

// 定义Service类型
type Service = {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: string | null;
  categoryId: number;
  categoryName?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const handleServiceClick = useServiceClick();
  
  const onClick = () => {
    handleServiceClick(service.id, service.url);
  };
  
  return (
    <div 
      className={`bg-white bg-opacity-70 rounded-lg shadow-sm border-2 border-transparent hover:border-brand-200 hover:bg-opacity-90 transition-all duration-300 overflow-hidden cursor-pointer ${
        isHovered ? 'transform scale-102' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-3 flex items-start space-x-3">
        {/* 左侧图标 */}
        <div className="w-12 h-12 relative flex-shrink-0">
          {service.icon ? (
            <Image
              src={service.icon}
              alt={service.name}
              fill
              className={`rounded-lg object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              unoptimized={service.icon.endsWith('.svg')}
            />
          ) : (
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center text-brand-500 text-xl font-bold">
              {service.name.charAt(0).toUpperCase()}
            </div>
          )}
          {isLoading && service.icon && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-100 rounded-lg">
              <div className="w-6 h-6 border-3 border-gray-300 border-t-brand-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate flex items-center justify-between">
            {service.name}
            {isHovered && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-200"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
} 
