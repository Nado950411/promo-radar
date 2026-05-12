'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { promoBanners } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i === 0 ? promoBanners.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === promoBanners.length - 1 ? 0 : i + 1));

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {promoBanners.map(banner => (
          <div
            key={banner.id}
            className={`min-w-full bg-gradient-to-r ${banner.color} rounded-2xl p-5 flex items-center justify-between`}
          >
            <div className="flex-1">
              <p className="text-white/80 text-xs font-medium mb-1">DESTAQUE DO DIA</p>
              <h2 className="text-white font-bold text-xl mb-1">{banner.title}</h2>
              <p className="text-white/90 text-sm">{banner.subtitle}</p>
            </div>
            <div className="text-5xl ml-4">{banner.emoji}</div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {promoBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn('rounded-full transition-all duration-200', i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50')}
          />
        ))}
      </div>
    </div>
  );
}
