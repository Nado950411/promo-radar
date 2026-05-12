'use client';

import { useState, useEffect } from 'react';
import { mockUserRankings, mockUserBadges, mockUserProfile } from '@/lib/mock-data';
import { fetchPosts, fetchUserVotes, toggleVote, createPost, type PostDB } from '@/lib/supabase/community';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatRelativeTime, cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import {
  ThumbsUp, MessageSquare, CheckCircle, Crown,
  Plus, Camera, MapPin, Star, Lock, X, Loader2,
} from 'lucide-react';

const RARITY_BORDER = {
  common: 'border-slate-200 dark:border-slate-700',
  rare: 'border-blue-300 dark:border-blue-700',
  epic: 'border-purple-400 dark:border-purple-600',
  legendary: 'border-amber-400 dark:border-amber-500 shadow-amber-100 dark:shadow-amber-900/20',
};

const PRODUCT_EMOJIS = ['🛒', '🍚', '🥤', '🧴', '💊', '🧹', '🥛', '🍗', '🥩', '🧀', '🍞', '🧺'];
const STORE_EMOJIS = ['🏪', '🛒', '🏬', '🏥', '🧺', '💊'];

type FormData = {
  product_name: string;
  product_emoji: string;
  price: string;
  original_price: string;
  store_name: string;
  store_emoji: string;
  neighborhood: string;
};

const EMPTY_FORM: FormData = {
  product_name: '',
  product_emoji: '🛒',
  price: '',
  original_price: '',
  store_name: '',
  store_emoji: '🏪',
  neighborhood: '',
};

export default function ComunidadePage() {
  const [tab, setTab] = useState<'feed' | 'ranking' | 'conquistas'>('feed');
  const [posts, setPosts] = useState<PostDB[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (user) loadUserVotes();
  }, [user]);

  async function loadPosts() {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch {
      showToast('Erro ao carregar posts', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadUserVotes() {
    if (!user) return;
    try {
      const ids = await fetchUserVotes(user.id);
      setVotedIds(new Set(ids));
    } catch {
      // silencioso
    }
  }

  async function handleVote(postId: string) {
    if (!user) {
      showToast('Faça login para votar', 'info');
      return;
    }

    const wasVoted = votedIds.has(postId);

    // Atualização otimista
    setVotedIds(prev => {
      const next = new Set(prev);
      wasVoted ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id !== postId ? p : { ...p, votes: wasVoted ? p.votes - 1 : p.votes + 1 }
    ));

    try {
      await toggleVote(postId, user.id);
    } catch {
      // Reverte em caso de erro
      setVotedIds(prev => {
        const next = new Set(prev);
        wasVoted ? next.add(postId) : next.delete(postId);
        return next;
      });
      setPosts(prev => prev.map(p =>
        p.id !== postId ? p : { ...p, votes: wasVoted ? p.votes + 1 : p.votes - 1 }
      ));
      showToast('Erro ao votar', 'error');
    }
  }

  async function handleSubmit() {
    if (!user) return;
    const price = parseFloat(form.price.replace(',', '.'));
    const originalPrice = parseFloat(form.original_price.replace(',', '.'));

    if (!form.product_name || !form.store_name || !form.neighborhood || isNaN(price) || isNaN(originalPrice)) {
      showToast('Preencha todos os campos', 'error');
      return;
    }
    if (price >= originalPrice) {
      showToast('Preço promocional deve ser menor que o original', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const newPost = await createPost({
        user_id: user.id,
        user_name: user.user_metadata?.full_name ?? user.email ?? 'Usuário',
        user_avatar_url: user.user_metadata?.avatar_url ?? null,
        user_level: 'Novato',
        product_name: form.product_name,
        product_emoji: form.product_emoji,
        price,
        original_price: originalPrice,
        store_name: form.store_name,
        store_emoji: form.store_emoji,
        neighborhood: form.neighborhood,
      });

      setPosts(prev => [newPost, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      showToast('Promoção compartilhada!', 'success');
    } catch {
      showToast('Erro ao publicar. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Comunidade</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mockUserProfile.points.toLocaleString()} pontos • {mockUserProfile.level}
          </p>
        </div>
        <button
          onClick={() => user ? setShowForm(true) : showToast('Faça login para compartilhar', 'info')}
          className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium active:scale-95 transition-transform shadow-sm"
        >
          <Camera size={14} />
          Enviar
        </button>
      </div>

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
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-3 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl" />
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">📢</p>
              <p className="font-medium">Nenhuma promoção ainda</p>
              <p className="text-sm">Seja o primeiro a compartilhar!</p>
            </div>
          ) : (
            posts.map(post => {
              const discount = Math.round((1 - post.price / post.original_price) * 100);
              const voted = votedIds.has(post.id);
              return (
                <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-4 pt-3.5 pb-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                      {post.user_avatar_url
                        ? <img src={post.user_avatar_url} alt={post.user_name} className="w-full h-full object-cover" />
                        : '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{post.user_name}</p>
                        {post.verified && <CheckCircle size={13} className="text-violet-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-1.5 py-0.5 rounded-full font-medium">
                          {post.user_level}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatRelativeTime(post.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mx-4 mb-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-3xl">{post.product_emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{post.product_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-lg font-bold text-emerald-600">{formatPrice(post.price)}</span>
                        <span className="text-xs text-slate-400 line-through">{formatPrice(post.original_price)}</span>
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-{discount}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-4 mb-3">
                    <span className="text-base">{post.store_emoji}</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{post.store_name}</p>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <MapPin size={11} className="text-violet-400" />
                    <p className="text-xs text-slate-400">{post.neighborhood}</p>
                  </div>

                  <div className="flex items-center gap-4 px-4 py-3 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => handleVote(post.id)}
                      className={cn(
                        'flex items-center gap-1.5 text-sm font-medium transition-all active:scale-95',
                        voted ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                      )}
                    >
                      <ThumbsUp size={15} strokeWidth={voted ? 2.5 : 1.8} />
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
              );
            })
          )}

          {!loading && (
            <button
              onClick={() => user ? setShowForm(true) : showToast('Faça login para compartilhar', 'info')}
              className="w-full py-3.5 border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-2xl text-violet-600 dark:text-violet-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors"
            >
              <Plus size={16} />
              Compartilhar uma promoção
            </button>
          )}
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
                <p className={cn('text-sm font-semibold truncate', user.isCurrentUser ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-slate-200')}>
                  {user.name} {user.isCurrentUser && '(você)'}
                </p>
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

      {/* Modal de novo post */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowForm(false)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Nova promoção</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Nome do produto</label>
                <input
                  value={form.product_name}
                  onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                  placeholder="Ex: Arroz 5kg"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Emoji do produto</label>
                <div className="flex gap-2 flex-wrap">
                  {PRODUCT_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => setForm(f => ({ ...f, product_emoji: e }))}
                      className={cn(
                        'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all',
                        form.product_emoji === e
                          ? 'bg-violet-100 dark:bg-violet-900/30 ring-2 ring-violet-500'
                          : 'bg-slate-100 dark:bg-slate-800'
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Preço promocional</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">R$</span>
                    <input
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="0,00"
                      inputMode="decimal"
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Preço original</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">R$</span>
                    <input
                      value={form.original_price}
                      onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))}
                      placeholder="0,00"
                      inputMode="decimal"
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Nome da loja</label>
                <input
                  value={form.store_name}
                  onChange={e => setForm(f => ({ ...f, store_name: e.target.value }))}
                  placeholder="Ex: Mercado Extra"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Emoji da loja</label>
                <div className="flex gap-2">
                  {STORE_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => setForm(f => ({ ...f, store_emoji: e }))}
                      className={cn(
                        'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all',
                        form.store_emoji === e
                          ? 'bg-violet-100 dark:bg-violet-900/30 ring-2 ring-violet-500'
                          : 'bg-slate-100 dark:bg-slate-800'
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Bairro</label>
                <input
                  value={form.neighborhood}
                  onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))}
                  placeholder="Ex: Centro"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {submitting ? 'Publicando...' : 'Publicar promoção'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}