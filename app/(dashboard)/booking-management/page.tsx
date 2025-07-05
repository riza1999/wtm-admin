import BookingManagementTable from "@/components/dashboard/booking-management/booking-summary/table/booking-summary-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "@/types";
import { Option } from "@/types/data-table";
import React from "react";
import {
  BookingSummary,
  BookingSummaryTableResponse,
} from "./booking-summary/types";
import { BookingManagementPageProps } from "./types";

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

const BookingManagementPage = async (props: BookingManagementPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getData({
      searchParams,
    }),
    getCompanyOptions(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Management</h1>
      </div>

      <div className="w-full">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                "10rem",
                "30rem",
                "10rem",
                "10rem",
                "6rem",
                "6rem",
                "6rem",
              ]}
            />
          }
        >
          <BookingManagementTable promises={promises} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default BookingManagementPage;
