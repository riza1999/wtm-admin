import { SearchParams } from "nuqs";
import { Report, ReportTableResponse } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReportTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin",
      company: "esensi digital",
      email: "kelvin@wtmdigital.com",
      hotel_name: "Grand Hotel Jakarta",
      status: "approved",
      bookings: [
        {
          guest_name: "John Doe",
          room_type: "Deluxe Room",
          date_in: "2024-01-15T00:00:00.000Z",
          date_out: "2024-01-18T00:00:00.000Z",
          capacity: "2 Adults, 1 Child",
          additional: "Extra bed requested",
        },
        {
          guest_name: "Jane Smith",
          room_type: "Suite",
          date_in: "2024-01-20T00:00:00.000Z",
          date_out: "2024-01-22T00:00:00.000Z",
          capacity: "1 Adult",
          additional: "Late check-in",
        },
      ],
    },
    {
      id: "2",
      name: "budi",
      company: "esensi digital",
      email: "budi@wtmdigital.com",
      hotel_name: "Hotel Indonesia",
      status: "rejected",
      bookings: [
        {
          guest_name: "Mike Johnson",
          room_type: "Standard Room",
          date_in: "2024-01-25T00:00:00.000Z",
          date_out: "2024-01-27T00:00:00.000Z",
          capacity: "2 Adults",
          additional: "Airport transfer needed",
        },
      ],
    },
  ] as Report[];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

export async function getCompanyOptions() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { label: "Esensi Digital", value: "esensi digital" },
    { label: "WTM Digital", value: "wtm digital" },
    { label: "Other Company", value: "other company" },
  ];
}

export async function getHotelOptions() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { label: "Grand Hotel Jakarta", value: "Grand Hotel Jakarta" },
    { label: "Hotel Indonesia", value: "hotel Indonesia" },
    { label: "Other Hotel", value: "other hotel" },
  ];
}
