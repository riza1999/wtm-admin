import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { BookingSummary } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<BookingSummary[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/bookings${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<BookingSummary[]>(url);

  return apiResponse;
};
