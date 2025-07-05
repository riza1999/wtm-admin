import { SearchParams } from "@/types";

export type BookingStatus = "confirmed" | "rejected" | "in review";
export type PaymentStatus = "paid" | "unpaid";

export interface BookingManagement {
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

export interface BookingManagementTableResponse {
  success: boolean;
  data: BookingManagement[];
  pageCount: number;
}

export interface BookingManagementPageProps {
  searchParams: Promise<SearchParams>;
}
