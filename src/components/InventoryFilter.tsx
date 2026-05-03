'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ItemCategory } from '@/types/inventory';

const FILTERS: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all',        label: 'ALL'        },
  { key: 'kicks',      label: 'KICKS'      },
  { key: 'skate',      label: 'SKATE'      },
  { key: 'fight',      label: 'UFC'        },
  { key: 'baseball',   label: 'BASEBALL'   },
  { key: 'basketball', label: 'BASKETBALL' },
  { key: 'watches',    label: 'WATCHES'    },
  { key: 'comics',     label: 'COMICS'     },
];

function activeClass(isActive: boolean, key: string) {
  if (!isActive) return 'glass text-white/40 border border-white/10 hover:text-white/80 hover:border-white/30 transition-all';
  if (key === 'fight' || key === 'baseball') return 'bg-gold text-noir font-black border border-gold glow-gold';
  if (key === 'kicks' || key === 'skate')    return 'bg-lime text-noir font-black border border-lime glow-lime';
  if (key === 'basketball')                  return 'bg-orange text-noir font-black border border-orange glow-orange';
  return 'bg-white text-noir font-black border border-white';
}

export default function InventoryFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get('category') ?? 'all') as ItemCategory | 'all';

  function setFilter(key: ItemCategory | 'all') {
    const url = key === 'all' ? '/inventory' : `/inventory?category=${key}`;
    router.push(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`font-display text-sm font-bold tracking-widest px-5 py-2 rounded-full cursor-pointer ${activeClass(current === key, key)}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
