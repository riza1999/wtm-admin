import { SearchParams } from "@/types";

export type BookingStatus = "confirmed" | "rejected" | "in review";
export type PaymentStatus = "paid" | "unpaid";

export interface HistoryBookingLog {
  booking_code: string;
  booking_id: number;
  booking_status: BookingStatus;
  detail: Detail[];
  guest_name: string[];
  payment_status: PaymentStatus;
}

interface Detail {
  additional: string[];
  agent_name: string;
  booking_status: BookingStatus;
  cancellation_date: string;
  guest_name: string;
  hotel_name: string;
  payment_status: PaymentStatus;
  sub_booking_id: string;
}

export interface HistoryBookingLogTableResponse {
  success: boolean;
  data: HistoryBookingLog[];
  pageCount: number;
}

export interface HistoryBookingLogPageProps {
  searchParams: Promise<SearchParams>;
}
