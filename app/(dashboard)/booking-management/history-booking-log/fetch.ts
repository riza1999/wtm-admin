import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { HistoryBookingLog } from "./types";

/**
 * Helper function to process date range parameters
 * Splits comma-separated date strings into from/to parameters
 */
function processDateRangeParam(
  query: SearchParams,
  paramName: string,
  fromParamName: string,
  toParamName: string
): SearchParams {
  const dateValue = query[paramName];

  if (dateValue && !Array.isArray(dateValue)) {
    const [dateFrom, dateTo] = dateValue.split(",");

    // Create new query with split date range
    const { [paramName]: _, ...rest } = query;
    return {
      ...rest,
      [fromParamName]: dateFrom,
      [toParamName]: dateTo,
    };
  }

  // Remove the parameter if it exists but is not valid
  const { [paramName]: _, ...rest } = query;
  return rest;
}

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HistoryBookingLog[]>> => {
  // Process date range parameters
  let query = processDateRangeParam(
    searchParams,
    "confirm_date",
    "confirm_date_from",
    "confirm_date_to"
  );

  query = processDateRangeParam(
    query,
    "check_in_date",
    "check_in_date_from",
    "check_in_date_to"
  );

  query = processDateRangeParam(
    query,
    "check_out_date",
    "check_out_date_from",
    "check_out_date_to"
  );

  // Set default limit to 10 if not provided
  if (!query.limit) {
    query = {
      ...query,
      limit: "10",
    };
  }

  const queryString = buildQueryParams(query);

  const url = `/bookings/logs${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HistoryBookingLog[]>(url);

  return apiResponse;
};
