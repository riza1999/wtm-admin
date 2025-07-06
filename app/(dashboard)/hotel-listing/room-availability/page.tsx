import RoomAvailabilityTable from "@/components/dashboard/hotel-listing/room-availability/table/room-availability-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import React from "react";
import { getData } from "./fetch";
import { RoomAvailabilityPageProps } from "./types";

const HotelPage = async (props: RoomAvailabilityPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getData({
      searchParams,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Room Availability</h1>
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
          <RoomAvailabilityTable promises={promises} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default HotelPage;
