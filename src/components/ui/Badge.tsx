import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'discount' | 'category' | 'store' | 'expiring';
  className?: string;
}

export function Badge({ children, variant = 'category', className }: BadgeProps) {
  const variants = {
    discount: 'bg-orange-500 text-white font-bold',
    category: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    store: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    expiring: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs', variants[variant], className)}>
      {children}
    </span>
  );
}
