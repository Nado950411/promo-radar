'use client';

import { useState } from 'react';
import { useShoppingList } from '@/context/ShoppingListContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { ShoppingListItem } from '@/types';
import { mockStores } from '@/lib/mock-data';
import { formatPrice, cn } from '@/lib/utils';
import {
  ShoppingCart, Plus, Trash2, Minus, Check,
  Sparkles, X, TrendingDown, Store,
} from 'lucide-react';

const QUICK_ADD = [
  { name: 'Leite Integral 1L', emoji: '🥛', price: 4.49, category: 'Laticínios' as const, unit: 'cx' },
  { name: 'Pão de Forma', emoji: '🍞', price: 8.9, category: 'Alimentos' as const, unit: 'pacote' },
  { name: 'Ovos 12un', emoji: '🥚', price: 14.9, category: 'Alimentos' as const, unit: 'cx' },
  { name: 'Manteiga 200g', emoji: '🧈', price: 9.9, category: 'Laticínios' as const, unit: 'un' },
  { name: 'Queijo Mussarela', emoji: '🧀', price: 18.9, category: 'Laticínios' as const, unit: '300g' },
  { name: 'Frango Peito 1kg', emoji: '🍗', price: 22.9, category: 'Alimentos' as const, unit: 'kg' },
];

export default function ListaPage() {
  const { lists, activeListId, setActiveListId, toggleItem, removeItem, addItem, updateQuantity, getActiveList } = useShoppingList();
  const { showToast } = useToast();
  const [showOptimize, setShowOptimize] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const activeList = getActiveList();
  if (!activeList) return null;

  const checkedCount = activeList.items.filter(i => i.checked).length;
  const total = activeList.items.reduce((sum, i) => sum + i.estimatedPrice * i.quantity, 0);
  const checkedTotal = activeList.items.filter(i => i.checked).reduce((sum, i) => sum + i.estimatedPrice * i.quantity, 0);

  // Simulate store optimization
  const optimizedStores = [
    {
      store: mockStores[0],
      items: activeList.items.filter((_, i) => i % 3 === 0),
      subtotal: total * 0.4,
      savings: total * 0.4 * 0.18,
    },
    {
      store: mockStores[5],
      items: activeList.items.filter((_, i) => i % 3 === 1),
      subtotal: total * 0.35,
      savings: total * 0.35 * 0.12,
    },
    {
      store: mockStores[3],
      items: activeList.items.filter((_, i) => i % 3 === 2),
      subtotal: total * 0.25,
      savings: total * 0.25 * 0.22,
    },
  ];
  const totalSavings = optimizedStores.reduce((s, o) => s + o.savings, 0);

  const handleAddQuick = (item: typeof QUICK_ADD[0]) => {
    addItem(activeListId, {
      name: item.name,
      emoji: item.emoji,
      estimatedPrice: item.price,
      category: item.category,
      unit: item.unit,
      quantity: 1,
      checked: false,
    });
    showToast(`${item.emoji} ${item.name} adicionado!`, 'success');
  };

  const handleAddCustom = () => {
    if (!newItemName.trim()) return;
    addItem(activeListId, {
      name: newItemName.trim(),
      emoji: '🛒',
      estimatedPrice: 0,
      category: 'Alimentos',
      unit: 'un',
      quantity: 1,
      checked: false,
    });
    setNewItemName('');
    setShowAddItem(false);
    showToast('Item adicionado!', 'success');
  };

  return (
    <div className="pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Minha Lista</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {checkedCount}/{activeList.items.length} itens • {formatPrice(total)}
          </p>
        </div>
        <button
          onClick={() => setShowAddItem(true)}
          className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <Plus size={18} className="text-white" />
        </button>
      </div>

      {/* List Tabs */}
      <div className="flex gap-2">
        {lists.map(list => (
          <button
            key={list.id}
            onClick={() => setActiveListId(list.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeListId === list.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            )}
          >
            {list.type === 'semanal' ? '📅 Semanal' : '📆 Mensal'}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {activeList.items.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>{checkedCount} de {activeList.items.length} concluídos</span>
            <span className="text-emerald-600 font-medium">{formatPrice(checkedTotal)} selecionado</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${activeList.items.length > 0 ? (checkedCount / activeList.items.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {activeList.items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Lista vazia</p>
            <p className="text-xs text-slate-400 mt-1">Adicione itens abaixo</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {activeList.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 transition-colors',
                  item.checked && 'bg-slate-50 dark:bg-slate-800/50'
                )}
              >
                <button
                  onClick={() => toggleItem(activeListId, item.id)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    item.checked
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300 dark:border-slate-600 hover:border-violet-400'
                  )}
                >
                  {item.checked && <Check size={12} className="text-white" strokeWidth={3} />}
                </button>

                <span className="text-xl flex-shrink-0">{item.emoji}</span>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium text-slate-800 dark:text-slate-200',
                    item.checked && 'line-through text-slate-400'
                  )}>
                    {item.name}
                  </p>
                  {item.estimatedPrice > 0 && (
                    <p className="text-xs text-slate-400">{formatPrice(item.estimatedPrice)} × {item.quantity}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 rounded-xl px-2 py-1">
                    <button onClick={() => updateQuantity(activeListId, item.id, item.quantity - 1)} className="text-slate-500 hover:text-slate-700">
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(activeListId, item.id, item.quantity + 1)} className="text-slate-500 hover:text-slate-700">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(activeListId, item.id)}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick add */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Adicionar rápido</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {QUICK_ADD.map((item) => (
            <button
              key={item.name}
              onClick={() => handleAddQuick(item)}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-violet-300 transition-all active:scale-95"
            >
              <span>{item.emoji}</span>
              <span className="text-xs font-medium whitespace-nowrap">{item.name.split(' ').slice(0, 2).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optimize button */}
      {activeList.items.length > 0 && (
        <button
          onClick={() => setShowOptimize(true)}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-violet-200 dark:shadow-violet-900/30 active:scale-98 transition-transform"
        >
          <Sparkles size={16} />
          Otimizar Compra — Economize {formatPrice(totalSavings)}
        </button>
      )}

      {/* Optimization Modal */}
      {showOptimize && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowOptimize(false)} />
          <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-t-3xl p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Compra Otimizada</h3>
                <p className="text-xs text-slate-500 mt-0.5">Divida entre lojas e economize mais</p>
              </div>
              <button onClick={() => setShowOptimize(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-3 mb-4 text-center">
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Você economizaria</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(totalSavings)}</p>
              <p className="text-emerald-600/70 text-xs">comprando em 3 lojas diferentes</p>
            </div>

            <div className="space-y-3">
              {optimizedStores.map(({ store, items, subtotal, savings }) => (
                <div key={store.id} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{store.logo}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{store.name}</p>
                        <p className="text-xs text-slate-400">{store.distance}km • {items.length} itens</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatPrice(subtotal)}</p>
                      <p className="text-xs text-emerald-600">-{formatPrice(savings)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {items.slice(0, 3).map(i => (
                      <span key={i.id} className="text-xs bg-white dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300">
                        {i.emoji} {i.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    ))}
                    {items.length > 3 && (
                      <span className="text-xs bg-white dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-400">+{items.length - 3}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setShowOptimize(false); showToast('Rota otimizada criada!', 'success'); }}
              className="w-full mt-4 py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Store size={16} />
              Usar essa rota
            </button>
          </div>
        </div>
      )}

      {/* Add item modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddItem(false)} />
          <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-t-3xl p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Adicionar item</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                placeholder="Nome do produto..."
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-400"
                autoFocus
              />
              <button onClick={handleAddCustom} className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium">
                Adicionar
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 mb-3">Ou adicione rapidamente:</p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ADD.map(item => (
                <button
                  key={item.name}
                  onClick={() => { handleAddQuick(item); setShowAddItem(false); }}
                  className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="truncate w-full text-center">{item.name.split(' ').slice(0, 2).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
