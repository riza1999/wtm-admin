import { SearchParams } from "nuqs";
import { ReportAgent, ReportAgentDetail, ReportSummary } from "./types";
import { ApiResponse } from "@/types";
import { buildQueryParams } from "@/lib/utils";
import { apiCall } from "@/lib/api";

export const getReportSummary = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<ReportSummary>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/reports/summary${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<ReportSummary>(url);

  return apiResponse;
};

export const getReportAgent = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<ReportAgent[]>> => {
  // return {
  //   data: [
  //     {
  //       agent_company: "Dummy Company",
  //       agent_name: "Dummy Agent",
  //       cancelled_booking: 1,
  //       confirmed_booking: 1,
  //       hotel_name: "Dummy Hotel",
  //     },
  //   ],
  //   message: "success",
  //   pagination: {
  //     limit: 10,
  //     page: 1,
  //     total: 1,
  //     total_pages: 1,
  //   },
  //   status: 200,
  // };

  const queryString = buildQueryParams(searchParams);
  const url = `/reports/agent${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<ReportAgent[]>(url);

  return apiResponse;
};

export const getReportAgentDetail = async (): Promise<
  ApiResponse<ReportAgentDetail[]>
> => {
  // return {
  //   data: [
  //     {
  //       additional: "dummy",
  //       capacity: "dummy",
  //       date_in: "2025-10-23T02:21:55+07:00",
  //       date_out: "2025-10-24T02:21:55+07:00",
  //       guest_name: "dummy",
  //       room_type: "dummy",
  //       status_booking: "dummy",
  //     },
  //   ],
  //   message: "dummy",
  //   pagination: {
  //     limit: 10,
  //     page: 1,
  //     total: 1,
  //     total_pages: 1,
  //   },
  //   status: 200,
  // };

  const searchParams: SearchParams = {
    limit: "10",
  };

  const queryString = buildQueryParams(searchParams);
  const url = `/reports/agent/detail${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<ReportAgentDetail[]>(url);

  return apiResponse;
};

export async function getCompanyOptions() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { label: "Esensi Digital", value: "esensi digital" },
    { label: "WTM Digital", value: "wtm digital" },
    { label: "Other Company", value: "other company" },
  ];
}

export async function getHotelOptions() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { label: "Grand Hotel Jakarta", value: "Grand Hotel Jakarta" },
    { label: "Hotel Indonesia", value: "hotel Indonesia" },
    { label: "Other Hotel", value: "other hotel" },
  ];
}
