import AgentTable from "@/components/dashboard/account/user-management/agent/table/agent-table";
import SuperAdminTable from "@/components/dashboard/account/user-management/super-admin/table/super-admin-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParams } from "@/types";
import { Suspense } from "react";
import { AgentTableResponse } from "./agent/types";
import { SuperAdminTableResponse } from "./super-admin/types";
import { UserManagementPageProps } from "./types";

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

export const getAgentData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<AgentTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Riza",
      company: "WTM Digital",
      promo_group: "promo_a",
      email: "riza@wtmdigital.com",
      kakao_id: "riza_kakao",
      phone: "081234567801",
      status: true,
    },
    {
      id: "2",
      name: "Andi",
      company: "WTM Digital",
      promo_group: "promo_b",
      email: "andi@wtmdigital.com",
      kakao_id: "andi_kakao",
      phone: "081234567802",
      status: false,
    },
  ];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};

const UserManagementPage = async (props: UserManagementPageProps) => {
  const searchParams = await props.searchParams;

  const promisesSuperAdmin = Promise.all([
    getSuperAdminData({
      searchParams,
    }),
  ]);

  const promisesAgent = Promise.all([
    getAgentData({
      searchParams,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <Tabs
        defaultValue="super_admin"
        className="w-full flex-col justify-start gap-6"
      >
        <TabsList>
          <TabsTrigger value="super_admin">Super Admin</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        <TabsContent value="super_admin">
          <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={6}
                filterCount={1}
                cellWidths={["6rem", "10rem", "30rem", "10rem", "6rem", "6rem"]}
              />
            }
          >
            <SuperAdminTable promises={promisesSuperAdmin} />
          </Suspense>
        </TabsContent>
        <TabsContent value="agent">
          <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={6}
                filterCount={1}
                cellWidths={["6rem", "10rem", "30rem", "10rem", "6rem", "6rem"]}
              />
            }
          >
            <AgentTable promises={promisesAgent} />
          </Suspense>
        </TabsContent>
        <TabsContent value="admin">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed justify-center flex items-center text-xl">
            Table Admin
          </div>
        </TabsContent>
        <TabsContent value="support">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed justify-center flex items-center text-xl">
            Table Support
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
