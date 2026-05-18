export type ItemStatus   = 'available' | 'sold' | 'pending';
export type ItemCategory = 'kicks' | 'skate' | 'fight' | 'comics' | 'baseball' | 'basketball' | 'watches';

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
  metadata: { sku: string | null; size: number; colorway: string; label_image_url?: string | null; size_label?: string | null; gallery?: string[] };
}

export interface SkateItem extends BaseItem {
  category: 'skate';
  metadata: { sku: string | null; size: number; colorway: string; label_image_url?: string | null; gallery?: string[] };
}

export interface FightItem extends BaseItem {
  category: 'fight';
  metadata: { serial: string | null; set_name: string; autograph: boolean; parallel?: string; gallery?: string[] };
}

export interface ComicsItem extends BaseItem {
  category: 'comics';
  metadata: { issue: number; grade?: string; key_issue: boolean; publisher: string; gallery?: string[] };
}

export interface BaseballItem extends BaseItem {
  category: 'baseball';
  metadata: { player: string; year: number; set_name: string; serial: string | null; autograph: boolean; grade?: string; parallel?: string; gallery?: string[] };
}

export interface BasketballItem extends BaseItem {
  category: 'basketball';
  metadata: { player: string; year: number; set_name: string; serial: string | null; autograph: boolean; grade?: string; parallel?: string; gallery?: string[] };
}

export interface WatchItem extends BaseItem {
  category: 'watches';
  metadata: { brand: string; model: string; reference?: string; condition: string; box_papers?: boolean; gallery?: string[] };
}

export type InventoryItem = KicksItem | SkateItem | FightItem | ComicsItem | BaseballItem | BasketballItem | WatchItem;
