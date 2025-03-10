'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useServiceClick } from '@/hooks/useServiceClick';
import { Tooltip } from 'antd';

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

// 创建一个图片缓存对象
const imageCache: Record<string, boolean> = {};

export default function ServiceCard({ service }: ServiceCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMounted = useRef(true);
  const handleServiceClick = useServiceClick();

  // 组件挂载/卸载处理
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 图片加载处理
  useEffect(() => {
    // 重置状态
    setIsImageLoaded(false);
    setHasError(false);

    // 如果没有图标，直接返回
    if (!service.icon) return;

    // 检查缓存
    if (imageCache[service.icon]) {
      setIsImageLoaded(true);
      return;
    }

    // 预加载图片
    const img = new window.Image();
    img.src = service.icon;

    const handleLoad = () => {
      if (isMounted.current) {
        imageCache[service.icon!] = true;
        setIsImageLoaded(true);
      }
    };

    const handleError = () => {
      if (isMounted.current) {
        setHasError(true);
        setIsImageLoaded(true); // 即使出错也标记为已加载，以隐藏loading状态
      }
    };

    // 如果图片已经加载完成（在缓存中）
    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);
    }

    // 清理函数
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [service.icon]);

  const onClick = () => {
    handleServiceClick(service.id, service.url);
  };

  // 渲染首字母图标
  const renderInitial = () => (
    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-500 text-xl font-bold">
      {service.name.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <Tooltip 
      title={service.description}
      placement="bottom"
      mouseEnterDelay={0.25}
      styles={{
        body: {
          borderRadius: '12px',
          padding: '8px 12px'
        }
      }}
    >
      <div 
        className="bg-white bg-opacity-80 rounded-lg shadow-sm outline-2 outline-none hover:outline-brand-200 hover:bg-opacity-90 transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <div className="p-3 flex items-center space-x-2">
          {/* 左侧图标 */}
          <div className="w-10 h-10 relative flex-shrink-0">
            {/* 加载中显示loading样式 */}
            {service.icon && !isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg z-20">
                <div className="w-8 h-8 border-4 border-brand-50 border-t-brand-100 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* 图标显示 */}
            {service.icon && !hasError ? (
              <div className={`absolute inset-0 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                  src={service.icon}
                  alt={service.name}
                  fill
                  className="rounded-lg object-contain"
                  unoptimized={service.icon.endsWith('.svg')}
                />
              </div>
            ) : renderInitial()}
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
    </Tooltip>
  );
} 
