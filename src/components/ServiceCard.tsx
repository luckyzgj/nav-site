'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Tooltip } from 'antd';
import '@ant-design/v5-patch-for-react-19';

// 定义Service类型
type Service = {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: string | null;
  clickCount: number;
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
  
  const handleServiceClick = async () => {
    try {
      // 记录点击
      await fetch(`/api/services/${service.id}/click`, { method: 'POST' });
      // 打开服务网址
      window.open(service.url, '_blank');
    } catch (error) {
      console.error('记录点击失败:', error);
      window.open(service.url, '_blank');
    }
  };
  
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${
        isHovered ? 'transform scale-105' : ''
      }`}
      onClick={handleServiceClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex flex-col items-center">
        <div className="w-16 h-16 relative mb-3">
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
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-2xl font-bold">
              {service.name.charAt(0).toUpperCase()}
            </div>
          )}
          {isLoading && service.icon && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <Tooltip title={service.name}>
          <h3 className="font-medium text-gray-900 text-center truncate w-full">
            {service.name}
          </h3>
        </Tooltip>
        
        <Tooltip title={service.description}>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 text-center">
            {service.description}
          </p>
        </Tooltip>
        
        <div className="mt-2 flex items-center justify-between w-full">
          <span className="text-xs text-gray-400">
            {service.clickCount} 次点击
          </span>
          {service.categoryName && (
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
              {service.categoryName}
            </span>
          )}
        </div>
      </div>
      
      {isHovered && (
        <div className="bg-blue-600 text-white text-center py-2 text-sm">
          点击访问
        </div>
      )}
    </div>
  );
} 
