import SuperAdminTable from "@/components/dashboard/account/user-management/super-admin/table/super-admin-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "@/types";
import { Suspense } from "react";
import { SuperAdminPageProps, SuperAdminTableResponse } from "./types";

export const getSuperAdminData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<SuperAdminTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin",
      email: "kelvin@wtmdigital.com",
      phone: "081234567800",
      status: true,
    },
    {
      id: "2",
      name: "budi",
      email: "budi@wtmdigital.com",
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

const SuperAdminPage = async (props: SuperAdminPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getSuperAdminData({
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
      <SuperAdminTable promises={promises} />
    </Suspense>
  );
};

export default SuperAdminPage;
