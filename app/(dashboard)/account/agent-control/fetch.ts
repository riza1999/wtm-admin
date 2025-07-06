import { Option } from "@/types/data-table";
import { AgentControl, AgentControlTableResponse } from "./types";

import { SearchParams } from "@/types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<AgentControlTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin",
      company: "esensi digital",
      email: "kelvin@wtmdigital.com",
      phone_number: "081234567800",
      status: "approved",
    },
    {
      id: "2",
      name: "budi",
      company: "esensi digital",
      email: "budi@wtmdigital.com",
      phone_number: "081234567800",
      status: "rejected",
    },
  ] as AgentControl[];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

export const getCompanyOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data = [
    {
      label: "Esensi Digital",
      value: "1",
    },
    {
      label: "Vevo",
      value: "2",
    },
    {
      label: "88 Rising",
      value: "3",
    },
  ] as Option[];

  return data;
};
