import { SearchParams } from "@/types";
import { SupportTableResponse } from "./types";

export const getSupportData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<SupportTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin support",
      email: "kelvin_support@wtmdigital.com",
      phone: "081234567800",
      status: false,
    },
    {
      id: "2",
      name: "budi support",
      email: "budi_support@wtmdigital.com",
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
