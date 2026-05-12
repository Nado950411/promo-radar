'use client';

import { useState } from 'react';
import { mockCommunityPosts, mockUserRankings, mockUserBadges, mockUserProfile } from '@/lib/mock-data';
import { CommunityPost } from '@/types';
import { formatPrice, formatRelativeTime, cn } from '@/lib/utils';
import {
  ThumbsUp, MessageSquare, CheckCircle, Crown,
  Plus, Camera, MapPin, Star, Lock,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const RARITY_BORDER = {
  common: 'border-slate-200 dark:border-slate-700',
  rare: 'border-blue-300 dark:border-blue-700',
  epic: 'border-purple-400 dark:border-purple-600',
  legendary: 'border-amber-400 dark:border-amber-500 shadow-amber-100 dark:shadow-amber-900/20',
};

export default function ComunidadePage() {
  const [tab, setTab] = useState<'feed' | 'ranking' | 'conquistas'>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const { showToast } = useToast();

  const toggleVote = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id !== id ? p : {
        ...p,
        userVoted: !p.userVoted,
        votes: p.userVoted ? p.votes - 1 : p.votes + 1,
      }
    ));
  };

  return (
    <div className="pb-24 space-y-4">
      {/* Header with user rank */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Comunidade</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{mockUserProfile.points.toLocaleString()} pontos • {mockUserProfile.level}</p>
        </div>
        <button
          onClick={() => showToast('Em breve: enviar promoção por foto!', 'info')}
          className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium active:scale-95 transition-transform shadow-sm"
        >
          <Camera size={14} />
          Enviar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {(['feed', 'ranking', 'conquistas'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-xs font-medium transition-all',
              tab === t
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            )}
          >
            {t === 'feed' ? '📢 Feed' : t === 'ranking' ? '🏆 Ranking' : '🎖️ Badges'}
          </button>
        ))}
      </div>

      {tab === 'feed' && (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {/* Post header */}
              <div className="flex items-center gap-3 px-4 pt-3.5 pb-2">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-lg">
                  {post.userAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{post.userName}</p>
                    {post.verified && <CheckCircle size={13} className="text-violet-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-1.5 py-0.5 rounded-full font-medium">
                      {post.userLevel}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatRelativeTime(post.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Product */}
              <div className="mx-4 mb-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-3 flex items-center gap-3">
                <span className="text-3xl">{post.productEmoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{post.productName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-bold text-emerald-600">{formatPrice(post.price)}</span>
                    <span className="text-xs text-slate-400 line-through">{formatPrice(post.originalPrice)}</span>
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-{post.discount}%</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 px-4 mb-3">
                <span className="text-base">{post.storeEmoji}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{post.storeName}</p>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <MapPin size={11} className="text-violet-400" />
                <p className="text-xs text-slate-400">{post.neighborhood}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => toggleVote(post.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium transition-all active:scale-95',
                    post.userVoted ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                  )}
                >
                  <ThumbsUp size={15} strokeWidth={post.userVoted ? 2.5 : 1.8} />
                  {post.votes}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                  <MessageSquare size={15} strokeWidth={1.8} />
                  {post.comments}
                </button>
                {post.verified && (
                  <span className="ml-auto text-[10px] bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                    ✓ Verificado
                  </span>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => showToast('Envie sua primeira promoção!', 'info')}
            className="w-full py-3.5 border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-2xl text-violet-600 dark:text-violet-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors"
          >
            <Plus size={16} />
            Compartilhar uma promoção
          </button>
        </div>
      )}

      {tab === 'ranking' && (
        <div className="space-y-2">
          {mockUserRankings.map(user => (
            <div
              key={user.position}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all',
                user.isCurrentUser
                  ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
                user.position === 1 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                user.position === 2 ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' :
                user.position === 3 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                'bg-slate-100 dark:bg-slate-700 text-slate-400'
              )}>
                {user.position === 1 ? '👑' : user.position === 2 ? '🥈' : user.position === 3 ? '🥉' : user.position}
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={cn('text-sm font-semibold truncate', user.isCurrentUser ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-slate-200')}>
                    {user.name} {user.isCurrentUser && '(você)'}
                  </p>
                </div>
                <p className="text-xs text-slate-400">{user.promotionsSubmitted} promoções • {user.level}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.points.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">pts</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'conquistas' && (
        <>
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-3 flex items-center gap-3 border border-violet-200 dark:border-violet-800">
            <span className="text-3xl">🎯</span>
            <div>
              <p className="text-sm font-bold text-violet-800 dark:text-violet-300">{mockUserProfile.level}</p>
              <p className="text-xs text-violet-600 dark:text-violet-400">{mockUserProfile.points.toLocaleString()} pontos • Ranking #8</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {mockUserBadges.map(badge => (
              <div
                key={badge.id}
                className={cn(
                  'bg-white dark:bg-slate-800 rounded-2xl border-2 p-4 shadow-sm transition-all',
                  RARITY_BORDER[badge.rarity],
                  !badge.unlocked && 'opacity-50 grayscale'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{badge.emoji}</span>
                  {!badge.unlocked && <Lock size={14} className="text-slate-400" />}
                  {badge.rarity === 'legendary' && badge.unlocked && <Crown size={14} className="text-amber-500" />}
                  {badge.rarity === 'epic' && badge.unlocked && <Star size={14} className="text-purple-500" />}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{badge.title}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{badge.description}</p>
                <div className={cn(
                  'mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block',
                  badge.rarity === 'legendary' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                )}>
                  {badge.rarity === 'legendary' ? '✨ Lendário' : badge.rarity === 'epic' ? '💫 Épico' : badge.rarity === 'rare' ? '💎 Raro' : 'Comum'}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
