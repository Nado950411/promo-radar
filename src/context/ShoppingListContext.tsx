'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ShoppingList, ShoppingListItem } from '@/types';
import { mockShoppingLists } from '@/lib/mock-data';

interface ShoppingListContextType {
  lists: ShoppingList[];
  activeListId: string;
  setActiveListId: (id: string) => void;
  toggleItem: (listId: string, itemId: string) => void;
  removeItem: (listId: string, itemId: string) => void;
  addItem: (listId: string, item: Omit<ShoppingListItem, 'id'>) => void;
  updateQuantity: (listId: string, itemId: string, qty: number) => void;
  getActiveList: () => ShoppingList | undefined;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ShoppingList[]>(mockShoppingLists);
  const [activeListId, setActiveListId] = useState('l1');

  const toggleItem = (listId: string, itemId: string) => {
    setLists(prev => prev.map(l =>
      l.id !== listId ? l : {
        ...l,
        items: l.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i),
      }
    ));
  };

  const removeItem = (listId: string, itemId: string) => {
    setLists(prev => prev.map(l =>
      l.id !== listId ? l : { ...l, items: l.items.filter(i => i.id !== itemId) }
    ));
  };

  const addItem = (listId: string, item: Omit<ShoppingListItem, 'id'>) => {
    const newItem: ShoppingListItem = { ...item, id: `li_${Date.now()}` };
    setLists(prev => prev.map(l =>
      l.id !== listId ? l : { ...l, items: [...l.items, newItem] }
    ));
  };

  const updateQuantity = (listId: string, itemId: string, qty: number) => {
    setLists(prev => prev.map(l =>
      l.id !== listId ? l : {
        ...l,
        items: l.items.map(i => i.id === itemId ? { ...i, quantity: Math.max(1, qty) } : i),
      }
    ));
  };

  const getActiveList = () => lists.find(l => l.id === activeListId);

  return (
    <ShoppingListContext.Provider value={{
      lists, activeListId, setActiveListId,
      toggleItem, removeItem, addItem, updateQuantity, getActiveList,
    }}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error('useShoppingList must be used within ShoppingListProvider');
  return ctx;
}
