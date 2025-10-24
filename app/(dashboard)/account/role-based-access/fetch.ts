import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { SearchParams } from "@/types";
import {
  Action,
  GetRoleAccessResponse,
  RoleAccessData,
  RoleBasedAccessTableResponse,
} from "./types";
// Transform the backend response to match the existing table structure
function transformRoleAccessData(
  data: GetRoleAccessResponse["data"]
): RoleBasedAccessTableResponse {
  // Define the pages/modules we want to display
  const pages = [
    { id: "account", name: "Account" },
    { id: "booking", name: "Booking" },
    { id: "hotel", name: "Hotel" },
    { id: "promo", name: "Promo" },
    { id: "promo-group", name: "Promo Group" },
    { id: "report", name: "Report" },
  ];

  // Define the actions
  const actions: Action[] = ["View", "Create", "Edit", "Delete"]; // Changed back to correct values

  // Transform the data
  const transformedData = pages.map((page, pageIndex) => {
    return {
      id: page.id,
      name: page.name,
      actions: actions.map((action) => {
        // Get permissions for each role
        const adminRole = data.find((item) => item.role === "Admin");
        const agentRole = data.find((item) => item.role === "Agent");
        const supportRole = data.find((item) => item.role === "Support");

        let adminPermission = false;
        let agentPermission = false;
        let supportPermission = false;

        if (
          adminRole &&
          adminRole.access[page.id as keyof typeof adminRole.access]
        ) {
          const accessControl =
            adminRole.access[page.id as keyof typeof adminRole.access];
          switch (action) {
            case "View":
              adminPermission = accessControl.read;
              break;
            case "Create":
              adminPermission = accessControl.create;
              break;
            case "Edit":
              adminPermission = accessControl.update;
              break;
            case "Delete":
              adminPermission = accessControl.delete;
              break;
            case "Confirmation":
              adminPermission = accessControl.update;
              break;
          }
        }

        if (
          agentRole &&
          agentRole.access[page.id as keyof typeof agentRole.access]
        ) {
          const accessControl =
            agentRole.access[page.id as keyof typeof agentRole.access];
          switch (action) {
            case "View":
              agentPermission = accessControl.read;
              break;
            case "Create":
              agentPermission = accessControl.create;
              break;
            case "Edit":
              agentPermission = accessControl.update;
              break;
            case "Delete":
              agentPermission = accessControl.delete;
              break;
            case "Confirmation":
              agentPermission = accessControl.update;
              break;
          }
        }

        if (
          supportRole &&
          supportRole.access[page.id as keyof typeof supportRole.access]
        ) {
          const accessControl =
            supportRole.access[page.id as keyof typeof supportRole.access];
          switch (action) {
            case "View":
              supportPermission = accessControl.read;
              break;
            case "Create":
              supportPermission = accessControl.create;
              break;
            case "Edit":
              supportPermission = accessControl.update;
              break;
            case "Delete":
              supportPermission = accessControl.delete;
              break;
            case "Confirmation":
              supportPermission = accessControl.update;
              break;
          }
        }

        const permissions: Record<"Admin" | "Agent" | "Support", boolean> = {
          Admin: adminPermission,
          Agent: agentPermission,
          Support: supportPermission,
        };

        return {
          action: action,
          permissions,
        };
      }),
    };
  });

  return {
    success: true,
    data: transformedData,
    pageCount: 1,
  };
}

export const getRoleBasedAccessData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<RoleBasedAccessTableResponse> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/role-access${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<RoleAccessData[]>(url);

  if (apiResponse.status !== 200) {
    return {
      success: false,
      data: [],
      pageCount: 1,
    };
  }

  return transformRoleAccessData(apiResponse.data);
};
