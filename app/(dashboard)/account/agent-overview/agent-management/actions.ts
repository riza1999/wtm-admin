"use server";

import { CreateAgentSchema } from "@/components/dashboard/account/agent-overview/agent-management/dialog/create-agent-dialog";
import { EditAgentSchema } from "@/components/dashboard/account/agent-overview/agent-management/dialog/edit-agent-dialog";
import { ExportConfigs } from "@/lib/export-client";
import { ExportService } from "@/lib/export-service";
import {
  ExportColumn,
  ExportFormat,
  ExportResult,
  FilterFunction,
} from "@/lib/export-types";
import { SearchParams } from "@/types";
import { Agent } from "./types";

export async function updatePromoGroup(agentId: string, promo_group: string) {
  console.log("Update Agent Promo Group");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    message: `Agent Promo Group updated to ${promo_group}`,
  };
}

export async function deleteAgent(agentId: string) {
  console.log("Delete Agent");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Agent deleted` };
}

export async function createAgent(input: CreateAgentSchema) {
  console.log("Create Agent:");
  console.log({ input });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Agent created` };
}

export async function editAgent(input: EditAgentSchema & { id: string }) {
  console.log("Edit Agent:");
  console.log({ input });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Agent edited` };
}

// Define columns for export
const exportColumns: ExportColumn<Agent>[] = [
  {
    key: "id",
    header: "ID",
    accessor: (item) => item.id,
    width: 8,
  },
  {
    key: "name",
    header: "Name",
    accessor: (item) => item.name,
    width: 20,
  },
  {
    key: "company",
    header: "Company",
    accessor: (item) => item.company,
    width: 25,
  },
  {
    key: "promo_group",
    header: "Promo Group",
    accessor: (item) => item.promo_group,
    width: 15,
  },
  {
    key: "email",
    header: "Email",
    accessor: (item) => item.email,
    width: 30,
  },
  {
    key: "kakao_id",
    header: "Kakao ID",
    accessor: (item) => item.kakao_id,
    width: 15,
  },
  {
    key: "phone",
    header: "Phone",
    accessor: (item) => item.phone,
    width: 15,
  },
  {
    key: "status",
    header: "Status",
    accessor: (item) => item.status,
    formatter: (value) => (value ? "Active" : "Inactive"),
    width: 10,
  },
];

// Create filtering function
const createAgentFilter = (): FilterFunction<Agent> => {
  return ExportService.combineFilters(
    // Global search filter
    ExportService.createGlobalSearchFilter<Agent>([
      "name",
      "company",
      "email",
      "kakao_id",
      "phone",
    ]),
    // Filters
    ExportService.createMultiSelectFilter<Agent>("promo_group", "promo_group"),
    ExportService.createMultiSelectFilter<Agent>("company", "company"),
    // Custom status filter (boolean to string conversion)
    (data: Agent[], searchParams: SearchParams) => {
      if (!searchParams.status) return data;
      const statuses = Array.isArray(searchParams.status)
        ? searchParams.status
        : [searchParams.status];
      return data.filter((item) => statuses.includes(item.status.toString()));
    }
  );
};

// Get sample data (in real implementation, this would fetch from database)
function getSampleData(): Agent[] {
  return [
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
    {
      id: "3",
      name: "Budi",
      company: "ABC Travel",
      promo_group: "promo_a",
      email: "budi@abctravel.com",
      kakao_id: "budi_kakao",
      phone: "081234567803",
      status: true,
    },
    {
      id: "4",
      name: "Sari",
      company: "XYZ Tours",
      promo_group: "promo_c",
      email: "sari@xyztours.com",
      kakao_id: "sari_kakao",
      phone: "081234567804",
      status: true,
    },
    {
      id: "5",
      name: "Deni",
      company: "Travel Plus",
      promo_group: "promo_b",
      email: "deni@travelplus.com",
      kakao_id: "deni_kakao",
      phone: "081234567805",
      status: false,
    },
  ];
}

export async function exportAgent(
  searchParams: SearchParams,
  format: ExportFormat = "csv"
): Promise<ExportResult> {
  try {
    // Log export attempt for debugging
    console.log("Export request:", { searchParams, format });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get data (in real implementation, this would fetch from database)
    const data = getSampleData();

    // Create filter function
    const filterFn = createAgentFilter();

    // Use the reusable export service
    return await ExportService.exportData(
      data,
      exportColumns,
      ExportConfigs.agentList,
      format,
      filterFn,
      searchParams
    );
  } catch (error) {
    console.error("Error exporting agent data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export data",
    };
  }
}
