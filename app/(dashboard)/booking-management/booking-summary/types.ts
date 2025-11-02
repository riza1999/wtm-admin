import { SearchParams } from "@/types";

export type BookingStatus = "confirmed" | "rejected" | "in review";
export type PaymentStatus = "paid" | "unpaid";

export interface BookingSummary {
  agent_company: string;
  agent_name: string;
  booking_code: string;
  booking_id: number;
  booking_status: BookingStatus;
  detail: BookingSummaryDetail[];
  group_promo: string;
  guest_name: string[];
  payment_status: PaymentStatus;
}

export interface BookingSummaryDetail {
  additional: string[];
  booking_status: BookingStatus;
  cancelled_date: string;
  guest_name: string;
  hotel_name: string;
  is_api: boolean;
  payment_status: PaymentStatus;
  promo_code: string;
  promo_id: number;
  sub_booking_id: string;
}

export interface BookingSummaryTableResponse {
  success: boolean;
  data: BookingSummary[];
  pageCount: number;
}

export interface BookingSummaryPageProps {
  searchParams: Promise<SearchParams>;
}
