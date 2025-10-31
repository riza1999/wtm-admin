"use server";

import { apiCall } from "@/lib/api";

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
