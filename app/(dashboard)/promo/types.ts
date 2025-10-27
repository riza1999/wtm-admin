import { SearchParams } from "@/types";

export type PromoType =
  | "discount"
  | "fixed_price"
  | "room_upgrade"
  | "benefits";

export interface Promo {
  duration: number;
  id: number;
  is_active: boolean;
  promo_code: string;
  promo_description: string;
  promo_detail: PromoDetail;
  promo_end_date: string;
  promo_name: string;
  promo_start_date: string;
  promo_type: string;
}

interface PromoDetail {
  benefit_note: string;
  discount_percentage: number;
  fixed_price: number;
  upgraded_to_id: number;
}

export interface PromoTableResponse {
  success: boolean;
  data: Promo[];
  pageCount: number;
}

export interface PromoPageProps {
  searchParams: Promise<SearchParams>;
}
