'use client';

import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDistance } from '@/lib/utils';
import { Heart, Bell, BellOff, MapPin, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function FavoritosPage() {
  const { products, toggleFavorite, toggleAlert, isFavorite, hasAlert } = useFavorites();
  const { showToast } = useToast();

  const favorites = products.filter(p => p.isFavorite);

  const handleRemove = (id: string) => {
    toggleFavorite(id);
    showToast('Removido dos favoritos', 'info');
  };

  const handleAlert = (id: string) => {
    const wasActive = hasAlert(id);
    toggleAlert(id);
    showToast(wasActive ? 'Alerta desativado' : 'Você será notificado!', wasActive ? 'info' : 'success');
  };

  return (
    <div className="pb-24">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Favoritos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {favorites.length} {favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          emoji="💔"
          title="Nenhum favorito ainda"
          description="Toque no coração de qualquer produto para salvá-lo aqui."
          action={
            <Link href="/" className="bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
              Explorar promoções
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {favorites.map(product => {
            const alerted = hasAlert(product.id);
            const lowestPrice = Math.min(...product.priceHistory.map(h => h.price));
            const isAtLowest = product.promoPrice <= lowestPrice * 1.02;

            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <Link href={`/produto/${product.id}`} className="flex gap-4 p-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{product.name}</p>
                    <Badge variant="category" className="mt-1 mb-2">{product.category}</Badge>

                    <div className="flex items-end gap-2">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(product.promoPrice)}</p>
                      <p className="text-xs text-slate-400 line-through pb-0.5">{formatPrice(product.originalPrice)}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 flex items-center gap-0.5">
                        <MapPin size={10} className="text-violet-400" />
                        {product.store.name} · {formatDistance(product.store.distance)}
                      </span>
                    </div>

                    {isAtLowest && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <TrendingDown size={12} className="text-emerald-500" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Menor preço histórico!</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex border-t border-slate-100 dark:border-slate-700 divide-x divide-slate-100 dark:divide-slate-700">
                  <button
                    onClick={() => handleAlert(product.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors',
                      alerted
                        ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400'
                    )}
                  >
                    {alerted ? <Bell size={14} className="fill-current" /> : <BellOff size={14} />}
                    {alerted ? 'Alerta ativo' : 'Ativar alerta'}
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <Heart size={14} className="fill-current" />
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
