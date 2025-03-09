'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
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
  const [error, setError] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const handleServiceClick = useServiceClick();
  
  // 重置加载状态，确保每次图标变化时重新显示loading
  useEffect(() => {
    if (service.icon) {
      setIsLoading(true);
      setError(false);
    }
  }, [service.icon]);
  
  // 确保loading样式可见
  useEffect(() => {
    if (loadingRef.current && isLoading) {
      loadingRef.current.style.display = 'flex';
    }
  }, [isLoading]);
  
  const onClick = () => {
    handleServiceClick(service.id, service.url);
  };
  
  return (
    <div 
      className={`bg-white bg-opacity-80 rounded-lg shadow-sm outline-2 outline-none hover:outline-brand-200 hover:bg-opacity-90 transition-all duration-300 overflow-hidden cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-3 flex items-center space-x-2">
        {/* 左侧图标 */}
        <div className="w-10 h-10 relative flex-shrink-0">
          {/* 加载中显示loading样式 */}
          {service.icon && (
            <div 
              ref={loadingRef}
              className={`absolute inset-0 flex items-center justify-center rounded-lg z-20 ${isLoading ? 'block' : 'hidden'}`}
              style={{ opacity: isLoading ? 1 : 0 }}
            >
              <div className="w-8 h-8 border-4 border-brand-50 border-t-brand-100 rounded-full animate-spin"></div>
            </div>
          )}
          
          {service.icon ? (
            <Image
              src={service.icon}
              alt={service.name}
              fill
              className={`rounded-lg object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={() => {
                // 延迟一点点再隐藏loading，确保图片已经完全渲染
                setTimeout(() => setIsLoading(false), 100);
              }}
              onError={() => {
                setIsLoading(false);
                setError(true);
              }}
              unoptimized={service.icon.endsWith('.svg')}
              priority={true}
            />
          ) : (
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-500 text-xl font-bold">
              {service.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          {error && service.icon && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-100 rounded-lg z-20">
              <span className="text-xl font-bold text-brand-500">{service.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {service.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
} 
