import { SearchParams } from "@/types";
import { Option } from "@/types/data-table";
import { Hotel, HotelTableResponse } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<HotelTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Ibis Hotel & Convention",
      region: "Jakarta",
      email: "ibis@wtmdigital.com",
      approval_status: "approved",
      api_status: true,
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          description: "with breakfast",
          normal_price: 100000,
          discount_price: 80000,
        },
        {
          id: "12",
          name: "Deluxe Room",
          description: "without breakfast",
          normal_price: 100000,
          discount_price: 80000,
        },
      ],
    },
    {
      id: "2",
      name: "Atria Hotel",
      region: "Bali",
      email: "atria@wtmdigital.com",
      approval_status: "approved",
      api_status: false,
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          description: "Superior Room description",
          normal_price: 100000,
          discount_price: 80000,
        },
      ],
    },
  ] as Hotel[];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

export const getRegionOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      label: "Jakarta",
      value: "1",
    },
    {
      label: "Bali",
      value: "2",
    },
    {
      label: "Surabaya",
      value: "3",
    },
  ] as Option[];

  return data;
};
