'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/icons/SearchIcon';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-grow max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入关键词..."
        className="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-600"
        aria-label="搜索"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
} 