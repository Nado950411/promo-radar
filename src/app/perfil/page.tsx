'use client';

import { useState } from 'react';
import { mockUserProfile } from '@/lib/mock-data';
import { Category } from '@/types';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  User, MapPin, Bell, Moon, Sun, ChevronRight,
  ShoppingBag, Heart, Star, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const toggleCategory = (cat: Category) => {
    setProfile(prev => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories.includes(cat)
        ? prev.favoriteCategories.filter(c => c !== cat)
        : [...prev.favoriteCategories, cat],
    }));
  };

  const save = () => showToast('Preferências salvas!', 'success');

  const handleSignOut = async () => {
    await signOut();
    showToast('Até logo!', 'success');
  };

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? mockUserProfile.name;
  const displayEmail = user?.email ?? mockUserProfile.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  if (loading) {
    return (
      <div className="pb-24 space-y-4 animate-pulse">
        <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-40" />
        <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-28" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pb-24 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
        <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
          <User size={36} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Entre na sua conta</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Salve favoritos, alertas e preferências em qualquer dispositivo
          </p>
        </div>
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-3.5 shadow-sm hover:shadow-md transition-all w-full max-w-xs justify-center"
        >
          <svg viewBox="0 0 48 48" width="20" height="20">
            <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.2 7.4-10.3 7.4-17.2z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.8 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.6v6.2C6.5 42.6 14.7 48 24 48z"/>
            <path fill="#FBBC05" d="M10.5 28.6A14.8 14.8 0 0 1 9.8 24c0-1.6.3-3.1.7-4.6v-6.2H2.6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.2z"/>
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.1 30.4 0 24 0 14.7 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z"/>
          </svg>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Entrar com Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-4">
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl overflow-hidden">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-white" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold">{displayName}</h2>
            <p className="text-white/80 text-sm">{displayEmail}</p>
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

      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 hover:text-red-600 transition-colors"
      >
        <LogOut size={16} />
        Sair da conta
      </button>
    </div>
  );
}
