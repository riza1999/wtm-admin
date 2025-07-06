import { SearchParams } from "@/types";

export interface RoomAvailability {
  id: string;
  name: string;
  availability: boolean[];
}

export interface RoomAvailabilityHotel {
  id: string;
  name: string;
  period: string;
  rooms: RoomAvailability[];
}

export interface RoomAvailabilityTableResponse {
  success: boolean;
  data: RoomAvailabilityHotel[];
  pageCount: number;
}

export interface RoomAvailabilityPageProps {
  searchParams: Promise<SearchParams>;
}
