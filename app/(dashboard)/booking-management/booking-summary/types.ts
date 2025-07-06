import { SearchParams } from "@/types";

export type BookingStatus = "confirmed" | "rejected" | "in review";
export type PaymentStatus = "paid" | "unpaid";

export interface BookingSummary {
  id: string;
  guest_name: string;
  agent_name: string;
  agent_company: string;
  group_promo: string;
  booking_id: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  promo_id: string;
}

export interface BookingSummaryTableResponse {
  success: boolean;
  data: BookingSummary[];
  pageCount: number;
}

export interface BookingSummaryPageProps {
  searchParams: Promise<SearchParams>;
}
