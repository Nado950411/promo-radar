'use client';

import { formatPrice, formatDistance } from '@/lib/utils';
import { MapPin, Star } from 'lucide-react';
import { mockStores } from '@/lib/mock-data';
import { Product } from '@/types';

interface StoreComparisonProps {
  product: Product;
}

const PRICE_MULTIPLIERS: Record<string, number> = {
  s1: 1.05, s2: 1.12, s3: 1.08, s4: 1.20, s5: 1.15, s6: 1.03,
};

export function StoreComparison({ product }: StoreComparisonProps) {
  const comparisons = mockStores.map(store => ({
    ...store,
    price: store.id === product.store.id
      ? product.promoPrice
      : Math.round(product.promoPrice * (PRICE_MULTIPLIERS[store.id] ?? 1.1) * 100) / 100,
    isPromo: store.id === product.store.id,
  })).sort((a, b) => a.price - b.price);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Comparar Preços</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {comparisons.map((store, index) => (
          <div
            key={store.id}
            className={`flex items-center gap-3 px-4 py-3 ${store.isPromo ? 'bg-violet-50 dark:bg-violet-900/10' : ''}`}
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
              {index + 1}
            </div>
            <span className="text-xl">{store.logo}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {store.name}
                {store.isPromo && <span className="ml-1 text-xs text-violet-600 dark:text-violet-400 font-normal">• Promoção</span>}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-0.5"><MapPin size={10} className="text-violet-400" />{formatDistance(store.distance)}</span>
                <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-400" />{store.rating}</span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {formatPrice(store.price)}
              </p>
              {index === 0 && <p className="text-xs text-emerald-500">Menor preço</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
