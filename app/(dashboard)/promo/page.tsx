import PromoTable from "@/components/dashboard/promo/table/promo-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import React from "react";
import { getData } from "./fetch";
import { PromoPageProps } from "./types";
import { Can } from "@/components/permissions/can";

const PromoPage = async (props: PromoPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getData({
      searchParams,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promo Management</h1>
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
          <Can permission="promo:read">
            <PromoTable promises={promises} />
          </Can>
        </React.Suspense>
      </div>
    </div>
  );
};

export default PromoPage;
