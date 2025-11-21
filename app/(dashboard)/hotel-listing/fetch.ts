import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { Hotel, HotelDetail } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<Hotel[]>> => {
  const params = {
    ...searchParams,
    limit: searchParams.limit ?? "10",
  };

  const queryString = buildQueryParams(params);
  const url = `/hotels${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<Hotel[]>(url);

  return apiResponse;
};

export const getHotelDetails = async (id: string) => {
  const apiResponse = await apiCall<HotelDetail>(`/hotels/${id}`);
  return apiResponse;
};
