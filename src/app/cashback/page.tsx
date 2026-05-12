'use client';

import { useState } from 'react';
import { useCashback } from '@/context/CashbackContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatRelativeTime, cn } from '@/lib/utils';
import { Wallet, TrendingUp, Copy, ChevronRight, CheckCircle, Clock, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';

export default function CashbackPage() {
  const { balance, coupons, transactions, useCoupon, withdraw } = useCashback();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'cupons' | 'historico'>('cupons');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pending = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const totalEarned = transactions.filter(t => t.status !== 'withdrawn').reduce((s, t) => s + t.amount, 0);

  const copyCode = (coupon: typeof coupons[0]) => {
    navigator.clipboard?.writeText(coupon.code).catch(() => {});
    setCopiedId(coupon.id);
    useCoupon(coupon.id);
    showToast(`Cupom ${coupon.code} copiado!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWithdraw = () => {
    if (balance <= 0) return;
    withdraw();
    showToast(`${formatPrice(balance)} resgatado com sucesso!`, 'success');
  };

  return (
    <div className="pb-24 space-y-4">
      {/* Balance card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 text-white relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={16} className="text-white/80" />
            <span className="text-sm text-white/80 font-medium">Saldo disponível</span>
          </div>
          <p className="text-4xl font-bold mt-1 mb-4">{formatPrice(balance)}</p>

          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-white/70">Pendente</p>
              <p className="text-sm font-bold">{formatPrice(pending)}</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-white/70">Total ganho</p>
              <p className="text-sm font-bold">{formatPrice(totalEarned)}</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-white/70">Parceiros</p>
              <p className="text-sm font-bold">6</p>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={balance <= 0}
            className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {balance > 0 ? `Resgatar ${formatPrice(balance)}` : 'Sem saldo para resgatar'}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 flex items-start gap-3">
        <TrendingUp size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Ganhe cashback em todas as compras nos parceiros PromoRadar. O saldo é creditado em até 7 dias.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['cupons', 'historico'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
              tab === t
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            )}
          >
            {t === 'cupons' ? '🎟️ Cupons' : '📋 Histórico'}
          </button>
        ))}
      </div>

      {tab === 'cupons' && (
        <div className="space-y-3">
          {coupons.map(coupon => (
            <div
              key={coupon.id}
              className={cn(
                'rounded-2xl overflow-hidden border transition-all',
                coupon.used
                  ? 'opacity-60 border-slate-200 dark:border-slate-700'
                  : 'border-transparent shadow-sm'
              )}
            >
              <div className={`bg-gradient-to-r ${coupon.color} p-4 flex items-center gap-3`}>
                <span className="text-3xl">{coupon.storeEmoji}</span>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg leading-none">{coupon.discount} OFF</p>
                  <p className="text-white/80 text-xs mt-0.5">{coupon.storeName}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs">Código</p>
                  <p className="text-white font-bold text-sm font-mono">{coupon.code}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{coupon.description}</p>
                  {coupon.minPurchase && (
                    <p className="text-xs text-slate-400 mt-0.5">Mín. {formatPrice(coupon.minPurchase)}</p>
                  )}
                </div>
                <button
                  onClick={() => !coupon.used && copyCode(coupon)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    coupon.used
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      : 'bg-violet-600 text-white active:scale-95'
                  )}
                >
                  {coupon.used ? (
                    <><CheckCircle size={12} /> Usado</>
                  ) : copiedId === coupon.id ? (
                    <><CheckCircle size={12} /> Copiado!</>
                  ) : (
                    <><Copy size={12} /> Copiar</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'historico' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {tx.storeEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tx.storeName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                      tx.status === 'confirmed' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                      tx.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                      tx.status === 'withdrawn' && 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                    )}>
                      {tx.status === 'confirmed' ? 'Confirmado' : tx.status === 'pending' ? 'Pendente' : 'Resgatado'}
                    </span>
                    <span className="text-xs text-slate-400">{formatRelativeTime(tx.date)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'text-sm font-bold',
                    tx.status === 'withdrawn' ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'
                  )}>
                    +{formatPrice(tx.amount)}
                  </p>
                  <p className="text-xs text-slate-400">{formatPrice(tx.purchaseValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partners section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Lojas parceiras</p>
          <Link href="/" className="text-xs text-violet-600 font-medium flex items-center gap-1">Ver promoções <ChevronRight size={12} /></Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {[
            { emoji: '🛒', name: 'Carrefour', cb: '2%' },
            { emoji: '🛍️', name: 'Pão de Açúcar', cb: '3%' },
            { emoji: '💊', name: 'Droga Raia', cb: '2,5%' },
            { emoji: '🏥', name: 'Ultrafarma', cb: '4%' },
            { emoji: '🏪', name: 'Extra', cb: '1,5%' },
          ].map(s => (
            <div key={s.name} className="flex-shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center w-20">
              <span className="text-2xl">{s.emoji}</span>
              <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 mt-1 truncate">{s.name}</p>
              <p className="text-[10px] text-emerald-600 font-bold">{s.cb} back</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
