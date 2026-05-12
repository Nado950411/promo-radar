'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn(
      'flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm border transition-all duration-200',
      focused
        ? 'border-violet-400 shadow-violet-100 dark:shadow-violet-900/20 shadow-md'
        : 'border-slate-200 dark:border-slate-700'
    )}>
      <Search size={18} className="text-slate-400 flex-shrink-0" />
      <input
        type="text"
        placeholder="Buscar produto, mercado..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm outline-none"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      )}
      <button
        onClick={onFilterClick}
        className="w-8 h-8 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors flex-shrink-0"
      >
        <SlidersHorizontal size={15} />
      </button>
    </div>
  );
}
