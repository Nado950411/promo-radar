'use client';

import { Category } from '@/types';
import { cn } from '@/lib/utils';

const categories: { label: Category; emoji: string }[] = [
  { label: 'Todos', emoji: '🏪' },
  { label: 'Alimentos', emoji: '🍚' },
  { label: 'Bebidas', emoji: '🥤' },
  { label: 'Higiene', emoji: '🧴' },
  { label: 'Farmácia', emoji: '💊' },
  { label: 'Limpeza', emoji: '🧹' },
  { label: 'Laticínios', emoji: '🥛' },
];

interface CategoryFilterProps {
  selected: Category;
  onChange: (cat: Category) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map(({ label, emoji }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
            selected === label
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-200 dark:shadow-violet-900/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700'
          )}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
