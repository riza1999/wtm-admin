import BannerTable from "@/components/dashboard/banner/table/banner-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import React from "react";
import { getData } from "./fetch";
import { BannerPageProps } from "./types";

const BannerPage = async (props: BannerPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getData({
      searchParams,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Banner Management</h1>
      </div>

      <div className="w-full">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                "10rem",
                "15rem",
                "20rem",
                "8rem",
                "12rem",
                "12rem",
                "6rem",
              ]}
            />
          }
        >
          <BannerTable promises={promises} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default BannerPage;
