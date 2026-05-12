'use client';

import Link from 'next/link';
import { Sparkles, TrendingDown, Clock, Heart, Zap } from 'lucide-react';
import { mockAIRecommendations } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

const BADGE_CONFIG = {
  menor_preco: { label: 'Menor preço', color: 'bg-emerald-500', icon: TrendingDown },
  proximo_comprar: { label: 'Comprar logo', color: 'bg-orange-500', icon: Clock },
  favorito_caiu: { label: 'Favorito', color: 'bg-pink-500', icon: Heart },
  quase_acabando: { label: 'Acaba logo', color: 'bg-red-500', icon: Zap },
};

export function AIRecommendations() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
          <Sparkles size={13} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Radar IA</h2>
        </div>
        <span className="ml-auto text-xs text-violet-600 dark:text-violet-400 font-medium">Personalizado</span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {mockAIRecommendations.map((rec) => {
          const badgeCfg = BADGE_CONFIG[rec.badge];
          const BadgeIcon = badgeCfg.icon;
          return (
            <Link
              key={rec.product.id}
              href={`/produto/${rec.product.id}`}
              className="flex-shrink-0 w-40 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden active:scale-95 transition-transform"
            >
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 h-24 flex items-center justify-center">
                <span className="text-4xl">{rec.product.image}</span>
                <div className={`absolute top-2 left-2 ${badgeCfg.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1`}>
                  <BadgeIcon size={9} strokeWidth={2.5} />
                  {badgeCfg.label}
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{rec.product.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{rec.reason}</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{formatPrice(rec.product.promoPrice)}</span>
                  <span className="text-[10px] text-slate-400 line-through">{formatPrice(rec.product.originalPrice)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
