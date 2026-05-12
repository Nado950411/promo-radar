'use client';

import { useState, useMemo } from 'react';
import { SearchBar } from '@/components/home/SearchBar';
import { BannerCarousel } from '@/components/home/BannerCarousel';
import { CategoryFilter } from '@/components/home/CategoryFilter';
import { NearbyStores } from '@/components/home/NearbyStores';
import { ProductCard } from '@/components/home/ProductCard';
import { AIRecommendations } from '@/components/home/AIRecommendations';
import { EmptyState } from '@/components/ui/EmptyState';
import { Category } from '@/types';
import { useFavorites } from '@/context/FavoritesContext';
import { MapPin, ScanLine, Users, TrendingDown, ChevronRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { mockMonthlySavings } from '@/lib/mock-data';
import Link from 'next/link';

const DISTANCE_OPTIONS = [1, 3, 5, 10];

export default function HomePage() {
  const { products } = useFavorites();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('Todos');
  const [maxDistance, setMaxDistance] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.store.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'Todos' || p.category === category;
      const matchDistance = p.store.distance <= maxDistance;
      return matchSearch && matchCategory && matchDistance;
    });
  }, [products, search, category, maxDistance]);

  const currentMonthSaved = mockMonthlySavings[mockMonthlySavings.length - 1].saved;

  return (
    <div className="space-y-5 pb-24">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-violet-50 to-transparent dark:from-violet-950/20 dark:to-transparent -mx-4 px-4 pt-4 pb-2">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Bom dia! 👋</p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Promoções perto de você</h1>
        <SearchBar value={search} onChange={setSearch} onFilterClick={() => setShowFilters(v => !v)} />
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">Distância máxima</p>
          <div className="flex gap-2">
            {DISTANCE_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setMaxDistance(d)}
                className={cn(
                  'flex-1 py-2 rounded-xl text-sm font-medium transition-all',
                  maxDistance === d
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                )}
              >
                {d}km
              </button>
            ))}
          </div>
        </div>
      )}

      <BannerCarousel />

      {/* Quick access cards */}
      <div className="grid grid-cols-3 gap-2">
        <Link href="/economia" className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-3 text-white active:scale-95 transition-transform">
          <TrendingDown size={18} className="mb-1.5" />
          <p className="text-[10px] text-white/80">Economizado</p>
          <p className="text-sm font-bold">{formatPrice(currentMonthSaved)}</p>
        </Link>
        <Link href="/encarte" className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-3 text-white active:scale-95 transition-transform">
          <ScanLine size={18} className="mb-1.5" />
          <p className="text-[10px] text-white/80">Ler encarte</p>
          <p className="text-sm font-bold">IA OCR</p>
        </Link>
        <Link href="/comunidade" className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3 text-white active:scale-95 transition-transform">
          <Users size={18} className="mb-1.5" />
          <p className="text-[10px] text-white/80">Comunidade</p>
          <p className="text-sm font-bold">+ 1.2k</p>
        </Link>
      </div>

      {/* AI Recommendations */}
      {!search && category === 'Todos' && (
        <section>
          <AIRecommendations />
        </section>
      )}

      {/* Nearby Stores */}
      <section>
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={14} className="text-violet-500" />
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Lojas próximas</h2>
        </div>
        <NearbyStores maxDistance={maxDistance} />
      </section>

      <section>
        <CategoryFilter selected={category} onChange={setCategory} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">
            {category === 'Todos' ? 'Promoções do dia' : category}
          </h2>
          <span className="text-xs text-slate-400">{filtered.length} produtos</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="Nenhum produto encontrado"
            description="Tente buscar por outro produto ou aumentar o raio de distância."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
