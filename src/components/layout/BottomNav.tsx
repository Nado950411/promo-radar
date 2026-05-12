'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, Wallet, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/lista', label: 'Lista', icon: ShoppingCart },
  { href: '/cashback', label: 'Cashback', icon: Wallet },
  { href: '/perfil', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-lg mx-auto px-1 h-16 flex items-center justify-around relative">
        {navItems.slice(0, 2).map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 flex-1',
                active
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={cn('text-xs font-medium', active && 'font-semibold')}>{label}</span>
            </Link>
          );
        })}

        {/* AI Assistant center button */}
        <div className="flex flex-col items-center flex-1 -mt-5">
          <Link
            href="/assistente"
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200',
              pathname === '/assistente'
                ? 'bg-violet-700 scale-105'
                : 'bg-violet-600 hover:bg-violet-700 active:scale-95'
            )}
          >
            <Sparkles size={24} className="text-white" strokeWidth={2} />
          </Link>
          <span className={cn(
            'text-xs font-medium mt-0.5',
            pathname === '/assistente' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
          )}>
            IA
          </span>
        </div>

        {navItems.slice(2).map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 flex-1',
                active
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={cn('text-xs font-medium', active && 'font-semibold')}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
