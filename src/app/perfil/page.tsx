'use client';

import { useState } from 'react';
import { mockUserProfile } from '@/lib/mock-data';
import { Category } from '@/types';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  User, MapPin, Bell, Moon, Sun, ChevronRight,
  ShoppingBag, Heart, Star, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_CATEGORIES: { label: Category; emoji: string }[] = [
  { label: 'Alimentos', emoji: '🍚' },
  { label: 'Bebidas', emoji: '🥤' },
  { label: 'Higiene', emoji: '🧴' },
  { label: 'Farmácia', emoji: '💊' },
  { label: 'Limpeza', emoji: '🧹' },
  { label: 'Laticínios', emoji: '🥛' },
];

const RADIUS_OPTIONS = [1, 3, 5, 10, 20];

export default function PerfilPage() {
  const [profile, setProfile] = useState(mockUserProfile);
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const toggleCategory = (cat: Category) => {
    setProfile(prev => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories.includes(cat)
        ? prev.favoriteCategories.filter(c => c !== cat)
        : [...prev.favoriteCategories, cat],
    }));
  };

  const save = () => showToast('Preferências salvas!', 'success');

  return (
    <div className="pb-24 space-y-4">
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            {profile.avatar}
          </div>
          <div>
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <p className="text-white/80 text-sm">{profile.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-white/70" />
              <span className="text-xs text-white/70">{profile.location}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
          <div className="text-center flex-1">
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-white/70">Favoritos</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-xl font-bold">5</p>
            <p className="text-xs text-white/70">Alertas ativos</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-xl font-bold">R$ 87</p>
            <p className="text-xs text-white/70">Economizados</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Notificações</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-slate-500 dark:text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Alertas de preço</p>
                <p className="text-xs text-slate-400">Avisar quando o preço cair</p>
              </div>
            </div>
            <button
              onClick={() => setProfile(p => ({ ...p, notificationsEnabled: !p.notificationsEnabled }))}
              className={cn(
                'w-11 h-6 rounded-full transition-all duration-200 relative',
                profile.notificationsEnabled ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-600'
              )}
            >
              <span className={cn(
                'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200',
                profile.notificationsEnabled ? 'left-5' : 'left-0.5'
              )} />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun size={18} className="text-slate-500" /> : <Moon size={18} className="text-slate-400" />}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tema escuro</p>
                <p className="text-xs text-slate-400">Modo {theme === 'dark' ? 'escuro' : 'claro'} ativo</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                'w-11 h-6 rounded-full transition-all duration-200 relative',
                theme === 'dark' ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-600'
              )}
            >
              <span className={cn(
                'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200',
                theme === 'dark' ? 'left-5' : 'left-0.5'
              )} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-3">Raio de busca</h3>
        <div className="flex gap-2">
          {RADIUS_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => setProfile(p => ({ ...p, radius: r }))}
              className={cn(
                'flex-1 py-2 rounded-xl text-sm font-medium transition-all',
                profile.radius === r
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              )}
            >
              {r}km
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-3">Categorias favoritas</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map(({ label, emoji }) => {
            const active = profile.favoriteCategories.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggleCategory(label)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  active
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                )}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {[
          { icon: ShoppingBag, label: 'Histórico de compras', desc: 'Ver produtos visualizados' },
          { icon: Heart, label: 'Produtos favoritos', desc: 'Gerenciar sua lista' },
          { icon: Star, label: 'Avaliações', desc: 'Produtos que você avaliou' },
        ].map(({ icon: Icon, label, desc }, i, arr) => (
          <div
            key={label}
            className={cn(
              'flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors',
              i < arr.length - 1 && 'border-b border-slate-100 dark:border-slate-700'
            )}
          >
            <Icon size={18} className="text-slate-500 dark:text-slate-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
          </div>
        ))}
      </div>

      <Button onClick={save} fullWidth variant="primary">
        Salvar preferências
      </Button>

      <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 hover:text-red-600 transition-colors">
        <LogOut size={16} />
        Sair da conta
      </button>
    </div>
  );
}
