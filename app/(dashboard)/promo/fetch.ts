import { Option } from "@/types/data-table";
import { Promo, PromoTableResponse } from "./types";

import { SearchParams } from "@/types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<PromoTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Summer Sale Promo",
      type: "discount" as const,
      discount_percentage: 25,
      code: "SUMMER2024",
      description: "Get 25% off on all summer bookings at selected hotels",
      start_date: "2024-06-01T00:00:00.000Z",
      end_date: "2024-06-30T23:59:59.000Z",
      hotel_name: "ibis_hotel_convention",
      room_type: "superior_room",
      bed_type: "queen_size",
      nights: 3,
      status: true,
    },
    {
      id: "2",
      name: "Winter Fixed Price Promo",
      type: "fixed_price" as const,
      price_discount: 500000,
      code: "WINTER2024",
      description: "Fixed IDR 500,000 discount for winter getaway packages",
      start_date: "2024-12-01T00:00:00.000Z",
      end_date: "2025-01-15T23:59:59.000Z",
      hotel_name: "atria_hotel",
      room_type: "deluxe_room",
      bed_type: "king_size",
      nights: 2,
      status: false,
    },
    {
      id: "3",
      name: "Spring Room Upgrade Promo",
      type: "room_upgrade" as const,
      room_upgrade_to: "executive_suite",
      code: "SPRING2024",
      description:
        "Complimentary room upgrade to Executive Suite for spring bookings",
      start_date: "2024-03-01T00:00:00.000Z",
      end_date: "2024-03-20T23:59:59.000Z",
      hotel_name: "grand_hyatt_jakarta",
      room_type: "standard_room",
      bed_type: "double_bed",
      nights: 1,
      status: true,
    },
    {
      id: "4",
      name: "Holiday Benefits Package",
      type: "benefits" as const,
      benefits: "Free breakfast, spa voucher, and airport transfer",
      code: "HOLIDAY2024",
      description:
        "Special holiday package with exclusive benefits and amenities",
      start_date: "2024-12-20T00:00:00.000Z",
      end_date: "2025-01-05T23:59:59.000Z",
      hotel_name: "ritz_carlton_jakarta",
      room_type: "presidential_suite",
      bed_type: "2_king_size",
      nights: 4,
      status: true,
    },
    {
      id: "5",
      name: "Weekend Getaway Discount",
      type: "discount" as const,
      discount_percentage: 15,
      code: "WEEKEND15",
      description: "15% discount for weekend stays at family-friendly hotels",
      start_date: "2024-09-01T00:00:00.000Z",
      end_date: "2024-11-30T23:59:59.000Z",
      hotel_name: "hotel_indonesia_kempinski",
      room_type: "family_room",
      bed_type: "twin_bed",
      nights: 2,
      status: true,
    },
  ] as Promo[];

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
