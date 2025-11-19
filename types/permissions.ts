/**
 * Permission system types
 *
 * Permissions follow the format: "resource:action"
 * Examples: "account:read", "hotel:update", "booking:delete"
 */

export type PermissionAction = "read" | "create" | "update" | "delete";

export type PermissionResource =
  | "account"
  | "hotel"
  | "promo"
  | "promo-group"
  | "report"
  | "booking"
  | "settings";

export type Permission = `${PermissionResource}:${PermissionAction}`;

export type Role = {
  id: number;
  name: string;
};

/**
 * Permission groups for easier management
 */
export const PERMISSION_GROUPS = {
  account: {
    label: "Account Management",
    permissions: [
      "account:read",
      "account:create",
      "account:update",
      "account:delete",
    ] as Permission[],
  },
  hotel: {
    label: "Hotel Listing",
    permissions: [
      "hotel:read",
      "hotel:create",
      "hotel:update",
      "hotel:delete",
    ] as Permission[],
  },
  promo: {
    label: "Promo Management",
    permissions: [
      "promo:read",
      "promo:create",
      "promo:update",
      "promo:delete",
    ] as Permission[],
  },
  "promo-group": {
    label: "Promo Group Management",
    permissions: [
      "promo-group:read",
      "promo-group:create",
      "promo-group:update",
      "promo-group:delete",
    ] as Permission[],
  },
  report: {
    label: "Reports",
    permissions: [
      "report:read",
      "report:create",
      "report:update",
      "report:delete",
    ] as Permission[],
  },
  booking: {
    label: "Booking Management",
    permissions: [
      "booking:read",
      "booking:create",
      "booking:update",
      "booking:delete",
    ] as Permission[],
  },
  settings: {
    label: "Settings",
    permissions: [
      "settings:read",
      "settings:create",
      "settings:update",
      "settings:delete",
    ] as Permission[],
  },
} as const;

/**
 * Route to permission mapping
 * Maps route patterns to required permissions
 */
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  // Account routes
  "/account/user-management/super-admin": ["account:read"],
  "/account/user-management/admin": ["account:read"],
  "/account/user-management/support": ["account:read"],
  "/account/role-based-access": ["account:read"],
  "/account/agent-overview/agent-management": ["account:read"],
  "/account/agent-overview/agent-control": ["account:read"],

  // Hotel routes
  "/hotel-listing": ["hotel:read"],
  "/hotel-listing/create": ["hotel:create"],
  "/hotel-listing/[id]/edit": ["hotel:update"],
  "/hotel-listing/room-availability": ["hotel:read"],

  // Promo routes
  "/promo": ["promo:read"],
  "/promo/create": ["promo:create"],
  "/promo/[id]/edit": ["promo:update"],

  // Promo Group routes
  "/promo-group": ["promo-group:read"],
  "/promo-group/create": ["promo-group:create"],
  "/promo-group/[id]/edit": ["promo-group:update"],

  // Report routes
  "/report": ["report:read"],

  // Booking routes
  "/booking-management/booking-summary": ["booking:read"],
  "/booking-management/history-booking-log": ["booking:read"],

  // Settings routes
  // "/settings/account-setting": ["settings:read"],
  // "/settings/email-log": ["settings:read"],
  // "/settings/email-setting": ["settings:update"],
};
