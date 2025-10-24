"use server";

import { ApiResponse, SearchParams } from "@/types";
import { Hotel } from "../types";
import { buildQueryParams } from "@/lib/utils";
import { apiCall } from "@/lib/api";
import { RoomAvailabilityHotel } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<Hotel[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/hotels${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<Hotel[]>(url);

  return apiResponse;
};

export const getRoomAvaliableByHotelId = async ({
  hotel_id,
  period,
}: {
  hotel_id: string;
  period: string;
}): Promise<ApiResponse<RoomAvailabilityHotel[]>> => {
  const url = `/hotels/room-available?hotel_id=${hotel_id}&month=${period}`;
  const apiResponse = await apiCall<RoomAvailabilityHotel[]>(url);
  return apiResponse;
};
