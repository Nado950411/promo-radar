'use client';

import { useState } from 'react';
import { mockMonthlySavings, mockAchievements, mockUserProfile } from '@/lib/mock-data';
import { formatPrice, cn } from '@/lib/utils';
import { TrendingDown, Target, Trophy, Zap, Lock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const RARITY_COLORS = {
  common: 'border-slate-200 dark:border-slate-700',
  rare: 'border-blue-300 dark:border-blue-700',
  epic: 'border-purple-400 dark:border-purple-600',
  legendary: 'border-amber-400 dark:border-amber-500',
};

const RARITY_BG = {
  common: '',
  rare: 'bg-blue-50 dark:bg-blue-900/10',
  epic: 'bg-purple-50 dark:bg-purple-900/10',
  legendary: 'bg-amber-50 dark:bg-amber-900/10',
};

export default function EconomiaPage() {
  const [activeTab, setActiveTab] = useState<'resumo' | 'conquistas'>('resumo');

  const currentMonth = mockMonthlySavings[mockMonthlySavings.length - 1];
  const prevMonth = mockMonthlySavings[mockMonthlySavings.length - 2];
  const goalPercent = Math.min(100, Math.round((currentMonth.saved / mockUserProfile.monthlySavingsGoal) * 100));
  const maxSaved = Math.max(...mockMonthlySavings.map(m => m.saved));

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;

  return (
    <div className="pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Modo Economia</h1>
        <Link href="/comunidade" className="text-xs text-violet-600 font-medium flex items-center gap-1">
          Comunidade <ChevronRight size={12} />
        </Link>
      </div>

      {/* Hero savings card */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 text-white relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />
        <div className="relative">
          <p className="text-white/80 text-sm font-medium">Economizou em {currentMonth.month}</p>
          <p className="text-4xl font-bold mt-1">{formatPrice(currentMonth.saved)}</p>
          <div className="flex items-center gap-2 mt-1">
            <TrendingDown size={14} className="text-emerald-300" />
            <span className="text-emerald-300 text-sm font-medium">
              +{Math.round(((currentMonth.saved - prevMonth.saved) / prevMonth.saved) * 100)}% vs {prevMonth.shortMonth}
            </span>
          </div>

          {/* Goal progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span className="flex items-center gap-1"><Target size={11} /> Meta do mês</span>
              <span>{goalPercent}% — {formatPrice(mockUserProfile.monthlySavingsGoal)}</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-1000',
                  goalPercent >= 100 ? 'bg-emerald-400' : 'bg-white/80'
                )}
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            {goalPercent >= 100 && (
              <p className="text-emerald-300 text-xs mt-1 font-medium">🎉 Meta batida!</p>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPrice(mockUserProfile.totalSaved).replace('R$ ', '')}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Total economizado</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{currentMonth.purchases}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Compras este mês</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{unlockedCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Conquistas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['resumo', 'conquistas'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
              activeTab === t
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            )}
          >
            {t === 'resumo' ? '📊 Histórico' : '🏆 Conquistas'}
          </button>
        ))}
      </div>

      {activeTab === 'resumo' && (
        <>
          {/* Bar chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Últimos 6 meses</p>
            <div className="flex items-end gap-2 h-32">
              {mockMonthlySavings.map((month, i) => {
                const isLast = i === mockMonthlySavings.length - 1;
                const height = (month.saved / maxSaved) * 100;
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                    <p className={cn(
                      'text-[10px] font-bold',
                      isLast ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 opacity-0'
                    )}>
                      {isLast ? formatPrice(month.saved).replace('R$ ', 'R$') : ''}
                    </p>
                    <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                      <div
                        className={cn(
                          'w-full rounded-t-lg transition-all duration-700',
                          isLast
                            ? 'bg-gradient-to-t from-violet-600 to-violet-400'
                            : 'bg-slate-200 dark:bg-slate-700'
                        )}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <p className={cn(
                      'text-[10px]',
                      isLast ? 'text-violet-600 font-bold' : 'text-slate-400'
                    )}>
                      {month.shortMonth}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly list */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {[...mockMonthlySavings].reverse().map((month, i) => (
              <div key={month.month} className={cn('flex items-center px-4 py-3', i > 0 && 'border-t border-slate-100 dark:border-slate-700')}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{month.month} {month.year}</p>
                  <p className="text-xs text-slate-400">{month.purchases} compras</p>
                </div>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(month.saved)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'conquistas' && (
        <div className="grid grid-cols-2 gap-3">
          {mockAchievements.map(a => (
            <div
              key={a.id}
              className={cn(
                'rounded-2xl border-2 p-3 transition-all',
                RARITY_COLORS[a.rarity],
                RARITY_BG[a.rarity],
                !a.unlocked && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{a.emoji}</span>
                {!a.unlocked && <Lock size={14} className="text-slate-400" />}
                {a.unlocked && <Zap size={14} className="text-amber-500" />}
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{a.title}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{a.description}</p>
              {!a.unlocked && a.progress !== undefined && a.maxProgress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>{a.progress}</span>
                    <span>{a.maxProgress}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${(a.progress / a.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {a.unlocked && a.unlockedAt && (
                <p className="text-[10px] text-violet-600 dark:text-violet-400 mt-1.5 font-medium">
                  ✓ {new Date(a.unlockedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
