'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { mockProducts } from '@/lib/mock-data';

interface FavoritesContextType {
  products: Product[];
  toggleFavorite: (id: string) => void;
  toggleAlert: (id: string) => void;
  isFavorite: (id: string) => boolean;
  hasAlert: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  products: [],
  toggleFavorite: () => {},
  toggleAlert: () => {},
  isFavorite: () => false,
  hasAlert: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const toggleFavorite = (id: string) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    );
  };

  const toggleAlert = (id: string) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, alertEnabled: !p.alertEnabled } : p)
    );
  };

  const isFavorite = (id: string) => products.find(p => p.id === id)?.isFavorite ?? false;
  const hasAlert = (id: string) => products.find(p => p.id === id)?.alertEnabled ?? false;

  return (
    <FavoritesContext.Provider value={{ products, toggleFavorite, toggleAlert, isFavorite, hasAlert }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
