'use client';

import { ReactNode } from 'react';

interface ServiceLinkProps {
  serviceId: number;
  url: string;
  className?: string;
  children: ReactNode;
}

export default function ServiceLink({ serviceId, url, className, children }: ServiceLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // 记录点击
      await fetch(`/api/services/${serviceId}/click`, { method: 'POST' });
      // 打开服务网址
      window.open(url, '_blank');
    } catch (error) {
      console.error('记录点击失败:', error);
      window.open(url, '_blank');
    }
  };
  
  return (
    <a 
      href={url} 
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
} 