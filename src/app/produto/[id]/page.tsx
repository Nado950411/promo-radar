'use client';

import { use } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { PriceChart } from '@/components/produto/PriceChart';
import { StoreComparison } from '@/components/produto/StoreComparison';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDiscount, formatDistance } from '@/lib/utils';
import { Heart, Bell, BellOff, MapPin, ArrowLeft, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, toggleFavorite, toggleAlert, isFavorite, hasAlert } = useFavorites();
  const { showToast } = useToast();

  const product = products.find(p => p.id === id);
  if (!product) return notFound();

  const favorite = isFavorite(id);
  const alerted = hasAlert(id);

  const handleFavorite = () => {
    toggleFavorite(id);
    showToast(favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', favorite ? 'info' : 'success');
  };

  const handleAlert = () => {
    toggleAlert(id);
    showToast(alerted ? 'Alerta desativado' : 'Você será notificado quando o preço cair!', alerted ? 'info' : 'success');
  };

  const daysLeft = Math.ceil((new Date(product.expiresAt).getTime() - Date.now()) / 86400000);
  const savings = product.originalPrice - product.promoPrice;

  return (
    <div className="pb-32">
      <div className="flex items-center gap-3 mb-4 -mx-4 px-4 py-3 sticky top-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800">
        <Link href="/" className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300" />
        </Link>
        <h1 className="font-semibold text-slate-800 dark:text-slate-200 flex-1 truncate">{product.name}</h1>
      </div>

      <div className="bg-gradient-to-b from-violet-50 to-white dark:from-violet-950/20 dark:to-transparent rounded-2xl p-6 flex items-center justify-center mb-4" style={{ minHeight: 160 }}>
        <span className="text-8xl">{product.image}</span>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="category">{product.category}</Badge>
                <Badge variant="discount">{formatDiscount(product.discount)}</Badge>
              </div>
            </div>
            <button
              onClick={handleFavorite}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                favorite ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              )}
            >
              <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(product.promoPrice)}</p>
            <div className="pb-1">
              <p className="text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Você economiza {formatPrice(savings)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span>{product.store.logo}</span>
              {product.store.name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-violet-400" />
              {formatDistance(product.store.distance)}
            </span>
            <span className="flex items-center gap-1">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              {product.store.rating}
            </span>
          </div>

          {daysLeft <= 3 && (
            <div className="mt-3 flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl px-3 py-2">
              <Clock size={14} className="text-orange-500" />
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Promoção expira em {daysLeft <= 0 ? 'hoje' : `${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`}
              </p>
            </div>
          )}
        </div>

        <PriceChart data={product.priceHistory} />

        <StoreComparison product={product} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={handleAlert}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border',
              alerted
                ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            )}
          >
            {alerted ? <Bell size={16} className="fill-current" /> : <BellOff size={16} />}
            {alerted ? 'Alerta ativo' : 'Receber alerta'}
          </button>
          <Button
            onClick={handleFavorite}
            variant={favorite ? 'danger' : 'primary'}
            fullWidth
          >
            <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
            {favorite ? 'Remover favorito' : 'Adicionar favorito'}
          </Button>
        </div>
      </div>
    </div>
  );
}
