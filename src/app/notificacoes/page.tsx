'use client';

import { useState } from 'react';
import { mockNotifications } from '@/lib/mock-data';
import { NotificationItem } from '@/components/notificacoes/NotificationItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filter = 'todas' | 'nao_lidas';

export default function NotificacoesPage() {
  const [filter, setFilter] = useState<Filter>('todas');
  const [notifications, setNotifications] = useState(mockNotifications);

  const displayed = filter === 'todas' ? notifications : notifications.filter(n => !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-violet-600 dark:text-violet-400 mt-0.5">{unreadCount} não lidas</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <CheckCheck size={14} />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {(['todas', 'nao_lidas'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === f
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            )}
          >
            {f === 'todas' ? 'Todas' : `Não lidas${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <EmptyState
          emoji="🔔"
          title="Tudo em dia!"
          description="Você não tem novas notificações. Ative alertas nos seus produtos favoritos."
        />
      ) : (
        <div className="space-y-2">
          {displayed.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
