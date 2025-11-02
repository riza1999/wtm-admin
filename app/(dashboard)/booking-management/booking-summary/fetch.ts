import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { BookingSummary } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<BookingSummary[]>> => {
  // return {
  //   status: 200,
  //   message: "Success",
  //   data: [
  //     {
  //       agent_company: "string",
  //       agent_name: "string",
  //       booking_code: "string",
  //       booking_id: 0,
  //       booking_status: "confirmed",
  //       detail: [
  //         {
  //           additional: ["string", "string2"],
  //           booking_status: "confirmed",
  //           cancelled_date: "2023-04-01T00:00:00.000Z",
  //           guest_name: "string",
  //           hotel_name: "string",
  //           is_api: false,
  //           payment_status: "paid",
  //           promo_code: "string",
  //           promo_id: 0,
  //           sub_booking_id: "string",
  //         },
  //       ],
  //       group_promo: "string",
  //       guest_name: ["string", "string2"],
  //       payment_status: "paid",
  //     },
  //   ],
  // };

  const queryString = buildQueryParams(searchParams);
  const url = `/bookings${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<BookingSummary[]>(url);

  return apiResponse;
};
