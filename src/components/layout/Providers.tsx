'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ToastProvider } from '@/context/ToastContext';
import { ShoppingListProvider } from '@/context/ShoppingListContext';
import { CashbackProvider } from '@/context/CashbackContext';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <ToastProvider>
            <ShoppingListProvider>
              <CashbackProvider>
                {children}
              </CashbackProvider>
            </ShoppingListProvider>
          </ToastProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
