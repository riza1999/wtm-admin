import { SearchParams } from "@/types";
import { AdminTableResponse } from "./types";

export const getAdminData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<AdminTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin admin",
      email: "kelvin_admin@wtmdigital.com",
      phone: "081234567800",
      status: true,
    },
    {
      id: "2",
      name: "budi admin",
      email: "budi_admin@wtmdigital.com",
      phone: "081234567800",
      status: true,
    },
  ];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};
