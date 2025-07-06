import { SearchParams } from "@/types";
import { Option } from "@/types/data-table";
import { BookingSummary, BookingSummaryTableResponse } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<BookingSummaryTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      guest_name: "John Doe",
      agent_name: "Agent Smith",
      agent_company: "Esensi Digital",
      group_promo: "Promo Group A",
      booking_id: "BK-001",
      booking_status: "confirmed",
      payment_status: "paid",
      promo_id: "PR-001",
    },
    {
      id: "2",
      guest_name: "Jane Roe",
      agent_name: "Agent Jane",
      agent_company: "Vevo",
      group_promo: "Promo Group B",
      booking_id: "BK-002",
      booking_status: "in review",
      payment_status: "unpaid",
      promo_id: "PR-002",
    },
  ] as BookingSummary[];

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
