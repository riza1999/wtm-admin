export type BookingStatus = "confirmed" | "rejected" | "in review";
export type PaymentStatus = "paid" | "unpaid";

export interface HistoryBookingLog {
  booking_id: string;
  confirm_date: string; // ISO string
  agent_name: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  date_in: string; // ISO string
  date_out: string; // ISO string
  hotel_name: string;
  room_type: string;
  room_night: number;
  capacity: string;
}

export interface HistoryBookingLogTableResponse {
  success: boolean;
  data: HistoryBookingLog[];
  pageCount: number;
}
