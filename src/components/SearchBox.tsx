'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from './icons/SearchIcon';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
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
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="搜索AI服务..."
          className="w-full py-2 px-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
        />
        {query && (
          <button
            type="submit"
            className="w-20 m-0.5 px-4 py-1.5 rounded-full bg-brand-400 text-white text-sm font-medium hover:bg-brand-500 transition-colors"
          >
            搜索
          </button>
        )}
      </div>
    </form>
  );
} 