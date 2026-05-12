'use client';

import { useState } from 'react';
import { mockEncarteProducts } from '@/lib/mock-data';
import { formatPrice, cn } from '@/lib/utils';
import { Upload, FileImage, Sparkles, CheckCircle, ChevronRight, RotateCcw, ShoppingCart } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

type Phase = 'idle' | 'uploading' | 'reading' | 'done';

const PHASES: { key: Phase; label: string; desc: string }[] = [
  { key: 'uploading', label: 'Enviando imagem...', desc: 'Transferindo arquivo para análise' },
  { key: 'reading', label: 'IA lendo encarte...', desc: 'Identificando produtos e preços' },
  { key: 'done', label: 'Concluído!', desc: 'Produtos extraídos com sucesso' },
];

export default function EncartePage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const { showToast } = useToast();

  const simulate = () => {
    setPhase('uploading');
    setPhaseIndex(0);

    setTimeout(() => { setPhase('reading'); setPhaseIndex(1); }, 1500);
    setTimeout(() => { setPhase('done'); setPhaseIndex(2); }, 3200);
  };

  const reset = () => {
    setPhase('idle');
    setPhaseIndex(0);
  };

  return (
    <div className="pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Leitor de Encarte</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">IA extrai promoções automaticamente</p>
        </div>
        {phase === 'done' && (
          <button onClick={reset} className="text-xs text-violet-600 font-medium flex items-center gap-1">
            <RotateCcw size={12} />
            Novo
          </button>
        )}
      </div>

      {phase === 'idle' && (
        <>
          {/* Upload zone */}
          <button
            onClick={simulate}
            className="w-full aspect-[4/3] max-h-52 bg-white dark:bg-slate-800 border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-3xl flex flex-col items-center justify-center gap-4 text-center p-6 hover:bg-violet-50 dark:hover:bg-violet-900/10 hover:border-violet-400 transition-all active:scale-98 group"
          >
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={28} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Enviar encarte ou folheto</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG ou PDF • Até 10MB</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium">
              <FileImage size={14} />
              Escolher arquivo
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-medium">ou</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <button
            onClick={simulate}
            className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:border-violet-300 transition-all active:scale-98"
          >
            📷 Tirar foto do encarte
          </button>

          {/* How it works */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Como funciona</p>
            <div className="space-y-3">
              {[
                { step: '1', emoji: '📷', text: 'Tire uma foto ou envie o PDF do encarte do mercado' },
                { step: '2', emoji: '🤖', text: 'Nossa IA lê o encarte e identifica todos os produtos e preços' },
                { step: '3', emoji: '🛒', text: 'Os produtos são adicionados automaticamente à sua lista' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(phase === 'uploading' || phase === 'reading') && (
        <div className="py-8 flex flex-col items-center gap-6">
          {/* Animated progress */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-violet-200 dark:border-violet-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={28} className="text-violet-600" />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3 w-full">
            {PHASES.map((p, i) => (
              <div key={p.key} className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
                i < phaseIndex && 'bg-emerald-50 dark:bg-emerald-900/10',
                i === phaseIndex && 'bg-violet-50 dark:bg-violet-900/20',
                i > phaseIndex && 'opacity-30'
              )}>
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
                  i < phaseIndex ? 'bg-emerald-500' :
                  i === phaseIndex ? 'bg-violet-600' :
                  'bg-slate-200 dark:bg-slate-700'
                )}>
                  {i < phaseIndex
                    ? <CheckCircle size={16} className="text-white" />
                    : i === phaseIndex
                      ? <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      : <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                  }
                </div>
                <div>
                  <p className={cn(
                    'text-sm font-semibold',
                    i === phaseIndex ? 'text-violet-700 dark:text-violet-300' :
                    i < phaseIndex ? 'text-emerald-700 dark:text-emerald-400' :
                    'text-slate-400'
                  )}>
                    {p.label}
                  </p>
                  <p className="text-xs text-slate-400">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <>
          {/* Success banner */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                {mockEncarteProducts.length} produtos encontrados!
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Encarte do Carrefour — válido até 12/05</p>
            </div>
          </div>

          {/* Products list */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Produtos extraídos</p>
              <button
                onClick={() => showToast('Produtos adicionados à lista!', 'success')}
                className="flex items-center gap-1.5 text-xs text-violet-600 font-semibold"
              >
                <ShoppingCart size={12} />
                Adicionar todos
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {mockEncarteProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-2xl flex-shrink-0">{product.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.validUntil}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-emerald-600">{formatPrice(product.price)}</span>
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-{product.discount}%</span>
                    </div>
                    <p className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/lista"
              className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2"
              onClick={() => showToast('Produtos adicionados à lista!', 'success')}
            >
              <ShoppingCart size={16} />
              Adicionar à lista
            </Link>
            <button
              onClick={reset}
              className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm"
            >
              Novo encarte
            </button>
          </div>
        </>
      )}
    </div>
  );
}
