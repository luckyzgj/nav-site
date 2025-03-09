'use client';

import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SearchIcon } from './icons/SearchIcon';

// 添加自定义滚动条样式
const scrollbarStyles = `
  /* 滚动条整体样式 */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  /* 滚动条轨道 */
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  
  /* 滚动条滑块 */
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    transition: all 0.2s ease;
  }
  
  /* 滚动条滑块悬停效果 */
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
  
  /* Firefox滚动条样式 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
  }
`;

// 搜索结果类型定义
interface SearchResult {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: string | null;
  clickCount: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
}

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 处理搜索框输入变化
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/live-search?q=${encodeURIComponent(query.trim())}`);
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
          setShowResults(true);
        }
      } catch (error) {
        console.error('搜索失败:', error);
      } finally {
        setLoading(false);
      }
    };

    // 使用防抖处理输入
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // 处理表单提交（按回车键）
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // 如果有选中的结果，直接跳转到该结果的URL
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleResultClick(results[selectedIndex]);
      } else {
        // 否则跳转到搜索结果页
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  // 处理搜索按钮点击（始终跳转到搜索结果页）
  const handleSearchButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // 处理键盘导航
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;

    // 上箭头
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev <= 0 ? results.length - 1 : prev - 1));
    }
    // 下箭头
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev >= results.length - 1 ? 0 : prev + 1));
    }
    // Escape键
    else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  // 处理结果点击
  const handleResultClick = async (result: SearchResult) => {
    // 记录点击
    try {
      await fetch(`/api/services/${result.id}/click`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('记录点击失败:', error);
    }

    // 跳转到URL
    window.open(result.url, '_blank');
  };

  // 点击外部关闭结果列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 滚动到选中的结果
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      // 获取结果项元素（考虑到我们添加了包装div）
      const resultItems = resultsRef.current.querySelectorAll('[data-result-item]');
      const selectedElement = resultItems[selectedIndex] as HTMLElement;
      
      if (selectedElement) {
        // 使用更精确的滚动方式
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      {/* 注入自定义滚动条样式 */}
      <style jsx global>{scrollbarStyles}</style>
      
      <div className="relative w-full">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className={`flex items-center transition-all duration-200 ${
            isFocused ? 'bg-white shadow-md' : 'bg-gray-50'
          } border-2 ${
            isFocused ? 'border-brand-400' : 'border-gray-200'
          } rounded-full overflow-hidden`}>
            <div className="pl-4 text-gray-500">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (results.length > 0) {
                  setShowResults(true);
                }
              }}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="搜索AI服务..."
              className="w-full py-2 px-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={handleSearchButtonClick}
                className="w-20 m-0.5 px-4 py-1.5 rounded-full bg-brand-400 text-white text-sm font-medium hover:bg-brand-500 transition-colors"
              >
                搜索
              </button>
            )}
          </div>
        </form>

        {/* 搜索结果下拉框 */}
        {showResults && results.length > 0 && (
          <div 
            ref={resultsRef}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-brand-400 rounded-xl shadow-xl overflow-hidden custom-scrollbar max-h-80 overflow-y-auto"
            style={{ 
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="py-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  data-result-item
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    selectedIndex === index 
                      ? 'bg-brand-50 border-l-4 border-brand-400' 
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 relative">
                      {result.icon ? (
                        <Image
                          src={result.icon}
                          alt={result.name}
                          fill
                          className="rounded-lg object-contain p-0.5"
                          unoptimized={result.icon.endsWith('.svg')}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-500 font-medium">
                          {result.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {result.name}
                        <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {result.clickCount}次点击
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{result.description}</div>
                      <div className="text-xs text-brand-400 mt-1 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-brand-400 mr-1"></span>
                        {result.categoryName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 加载指示器 */}
        {loading && (
          <div className="absolute right-24 top-2.5">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-brand-400 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </>
  );
} 