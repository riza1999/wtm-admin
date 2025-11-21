import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { SuperAdmin } from "./types";

export const getSuperAdminData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<SuperAdmin[]>> => {
  const params = {
    ...searchParams,
    limit: searchParams.limit ?? "10",
  };

  const queryString = buildQueryParams(params);
  const url = `/users?role=super_admin${queryString ? `&${queryString}` : ""}`;
  const apiResponse = await apiCall<SuperAdmin[]>(url);

  return apiResponse;
};
