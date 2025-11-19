export type Role = "Admin" | "Support";

export type Action = "View" | "Create" | "Edit" | "Delete" | "Confirmation";

export interface PageAction {
  action: Action;
  permissions: Record<Role, boolean>;
}

export interface RoleBasedAccessPageData {
  id: string;
  name: string;
  actions: PageAction[];
}

export interface RoleBasedAccessTableResponse {
  success: boolean;
  data: RoleBasedAccessPageData[];
  pageCount: number;
}

export interface AccessControl {
  create: boolean;
  delete: boolean;
  read: boolean;
  update: boolean;
}

export interface RoleAccess {
  account: AccessControl;
  booking: AccessControl;
  hotel: AccessControl;
  promo: AccessControl;
  ["promo-group"]: AccessControl;
  report: AccessControl;
}

export interface RoleAccessData {
  role: Role;
  access: RoleAccess;
}

export interface GetRoleAccessResponse {
  status: number;
  message: string;
  data: RoleAccessData[];
}
