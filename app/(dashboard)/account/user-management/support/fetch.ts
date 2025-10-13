import { ApiResponse, SearchParams } from "@/types";
import { Support } from "./types";
import { apiCall, buildQueryParams } from "@/lib/utils";

export const getSupportData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<Support[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/users/by-role/support${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<Support[]>(url);

  return apiResponse;
};
