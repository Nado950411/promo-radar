import { mockStores } from '@/lib/mock-data';
import { formatDistance } from '@/lib/utils';
import { Star, MapPin } from 'lucide-react';
import { StoreSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

interface NearbyStoresProps {
  loading?: boolean;
  maxDistance?: number;
}

export function NearbyStores({ loading = false, maxDistance = 10 }: NearbyStoresProps) {
  const stores = mockStores.filter(s => s.distance <= maxDistance);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {[1, 2, 3].map(i => <div key={i} className="min-w-[160px]"><StoreSkeleton /></div>)}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {stores.map(store => (
        <div
          key={store.id}
          className="min-w-[155px] bg-white dark:bg-slate-800 rounded-2xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200 cursor-pointer flex-shrink-0"
        >
          <div className="text-3xl mb-2">{store.logo}</div>
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">{store.name}</p>
          <div className="flex items-center gap-1 mb-1.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">{store.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-violet-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">{formatDistance(store.distance)}</span>
          </div>
          <Badge variant="store" className="mt-2">
            {store.type === 'mercado' ? 'Mercado' : 'Farmácia'}
          </Badge>
        </div>
      ))}
    </div>
  );
}
