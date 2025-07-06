import RoomAvailabilityTable from "@/components/dashboard/hotel-listing/room-availability/table/room-availability-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "@/types";
import React from "react";
import {
  RoomAvailabilityHotel,
  RoomAvailabilityPageProps,
  RoomAvailabilityTableResponse,
} from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<RoomAvailabilityTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Ibis Hotel & Convention",
      period: "June 2025",
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          availability: [
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
          ],
        },
        {
          id: "12",
          name: "Deluxe Room",
          availability: [
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            false,
            false,
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Atria Hotel",
      period: "June 2025",
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          availability: [
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
          ],
        },
      ],
    },
  ] as RoomAvailabilityHotel[];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

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
