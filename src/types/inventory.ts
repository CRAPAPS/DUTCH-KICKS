export type ItemStatus = 'available' | 'sold' | 'pending';
export type ItemCategory = 'kicks' | 'skate' | 'fight' | 'comics';

interface BaseItem {
  id: string;
  title: string;
  status: ItemStatus;
  price: number | null;
  image_url: string | null;
  ref_image_url: string | null;
  created_at: string;
}

export interface KicksItem extends BaseItem {
  category: 'kicks';
  metadata: { sku: string | null; size: number; colorway: string };
}

export interface SkateItem extends BaseItem {
  category: 'skate';
  metadata: { sku: string | null; size: number; colorway: string };
}

export interface FightItem extends BaseItem {
  category: 'fight';
  metadata: { serial: string | null; set_name: string; autograph: boolean; parallel?: string };
}

export interface ComicsItem extends BaseItem {
  category: 'comics';
  metadata: { issue: number; grade?: string; key_issue: boolean; publisher: string };
}

export type InventoryItem = KicksItem | SkateItem | FightItem | ComicsItem;
