import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { HistoryBookingLog } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HistoryBookingLog[]>> => {
  return {
    status: 200,
    message: "Success",
    data: [
      {
        agent_name: "string",
        booking_code: "string",
        booking_status: "confirmed",
        capacity: "string",
        check_in_date: "2024-01-01T00:00:00Z",
        check_out_date: "2024-01-02T00:00:00Z",
        confirm_date: "2024-01-03T00:00:00Z",
        hotel_name: "string",
        payment_status: "paid",
        room_nights: 0,
        room_type_name: "string",
      },
    ],
  };

  const queryString = buildQueryParams(searchParams);
  const url = `/bookings/logs${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HistoryBookingLog[]>(url);

  return apiResponse;
};
