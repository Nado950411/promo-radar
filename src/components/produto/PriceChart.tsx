'use client';

import { PriceHistory } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useMemo } from 'react';

interface PriceChartProps {
  data: PriceHistory[];
}

export function PriceChart({ data }: PriceChartProps) {
  const { points, minPrice, maxPrice, width, height } = useMemo(() => {
    const w = 320;
    const h = 100;
    const prices = data.map(d => d.price);
    const min = Math.min(...prices) * 0.95;
    const max = Math.max(...prices) * 1.05;

    const pts = data.map((d, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((d.price - min) / (max - min)) * h,
      price: d.price,
      date: d.date,
    }));

    return { points: pts, minPrice: min, maxPrice: max, width: w, height: h };
  }, [data]);

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;

  const lastPoint = points[points.length - 1];
  const prevPoint = points[points.length - 2];
  const trending = lastPoint.price <= prevPoint.price;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Histórico de Preço</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trending ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
          {trending ? '↓ Em queda' : '↑ Em alta'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full" style={{ minWidth: '280px' }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#areaGrad)" />
          <path d={pathD} fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {lastPoint && (
            <>
              <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#7C3AED" />
              <circle cx={lastPoint.x} cy={lastPoint.y} r="8" fill="#7C3AED" fillOpacity="0.2" />
            </>
          )}
        </svg>
      </div>

      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{data[0]?.date}</span>
        <span className="font-medium text-violet-600 dark:text-violet-400">{formatPrice(lastPoint?.price ?? 0)}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>

      <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="text-center">
          <p className="text-xs text-slate-400">Mínimo</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(Math.min(...data.map(d => d.price)))}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Médio</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {formatPrice(data.reduce((a, b) => a + b.price, 0) / data.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Máximo</p>
          <p className="text-sm font-bold text-red-500">{formatPrice(Math.max(...data.map(d => d.price)))}</p>
        </div>
      </div>
    </div>
  );
}
