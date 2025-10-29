import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { PromoGroup, PromoGroupMembers, PromoGroupPromos } from "./types";

export const getPromoGroups = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<PromoGroup[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/promo-groups${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<PromoGroup[]>(url);

  return apiResponse;
};

// Retrieve a paginated list of promos that belong to a specific promo group using query parameters.
export const getPromoGroupPromosById = async (
  id: string,
  searchParams: SearchParams
): Promise<ApiResponse<PromoGroupPromos[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/promo-groups/${id}${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<PromoGroupPromos[]>(url);

  return apiResponse;
};

export const getCompanyOptions = async () => {
  const url = `/users/agent-companies?limit=0`;
  const apiResponse = await apiCall<{ id: number; name: string }[]>(url);

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((company) => ({
      label: company.name,
      value: company.id.toString(),
    }));
  }

  return [];
};

export const getAgentByCompanyId = async (id: string) => {
  return [
    {
      label: "test dummy",
      value: "1",
    },
  ];

  const url = `/users/by-agent-company/${id}`;
  const apiResponse = await apiCall<{ id: number; name: string }[]>(url);

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((agent) => ({
      label: agent.name,
      value: agent.id.toString(),
    }));
  }

  return [];
};

// Return Member[] optionally filtered by company label
export const getPromoGroupMembersById = async (
  searchParams: SearchParams
): Promise<ApiResponse<PromoGroupMembers[]>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/promo-groups/members${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<PromoGroupMembers[]>(url);

  return apiResponse;
};

// Search promos with query (for AsyncSelect)
export const searchPromos = async (
  query?: string
): Promise<ApiResponse<PromoGroupPromos[]>> => {
  const queryString = buildQueryParams({
    search: query,
  });
  const url = `/promos${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<PromoGroupPromos[]>(url);

  return apiResponse;
};
