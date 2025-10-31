import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse } from "@/types";
import { format } from "date-fns";
import { SearchParams } from "nuqs";
import { ReportAgent, ReportAgentDetail, ReportSummary } from "./types";

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
  // Extract and parse date range
  // Ensure period_date exists and is a string
  const periodDate = searchParams.period_date;
  let query = searchParams;

  if (periodDate && !Array.isArray(periodDate)) {
    const [dateFrom, dateTo] = periodDate.split(",");

    // Convert timestamps to formatted dates and prepare final query params
    const formattedQuery = {
      ...searchParams,
      date_from: format(new Date(parseInt(dateFrom)), "yyyy-MM-dd"),
      date_to: format(new Date(parseInt(dateTo)), "yyyy-MM-dd"),
    } as SearchParams;

    // Remove the original period_date parameter
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { period_date, ...rest } = formattedQuery;
    query = rest;
  } else {
    // If no period_date, remove it from query if it exists
    const { period_date, ...rest } = searchParams;
    query = rest as SearchParams;
  }

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

  const queryString = buildQueryParams(query);
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
