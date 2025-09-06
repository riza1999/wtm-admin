import { SearchParams } from "@/types";

export type PromoType =
  | "discount"
  | "fixed_price"
  | "room_upgrade"
  | "benefits";

// Default promo type
export const DEFAULT_PROMO_TYPE: PromoType = "discount";

export interface Promo {
  id: string;
  name: string;
  type: PromoType;
  // Conditional fields based on type
  discount_percentage?: number; // for type "discount"
  price_discount?: number; // for type "fixed_price"
  room_upgrade_to?: string; // for type "room_upgrade"
  benefits?: string; // for type "benefits"
  code: string;
  description: string;
  start_date: string; //ISO string
  end_date: string; //ISO string
  hotel_name: string;
  room_type: string;
  bed_type: string;
  nights: number;
  status: boolean;
}

export interface PromoTableResponse {
  success: boolean;
  data: Promo[];
  pageCount: number;
}

export interface PromoPageProps {
  searchParams: Promise<SearchParams>;
}

// Schema for creating a new promo
export interface CreatePromoSchema {
  name: string;
  type: PromoType;
  // Conditional fields based on type
  discount_percentage?: number;
  price_discount?: number;
  room_upgrade_to?: string;
  benefits?: string;
  code: string;
  description: string;
  start_date: string;
  end_date: string;
  hotel_name: string;
  room_type: string;
  bed_type: string;
  nights: number;
  status: boolean;
}

// Schema for editing an existing promo
export interface EditPromoSchema {
  name: string;
  type: PromoType;
  // Conditional fields based on type
  discount_percentage?: number;
  price_discount?: number;
  room_upgrade_to?: string;
  benefits?: string;
  code: string;
  description: string;
  start_date: string;
  end_date: string;
  hotel_name: string;
  room_type: string;
  bed_type: string;
  nights: number;
  status: boolean;
}
