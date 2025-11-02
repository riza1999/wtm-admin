"use server";

import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { EmailLog } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<EmailLog[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/email/logs${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<EmailLog[]>(url);

  return apiResponse;
};
