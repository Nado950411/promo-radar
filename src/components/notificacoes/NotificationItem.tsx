'use client';

import { Notification } from '@/types';
import { formatPrice, formatRelativeTime, formatDistance } from '@/lib/utils';
import { TrendingDown, MapPin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification: n }: NotificationItemProps) {
  const savings = n.oldPrice - n.newPrice;

  return (
    <Link href={`/produto/${n.productId}`}>
      <div className={cn(
        'flex gap-3 p-4 rounded-2xl border transition-all duration-200 hover:shadow-sm',
        n.read
          ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
          : 'bg-violet-50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-800/40'
      )}>
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          n.type === 'price_drop' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
        )}>
          <TrendingDown size={18} className={n.type === 'price_drop' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-500'} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{n.productName}</span>
            {' '}caiu para{' '}
            <span className="font-bold text-violet-600 dark:text-violet-400">{formatPrice(n.newPrice)}</span>
            {' '}perto de você
          </p>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-400 line-through">{formatPrice(n.oldPrice)}</span>
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-medium">
              -{n.discount}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Economize {formatPrice(savings)}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-slate-400">{n.storeName}</span>
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              <MapPin size={10} className="text-violet-400" />
              {formatDistance(n.distance)}
            </span>
            <span className="text-xs text-slate-400 ml-auto">{formatRelativeTime(n.timestamp)}</span>
          </div>
        </div>

        {!n.read && (
          <div className="w-2 h-2 bg-violet-600 rounded-full flex-shrink-0 mt-1.5" />
        )}
      </div>
    </Link>
  );
}
