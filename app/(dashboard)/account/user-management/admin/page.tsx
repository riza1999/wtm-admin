import AdminTable from "@/components/dashboard/account/user-management/admin/table/admin-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "@/types";
import { Suspense } from "react";
import { AdminPageProps, AdminTableResponse } from "./types";

export const getAdminData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<AdminTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "kelvin admin",
      email: "kelvin_admin@wtmdigital.com",
      phone: "081234567800",
      status: true,
    },
    {
      id: "2",
      name: "budi admin",
      email: "budi_admin@wtmdigital.com",
      phone: "081234567800",
      status: true,
    },
  ];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

const AdminPage = async (props: AdminPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getAdminData({
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
      <AdminTable promises={promises} />
    </Suspense>
  );
};

export default AdminPage;
