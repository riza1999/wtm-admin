import { SearchParams } from "@/types";

export type BookingStatus = "confirmed" | "rejected" | "in review";
export type PaymentStatus = "paid" | "unpaid";

export interface HistoryBookingLog {
  agent_name: string;
  booking_code: string;
  booking_status: BookingStatus;
  capacity: string;
  check_in_date: string;
  check_out_date: string;
  confirm_date: string;
  hotel_name: string;
  payment_status: PaymentStatus;
  room_nights: number;
  room_type_name: string;
}

export interface HistoryBookingLogTableResponse {
  success: boolean;
  data: HistoryBookingLog[];
  pageCount: number;
}

export interface HistoryBookingLogPageProps {
  searchParams: Promise<SearchParams>;
}
