# RBAC Integration Examples

This document shows practical examples of integrating the RBAC system into existing components in the wtm-admin application.

## Example 1: Protecting a Table with Action Buttons

### Before (No Permissions)

```tsx
// components/dashboard/hotel-listing/table/hotel-columns.tsx
{
  id: "actions",
  cell: function Cell({ row }) {
    const router = useRouter();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/hotel-listing/${row.original.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRowAction({ row: row.original, type: "delete" })}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
}
```

### After (With Permissions)

```tsx
"use client";

import { useResourcePermissions } from "@/hooks/use-permissions";

interface GetHotelTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Hotel> | null>
  >;
  companyOptions: Option[];
  // Add permissions from the parent component
  canUpdate: boolean;
  canDelete: boolean;
}

export function getHotelTableColumns({
  setRowAction,
  companyOptions,
  canUpdate,
  canDelete,
}: GetHotelTableColumnsProps): ColumnDef<Hotel>[] {
  return [
    // ... other columns
    {
      id: "actions",
      cell: function Cell({ row }) {
        const router = useRouter();

        // Don't show menu if user has no permissions
        if (!canUpdate && !canDelete) {
          return null;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/hotel-listing/${row.original.id}/edit`)
                  }
                >
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <>
                  {canUpdate && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() =>
                      setRowAction({ row: row.original, type: "delete" })
                    }
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
      enableSorting: false,
    },
  ];
}

// In the parent component that uses this:
function HotelTable() {
  const hotelPerms = useResourcePermissions("hotel");

  const columns = getHotelTableColumns({
    setRowAction,
    companyOptions,
    canUpdate: hotelPerms.canUpdate,
    canDelete: hotelPerms.canDelete,
  });

  return <DataTable columns={columns} data={data} />;
}
```

## Example 2: Protecting a Page with Server Component

### Before

```tsx
// app/(dashboard)/hotel-listing/page.tsx
import { HotelTable } from "@/components/dashboard/hotel-listing/table/hotel-table";
import { getHotels } from "./fetch";

export default async function HotelListingPage() {
  const hotels = await getHotels();

  return (
    <div>
      <h1>Hotel Listing</h1>
      <HotelTable data={hotels} />
    </div>
  );
}
```

### After

```tsx
// app/(dashboard)/hotel-listing/page.tsx
import { HotelTable } from "@/components/dashboard/hotel-listing/table/hotel-table";
import { getHotels } from "./fetch";
import {
  verifyPermissionOrRedirect,
  getCurrentUser,
} from "@/server/permissions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Can } from "@/components/permissions/can";

export default async function HotelListingPage() {
  // Verify user has read permission
  await verifyPermissionOrRedirect("hotel:read");

  const [hotels, user] = await Promise.all([getHotels(), getCurrentUser()]);

  // Check if user can create
  const canCreate = user?.permissions?.includes("hotel:create") ?? false;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hotel Listing</h1>
          <p className="text-muted-foreground">Manage your hotel properties</p>
        </div>

        {/* Show create button only if user has permission */}
        {canCreate && (
          <Button asChild>
            <Link href="/hotel-listing/create">Create Hotel</Link>
          </Button>
        )}
      </div>

      <HotelTable data={hotels} />
    </div>
  );
}
```

## Example 3: Protecting Server Actions

### Before

```tsx
// app/(dashboard)/hotel-listing/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function updateHotelStatus(formData: FormData) {
  const hotelId = formData.get("hotel_id") as string;
  const status = formData.get("status") === "true";

  // Update hotel status
  const response = await fetch(`/api/hotels/${hotelId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    return { success: false, message: "Failed to update" };
  }

  revalidatePath("/hotel-listing");
  return { success: true, message: "Status updated" };
}
```

### After

```tsx
// app/(dashboard)/hotel-listing/actions.ts
"use server";

import { requirePermission } from "@/server/permissions";
import { revalidatePath } from "next/cache";

export async function updateHotelStatus(formData: FormData) {
  // Verify permission before executing
  try {
    await requirePermission("hotel:update");
  } catch (error) {
    return {
      success: false,
      message: "You don't have permission to update hotels",
    };
  }

  const hotelId = formData.get("hotel_id") as string;
  const status = formData.get("status") === "true";

  // Update hotel status
  const response = await fetch(`/api/hotels/${hotelId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    return { success: false, message: "Failed to update" };
  }

  revalidatePath("/hotel-listing");
  return { success: true, message: "Status updated" };
}

export async function deleteHotel(hotelId: string) {
  // Verify delete permission
  try {
    await requirePermission("hotel:delete");
  } catch (error) {
    return {
      success: false,
      message: "You don't have permission to delete hotels",
    };
  }

  // Delete logic...
  return { success: true, message: "Hotel deleted" };
}
```

## Example 4: Protecting Client Components

### Before

```tsx
// components/dashboard/hotel-listing/create/hotel-create-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

export function HotelCreateForm() {
  return (
    <Form>
      {/* Form fields */}
      <Button type="submit">Create Hotel</Button>
    </Form>
  );
}
```

### After

```tsx
// components/dashboard/hotel-listing/create/hotel-create-form.tsx
"use client";

import { useHasPermission } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function HotelCreateForm() {
  const canCreate = useHasPermission("hotel:create");

  if (!canCreate) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to create hotels. Please contact your
          administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form>
      {/* Form fields */}
      <Button type="submit">Create Hotel</Button>
    </Form>
  );
}
```

## Example 5: Conditional UI Elements

### Before

```tsx
// components/dashboard/hotel-listing/hotel-card.tsx
export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{hotel.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{hotel.description}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={() => editHotel(hotel.id)}>Edit</Button>
        <Button variant="destructive" onClick={() => deleteHotel(hotel.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### After

```tsx
// components/dashboard/hotel-listing/hotel-card.tsx
"use client";

import { Can } from "@/components/permissions/can";
import { useResourcePermissions } from "@/hooks/use-permissions";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const hotelPerms = useResourcePermissions("hotel");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hotel.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{hotel.description}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Can permission="hotel:update">
          <Button onClick={() => editHotel(hotel.id)}>Edit</Button>
        </Can>

        <Can permission="hotel:delete">
          <Button variant="destructive" onClick={() => deleteHotel(hotel.id)}>
            Delete
          </Button>
        </Can>

        {/* Or using the hook */}
        {hotelPerms.canUpdate && (
          <Button onClick={() => editHotel(hotel.id)}>Edit</Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

## Example 6: Navigation Menu with Permissions

```tsx
// components/header/nav-dropdown.tsx
"use client";

import {
  useResourcePermissions,
  useHasPermission,
} from "@/hooks/use-permissions";
import Link from "next/link";

export function NavigationMenu() {
  const hotelPerms = useResourcePermissions("hotel");
  const promoPerms = useResourcePermissions("promo");
  const accountPerms = useResourcePermissions("account");
  const bookingPerms = useResourcePermissions("booking");

  return (
    <nav>
      {/* Only show menu items user has access to */}
      {hotelPerms.canRead && <Link href="/hotel-listing">Hotels</Link>}

      {promoPerms.canRead && <Link href="/promo">Promotions</Link>}

      {bookingPerms.canRead && (
        <Link href="/booking-management/booking-summary">Bookings</Link>
      )}

      {accountPerms.canRead && (
        <Link href="/account/user-management">Accounts</Link>
      )}
    </nav>
  );
}
```

## Example 7: Dynamic Form Fields Based on Permissions

```tsx
// components/dashboard/hotel-listing/hotel-form.tsx
"use client";

import { useResourcePermissions } from "@/hooks/use-permissions";

export function HotelForm({
  hotel,
  mode,
}: {
  hotel?: Hotel;
  mode: "create" | "edit";
}) {
  const hotelPerms = useResourcePermissions("hotel");
  const settingsPerms = useResourcePermissions("settings");

  const canEdit =
    mode === "create" ? hotelPerms.canCreate : hotelPerms.canUpdate;
  const canEditAdvanced = settingsPerms.canUpdate; // Advanced settings

  if (!canEdit) {
    return <AccessDenied />;
  }

  return (
    <Form>
      {/* Basic fields - everyone with create/update can see */}
      <FormField name="name" label="Hotel Name" />
      <FormField name="description" label="Description" />

      {/* Advanced fields - only for users with settings:update */}
      {canEditAdvanced && (
        <div className="border-t pt-4">
          <h3>Advanced Settings</h3>
          <FormField name="api_key" label="API Key" />
          <FormField name="commission_rate" label="Commission Rate" />
        </div>
      )}

      <Button type="submit" disabled={!canEdit}>
        {mode === "create" ? "Create" : "Update"} Hotel
      </Button>
    </Form>
  );
}
```

## Example 8: Bulk Actions with Permissions

```tsx
// components/dashboard/hotel-listing/table/hotel-table-toolbar.tsx
"use client";

import { useResourcePermissions } from "@/hooks/use-permissions";
import { Table } from "@tanstack/react-table";

export function HotelTableToolbar({ table }: { table: Table<Hotel> }) {
  const hotelPerms = useResourcePermissions("hotel");
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Search, filters, etc. */}

      {/* Bulk actions - only show if user has permissions */}
      {hasSelection && (
        <div className="flex items-center gap-2">
          {hotelPerms.canUpdate && (
            <Button
              variant="outline"
              onClick={() => bulkUpdateStatus(selectedRows)}
            >
              Bulk Update ({selectedRows.length})
            </Button>
          )}

          {hotelPerms.canDelete && (
            <Button
              variant="destructive"
              onClick={() => bulkDelete(selectedRows)}
            >
              Delete Selected ({selectedRows.length})
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
```

## Example 9: Role-Based Dashboard

```tsx
// app/(dashboard)/page.tsx
import { getCurrentUser } from "@/server/permissions";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard";
import { ViewerDashboard } from "@/components/dashboard/viewer-dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Different dashboards based on role
  switch (user.role.toLowerCase()) {
    case "admin":
      return <AdminDashboard user={user} />;
    case "manager":
      return <ManagerDashboard user={user} />;
    default:
      return <ViewerDashboard user={user} />;
  }
}
```

## Example 10: Permission-Based Data Filtering

```tsx
// app/(dashboard)/report/fetch.ts
import { getCurrentUser } from "@/server/permissions";
import { bffFetch } from "@/lib/bff-client";

export async function getReports() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Filter data based on permissions
  const canViewAllReports = user.permissions.includes("report:read");
  const canViewOwnReports = user.permissions.includes("report:read-own");

  const url = canViewAllReports
    ? "/api/reports"
    : `/api/reports?user_id=${user.id}`;

  const response = await bffFetch(url);
  const data = await response.json();

  return data;
}
```

## Quick Migration Checklist

When adding permissions to an existing feature:

- [ ] Add route permissions to `types/permissions.ts`
- [ ] Add permission checks to page components (`verifyPermissionOrRedirect`)
- [ ] Add permission checks to server actions (`requirePermission`)
- [ ] Add permission checks to API routes (`guardApiRoute`)
- [ ] Wrap UI elements with `<Can>` components or use permission hooks
- [ ] Update table columns to respect permissions
- [ ] Update navigation menus to show/hide based on permissions
- [ ] Add permission checks to bulk actions
- [ ] Test with different user roles
- [ ] Update documentation if needed
