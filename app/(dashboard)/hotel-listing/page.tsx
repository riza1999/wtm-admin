import HotelTable from "@/components/dashboard/hotel-listing/table/hotel-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParams } from "@/types";
import { Option } from "@/types/data-table";
import Link from "next/link";
import React from "react";
import { Hotel, HotelPageProps, HotelTableResponse } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<HotelTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Ibis Hotel & Convention",
      region: "Jakarta",
      email: "ibis@wtmdigital.com",
      approval_status: "approved",
      api_status: true,
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          description: "with breakfast",
          normal_price: 100000,
          discount_price: 80000,
        },
        {
          id: "12",
          name: "Deluxe Room",
          description: "without breakfast",
          normal_price: 100000,
          discount_price: 80000,
        },
      ],
    },
    {
      id: "2",
      name: "Atria Hotel",
      region: "Bali",
      email: "atria@wtmdigital.com",
      approval_status: "approved",
      api_status: false,
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          description: "Superior Room description",
          normal_price: 100000,
          discount_price: 80000,
        },
      ],
    },
  ] as Hotel[];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

export const getRegionOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      label: "Jakarta",
      value: "1",
    },
    {
      label: "Bali",
      value: "2",
    },
    {
      label: "Surabaya",
      value: "3",
    },
  ] as Option[];

  return data;
};

const HotelPage = async (props: HotelPageProps) => {
  const searchParams = await props.searchParams;
  const activeTab =
    typeof searchParams.tab === "string" ? searchParams.tab : "all";

  const promises = Promise.all([
    getData({
      searchParams,
    }),
    getRegionOptions(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hotel Listing</h1>
      </div>

      <Tabs defaultValue="all" className="w-[400px]">
        <TabsList>
          <Link href={"?tab=all"} scroll={false}>
            <TabsTrigger value="all">All</TabsTrigger>
          </Link>
          <Link href={"?tab=approved"} scroll={false}>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </Link>
          <Link href={"?tab=in_review"} scroll={false}>
            <TabsTrigger value="in_review">In Review</TabsTrigger>
          </Link>
          <Link href={"?tab=rejected"} scroll={false}>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      <div className="w-full">
        <React.Suspense
          key={activeTab}
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
          <HotelTable promises={promises} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default HotelPage;
