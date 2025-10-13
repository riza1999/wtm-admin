import { SearchParams, ApiResponse } from "@/types";
import { SuperAdmin } from "./types";
import { apiCall, buildQueryParams } from "@/lib/utils";

export const getSuperAdminData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<SuperAdmin[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/users/by-role/super_admin${
    queryString ? `?${queryString}` : ""
  }`;
  const apiResponse = await apiCall<SuperAdmin[]>(url);

  return apiResponse;
};
