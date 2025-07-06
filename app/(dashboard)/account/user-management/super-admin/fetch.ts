import { SearchParams } from "@/types";
import { SuperAdminTableResponse } from "./types";

export const getSuperAdminData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<SuperAdminTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin",
      email: "kelvin@wtmdigital.com",
      phone: "081234567800",
      status: true,
    },
    {
      id: "2",
      name: "budi",
      email: "budi@wtmdigital.com",
      phone: "081234567800",
      status: false,
    },
  ];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};
