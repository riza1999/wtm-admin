import { PromoGroup } from "@/app/(dashboard)/promo-group/types";
import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { Agent } from "./types";

export const getAgentData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<Agent[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/users?role=agent${queryString ? `&${queryString}` : ""}`;
  const apiResponse = await apiCall<Agent[]>(url);

  return apiResponse;
};

export const getPromoGroupSelect = async (): Promise<
  ApiResponse<PromoGroup[]>
> => {
  const url = `/promo-groups?limit=9999`;
  const apiResponse = await apiCall<PromoGroup[]>(url);

  return apiResponse;
};
