import { buildQueryParams } from "@/lib/utils";
import { AgentControl } from "./types";

import { apiCall } from "@/lib/api";
import { ApiResponse, SearchParams } from "@/types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<AgentControl[]>> => {
  const params = {
    ...searchParams,
    limit: searchParams.limit ?? "10",
  };

  const queryString = buildQueryParams(params);
  const url = `/users/control${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<AgentControl[]>(url);

  return apiResponse;
};
