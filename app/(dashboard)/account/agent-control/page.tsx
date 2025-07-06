import AgentControlTable from "@/components/dashboard/account/agent-control/table/agent-control-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import React from "react";
import { getCompanyOptions, getData } from "./fetch";
import { AgentControlPageProps } from "./types";

const AgentControlPage = async (props: AgentControlPageProps) => {
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
        <h1 className="text-3xl font-bold">Agent Control</h1>
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
          <AgentControlTable promises={promises} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default AgentControlPage;
