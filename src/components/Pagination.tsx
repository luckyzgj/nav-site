'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // 如果只有一页，不显示分页
  if (totalPages <= 1) {
    return null;
  }

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // 最多显示的页码数
    
    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    // 调整范围，确保不超出总页数
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // 生成页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // 构建页面URL
  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}?page=${page}`;
  };

  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex items-center justify-center space-x-1">
      {/* 上一页按钮 */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded-md bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </span>
      )}
      
      {/* 第一页 */}
      {pageNumbers[0] > 1 && (
        <>
          <Link
            href={getPageUrl(1)}
            className="px-3 py-1 rounded-md bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-500 transition-colors"
          >
            1
          </Link>
          {pageNumbers[0] > 2 && (
            <span className="px-2 py-1 text-gray-400">...</span>
          )}
        </>
      )}
      
      {/* 页码 */}
      {pageNumbers.map(page => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-500'
          } transition-colors`}
        >
          {page}
        </Link>
      ))}
      
      {/* 最后一页 */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 py-1 text-gray-400">...</span>
          )}
          <Link
            href={getPageUrl(totalPages)}
            className="px-3 py-1 rounded-md bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-500 transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}
      
      {/* 下一页按钮 */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded-md bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </span>
      )}
    </div>
  );
} 