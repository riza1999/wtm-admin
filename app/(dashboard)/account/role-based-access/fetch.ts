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
        const supportRole = data.find((item) => item.role === "Support");

        let adminPermission = false;
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

        const permissions: Record<"Admin" | "Support", boolean> = {
          Admin: adminPermission,
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
