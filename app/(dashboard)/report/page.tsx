import { ChartAreaInteractive } from "@/components/dashboard/report/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/report/section-cards";
import ReportTable from "@/components/dashboard/report/table/report-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "nuqs";
import React from "react";
import { Report, ReportPageProps, ReportTableResponse } from "./types";

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

const ReportPage = async (props: ReportPageProps) => {
  const promises = Promise.all([
    getData({ searchParams: await props.searchParams }),
    getCompanyOptions(),
  ]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Report</h1>
      </div>
      <SectionCards />
      <ChartAreaInteractive />
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
        <ReportTable promises={promises} />
      </React.Suspense>
    </div>
  );
};

export default ReportPage;
