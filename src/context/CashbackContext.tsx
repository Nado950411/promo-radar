'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CashbackCoupon, CashbackTransaction } from '@/types';
import { mockCashbackBalance, mockCashbackCoupons, mockCashbackTransactions } from '@/lib/mock-data';

interface CashbackContextType {
  balance: number;
  coupons: CashbackCoupon[];
  transactions: CashbackTransaction[];
  useCoupon: (couponId: string) => void;
  withdraw: () => void;
}

const CashbackContext = createContext<CashbackContextType | undefined>(undefined);

export function CashbackProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(mockCashbackBalance);
  const [coupons, setCoupons] = useState<CashbackCoupon[]>(mockCashbackCoupons);
  const [transactions] = useState<CashbackTransaction[]>(mockCashbackTransactions);

  const useCoupon = (couponId: string) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, used: true } : c));
  };

  const withdraw = () => {
    setBalance(0);
  };

  return (
    <CashbackContext.Provider value={{ balance, coupons, transactions, useCoupon, withdraw }}>
      {children}
    </CashbackContext.Provider>
  );
}

export function useCashback() {
  const ctx = useContext(CashbackContext);
  if (!ctx) throw new Error('useCashback must be used within CashbackProvider');
  return ctx;
}
