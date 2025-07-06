import AgentTable from "@/components/dashboard/account/user-management/agent/table/agent-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "@/types";
import { Suspense } from "react";
import { AgentPageProps, AgentTableResponse } from "./types";

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

const AgentPage = async (props: AgentPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getAgentData({
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
      <AgentTable promises={promises} />
    </Suspense>
  );
};

export default AgentPage;
