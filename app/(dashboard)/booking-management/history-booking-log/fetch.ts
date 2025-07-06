import { SearchParams } from "@/types";
import { Option } from "@/types/data-table";
import { HistoryBookingLog, HistoryBookingLogTableResponse } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<HistoryBookingLogTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      booking_id: "BK-001",
      confirm_date: "2024-01-15T10:30:00Z",
      agent_name: "Agent Smith",
      booking_status: "confirmed",
      payment_status: "paid",
      date_in: "2024-02-01T14:00:00Z",
      date_out: "2024-02-03T12:00:00Z",
      hotel_name: "Grand Hotel Jakarta",
      room_type: "Deluxe Room",
      room_night: 2,
      capacity: "2 Adults",
    },
    {
      booking_id: "BK-002",
      confirm_date: "2024-01-16T09:15:00Z",
      agent_name: "Agent Jane",
      booking_status: "in review",
      payment_status: "unpaid",
      date_in: "2024-02-05T15:00:00Z",
      date_out: "2024-02-07T11:00:00Z",
      hotel_name: "Mercure Hotel Bandung",
      room_type: "Superior Room",
      room_night: 2,
      capacity: "1 Adult, 1 Child",
    },
    {
      booking_id: "BK-003",
      confirm_date: "2024-01-17T14:45:00Z",
      agent_name: "Agent Mike",
      booking_status: "rejected",
      payment_status: "unpaid",
      date_in: "2024-02-10T16:00:00Z",
      date_out: "2024-02-12T10:00:00Z",
      hotel_name: "Novotel Surabaya",
      room_type: "Executive Suite",
      room_night: 2,
      capacity: "2 Adults, 1 Child",
    },
  ] as HistoryBookingLog[];

  return {
    success: true,
    data,
    pageCount: 3,
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
