import { SearchParams } from "@/types";

export interface ReportBooking {
  guest_name: string;
  room_type: string;
  date_in: string; // ISO string
  date_out: string; // ISO string
  capacity: string;
  additional: string;
}

export interface Report {
  id: string;
  name: string;
  company: string;
  email: string;
  hotel_name: string;
  status: string;
  bookings: ReportBooking[];
}

export interface ReportTableResponse {
  success: boolean;
  data: Report[];
  pageCount: number;
}

export interface ReportPageProps {
  searchParams: Promise<SearchParams>;
}
