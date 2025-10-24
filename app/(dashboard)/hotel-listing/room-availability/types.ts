import { SearchParams } from "@/types";

export interface RoomAvailability {
  available: boolean;
  day: number;
}

export interface RoomAvailabilityHotel {
  room_type_id: string;
  room_type_name: string;
  available: RoomAvailability[];
}

export interface RoomAvailabilityTableResponse {
  success: boolean;
  data: RoomAvailabilityHotel[];
  pageCount: number;
}

export interface RoomAvailabilityPageProps {
  searchParams: Promise<SearchParams>;
}
