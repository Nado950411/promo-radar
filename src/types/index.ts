export interface Store {
  id: string;
  name: string;
  logo: string;
  type: 'mercado' | 'farmacia';
  distance: number;
  rating: number;
  address: string;
  cashbackPercent?: number;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: Category;
  originalPrice: number;
  promoPrice: number;
  discount: number;
  store: Store;
  unit: string;
  priceHistory: PriceHistory[];
  expiresAt: string;
  isFavorite?: boolean;
  alertEnabled?: boolean;
  lowestHistoricalPrice?: number;
  regionalAvgPrice?: number;
  priceStatus?: 'lowest' | 'below_avg' | 'above_avg';
  purchaseFrequencyDays?: number;
}

export interface Notification {
  id: string;
  productId: string;
  productName: string;
  storeName: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  distance: number;
  timestamp: string;
  read: boolean;
  type: 'price_drop' | 'back_in_stock' | 'expiring_soon' | 'ai_suggestion';
  priority?: 'high' | 'medium' | 'low';
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  location: string;
  radius: number;
  notificationsEnabled: boolean;
  favoriteCategories: Category[];
  totalSaved: number;
  monthlySavingsGoal: number;
  points: number;
  level: string;
}

// Shopping List
export interface ShoppingListItem {
  id: string;
  productId?: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  checked: boolean;
  category: Category;
  emoji: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  type: 'semanal' | 'mensal' | 'custom';
  items: ShoppingListItem[];
  createdAt: string;
}

export interface OptimizedStore {
  store: Store;
  items: ShoppingListItem[];
  subtotal: number;
  savings: number;
}

// Cashback
export interface CashbackTransaction {
  id: string;
  storeName: string;
  storeEmoji: string;
  amount: number;
  purchaseValue: number;
  date: string;
  status: 'pending' | 'confirmed' | 'withdrawn';
}

export interface CashbackCoupon {
  id: string;
  storeName: string;
  storeEmoji: string;
  discount: string;
  description: string;
  expiresAt: string;
  code: string;
  type: 'percent' | 'fixed';
  minPurchase?: number;
  color: string;
  used?: boolean;
}

// Savings / Economia
export interface MonthlySavings {
  month: string;
  shortMonth: string;
  year: number;
  saved: number;
  purchases: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// AI
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIRecommendation {
  product: Product;
  reason: string;
  badge: 'menor_preco' | 'proximo_comprar' | 'favorito_caiu' | 'quase_acabando';
  badgeLabel: string;
}

// Community
export interface CommunityPost {
  id: string;
  userName: string;
  userAvatar: string;
  userLevel: string;
  storeName: string;
  storeEmoji: string;
  productName: string;
  productEmoji: string;
  price: number;
  originalPrice: number;
  discount: number;
  votes: number;
  userVoted: boolean;
  comments: number;
  timestamp: string;
  verified: boolean;
  neighborhood: string;
}

export interface UserRanking {
  position: number;
  name: string;
  avatar: string;
  points: number;
  level: string;
  badge: string;
  promotionsSubmitted: number;
  isCurrentUser?: boolean;
}

export interface UserBadge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// OCR Encarte
export interface EncarteProduct {
  name: string;
  emoji: string;
  price: number;
  originalPrice: number;
  discount: number;
  validUntil: string;
}

export type Category =
  | 'Bebidas'
  | 'Alimentos'
  | 'Higiene'
  | 'Farmácia'
  | 'Limpeza'
  | 'Laticínios'
  | 'Todos';
