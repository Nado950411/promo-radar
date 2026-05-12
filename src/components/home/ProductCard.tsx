'use client';

import Link from 'next/link';
import { Heart, Bell, MapPin } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, formatDiscount, formatDistance, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleFavorite, toggleAlert, isFavorite, hasAlert } = useFavorites();
  const { showToast } = useToast();
  const favorite = isFavorite(product.id);
  const alerted = hasAlert(product.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(product.id);
    showToast(favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', favorite ? 'info' : 'success');
  };

  const handleAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleAlert(product.id);
    showToast(alerted ? 'Alerta desativado' : 'Você será notificado sobre esta promoção!', alerted ? 'info' : 'success');
  };

  const daysLeft = Math.ceil((new Date(product.expiresAt).getTime() - Date.now()) / 86400000);

  return (
    <Link href={`/produto/${product.id}`} className="block group">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200">
        <div className="relative bg-slate-50 dark:bg-slate-700/50 h-32 flex items-center justify-center">
          <span className="text-6xl">{product.image}</span>
          <Badge variant="discount" className="absolute top-2 left-2">
            {formatDiscount(product.discount)}
          </Badge>
          {daysLeft <= 1 && (
            <Badge variant="expiring" className="absolute top-2 right-2">
              Expira hoje!
            </Badge>
          )}
          <button
            onClick={handleFavorite}
            className={cn(
              'absolute bottom-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
              favorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-red-400'
            )}
          >
            <Heart size={15} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-3">
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-0.5 truncate">{product.name}</p>
          <Badge variant="category" className="mb-2">{product.category}</Badge>

          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(product.promoPrice)}</p>
            </div>
            <button
              onClick={handleAlert}
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                alerted
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-violet-500'
              )}
            >
              <Bell size={14} fill={alerted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>{product.store.logo}</span>
            <span>{product.store.name}</span>
            <span className="ml-auto flex items-center gap-0.5">
              <MapPin size={10} className="text-violet-400" />
              {formatDistance(product.store.distance)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
