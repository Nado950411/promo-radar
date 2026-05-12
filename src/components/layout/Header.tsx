'use client';

import { Bell, Sun, Moon, MapPin, TrendingDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { mockNotifications, mockUserProfile } from '@/lib/mock-data';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
            <TrendingDown size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 dark:text-white leading-none">
              Promo<span className="text-violet-600">Radar</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl mr-1">
            <MapPin size={11} className="text-violet-500" />
            <span className="font-medium">{mockUserProfile.location.split(',')[0]}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <Link
            href="/notificacoes"
            className="relative w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
