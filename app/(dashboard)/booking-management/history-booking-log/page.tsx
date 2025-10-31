import HistoryBookingLogTable from "@/components/dashboard/booking-management/history-booking-log/table/history-booking-log-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getCompanyOptions } from "@/server/general";
import React from "react";
import { getData } from "./fetch";
import { HistoryBookingLogPageProps } from "./types";

const HistoryBookingLogPage = async (props: HistoryBookingLogPageProps) => {
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
          columnCount={12}
          filterCount={4}
          cellWidths={[
            "10rem",
            "12rem",
            "15rem",
            "10rem",
            "10rem",
            "12rem",
            "12rem",
            "20rem",
            "12rem",
            "8rem",
            "10rem",
            "6rem",
          ]}
        />
      }
    >
      <HistoryBookingLogTable promises={promises} />
    </React.Suspense>
  );
};

export default HistoryBookingLogPage;
