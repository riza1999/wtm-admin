import BookingManagementTable from "@/components/dashboard/booking-management/booking-summary/table/booking-summary-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import React from "react";
import { getData } from "./fetch";
import { BookingSummaryPageProps } from "./types";
import { getCompanyOptions } from "@/server/general";

const BookingSummaryPage = async (props: BookingSummaryPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getData({
      searchParams,
    }),
    getCompanyOptions(),
  ]);

  return (
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
  );
};

export default BookingSummaryPage;
