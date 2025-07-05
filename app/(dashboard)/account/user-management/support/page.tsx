import SupportTable from "@/components/dashboard/account/user-management/support/table/support-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "@/types";
import { Suspense } from "react";
import { SupportPageProps, SupportTableResponse } from "./types";

export const getSupportData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<SupportTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin support",
      email: "kelvin_support@wtmdigital.com",
      phone: "081234567800",
      status: false,
    },
    {
      id: "2",
      name: "budi support",
      email: "budi_support@wtmdigital.com",
      phone: "081234567800",
      status: false,
    },
  ];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

const SupportPage = async (props: SupportPageProps) => {
  const searchParams = await props.searchParams;

  const promisesSupport = Promise.all([
    getSupportData({
      searchParams,
    }),
  ]);

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          columnCount={6}
          filterCount={1}
          cellWidths={["6rem", "10rem", "30rem", "10rem", "6rem", "6rem"]}
        />
      }
    >
      <SupportTable promises={promisesSupport} />
    </Suspense>
  );
};

export default SupportPage;
