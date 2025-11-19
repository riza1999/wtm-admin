# Role-Based Access Control (RBAC) - Usage Guide

This guide demonstrates how to use the RBAC system implemented in the wtm-admin application.

## Table of Contents

- [Overview](#overview)
- [Client-Side Usage](#client-side-usage)
- [Server-Side Usage](#server-side-usage)
- [API Route Protection](#api-route-protection)
- [Middleware Protection](#middleware-protection)
- [Best Practices](#best-practices)

## Overview

The RBAC system is built on top of NextAuth.js and provides:

- Type-safe permissions
- Client-side and server-side permission checking
- Route-level protection via middleware
- UI component visibility control
- API route guards

## Client-Side Usage

### 1. Using Permission Hooks

```tsx
"use client";

import {
  useHasPermission,
  useResourcePermissions,
} from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";

function HotelActions() {
  // Check single permission
  const canEdit = useHasPermission("hotel:update");
  const canDelete = useHasPermission("hotel:delete");

  // Check resource permissions
  const hotelPerms = useResourcePermissions("hotel");

  return (
    <div>
      {canEdit && <Button>Edit Hotel</Button>}
      {canDelete && <Button variant="destructive">Delete</Button>}

      {/* Using resource permissions */}
      {hotelPerms.canCreate && <Button>Create Hotel</Button>}
    </div>
  );
}
```

### 2. Using Permission Components

```tsx
"use client";

import { Can, Cannot } from "@/components/permissions/can";
import { Button } from "@/components/ui/button";

function HotelManagement() {
  return (
    <div>
      {/* Single permission */}
      <Can permission="hotel:update">
        <Button>Edit Hotel</Button>
      </Can>

      {/* Multiple permissions (ALL required) */}
      <Can allPermissions={["hotel:read", "hotel:update"]}>
        <HotelEditor />
      </Can>

      {/* Multiple permissions (ANY required) */}
      <Can anyPermissions={["hotel:read", "hotel:update"]}>
        <HotelViewer />
      </Can>

      {/* With fallback */}
      <Can permission="hotel:delete" fallback={<p>You cannot delete hotels</p>}>
        <Button variant="destructive">Delete</Button>
      </Can>

      {/* Inverse check */}
      <Cannot permission="hotel:delete">
        <p className="text-muted-foreground">
          You don't have permission to delete hotels
        </p>
      </Cannot>
    </div>
  );
}
```

### 3. Getting Current User Info

```tsx
"use client";

import {
  useCurrentUser,
  useRole,
  usePermissions,
} from "@/hooks/use-permissions";

function UserProfile() {
  const { user, isLoading } = useCurrentUser();
  const { role, isRole } = useRole();
  const { permissions } = usePermissions();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {role}</p>
      <p>Permissions: {permissions.join(", ")}</p>

      {isRole("Admin") && <AdminPanel />}
    </div>
  );
}
```

## Server-Side Usage

### 1. Server Components

```tsx
// app/(dashboard)/hotel-listing/page.tsx
import {
  verifyPermissionOrRedirect,
  getCurrentUser,
} from "@/server/permissions";

export default async function HotelListingPage() {
  // Redirect to access-denied if user doesn't have permission
  await verifyPermissionOrRedirect("hotel:read");

  // Or get user info
  const user = await getCurrentUser();

  return (
    <div>
      <h1>Hotel Listing</h1>
      <p>Viewing as: {user?.name}</p>
    </div>
  );
}
```

### 2. Server Actions

```tsx
// app/(dashboard)/hotel-listing/actions.ts
"use server";

import { requirePermission, checkPermission } from "@/server/permissions";

export async function updateHotel(id: string, data: HotelData) {
  // Throw error if permission not granted
  await requirePermission("hotel:update");

  // Or check without throwing
  const canUpdate = await checkPermission("hotel:update");
  if (!canUpdate) {
    return { success: false, error: "Insufficient permissions" };
  }

  // Proceed with update logic...
  return { success: true };
}

export async function deleteHotel(id: string) {
  await requirePermission("hotel:delete");

  // Delete logic...
  return { success: true };
}
```

### 3. API Routes

```tsx
// app/api/hotels/[id]/route.ts
import { guardApiRoute } from "@/server/permissions";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Guard the route - returns early if unauthorized
  const guard = await guardApiRoute("hotel:read");

  if (!guard.authorized) {
    return guard.response; // Returns 401 or 403 response
  }

  // Access session from guard
  const { session } = guard;

  // Your API logic here...
  return Response.json({ success: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await guardApiRoute("hotel:update");

  if (!guard.authorized) {
    return guard.response;
  }

  const body = await request.json();

  // Update logic...
  return Response.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await guardApiRoute("hotel:delete");

  if (!guard.authorized) {
    return guard.response;
  }

  // Delete logic...
  return Response.json({ success: true });
}
```

## Middleware Protection

Routes are automatically protected based on the `ROUTE_PERMISSIONS` mapping in `types/permissions.ts`.

### Adding Route Protection

```typescript
// types/permissions.ts
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  // Exact path
  "/hotel-listing": ["hotel:read"],

  // Dynamic route (use [id] placeholder)
  "/hotel-listing/[id]/edit": ["hotel:update"],

  // Multiple permissions (user needs ANY of them)
  "/dashboard": ["account:read", "hotel:read"],
};
```

The middleware will:

1. Check if the route requires permissions
2. Verify user has at least one required permission
3. Redirect to `/access-denied` if unauthorized

## Permission Utilities

### Core Utilities

```typescript
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasResourcePermission,
  canRead,
  canCreate,
  canUpdate,
  canDelete,
} from "@/lib/permissions";

const userPermissions = ["hotel:read", "hotel:update"];

// Check single permission
hasPermission(userPermissions, "hotel:read"); // true

// Check all permissions
hasAllPermissions(userPermissions, ["hotel:read", "hotel:update"]); // true

// Check any permission
hasAnyPermission(userPermissions, ["hotel:delete", "hotel:update"]); // true

// Check resource action
hasResourcePermission(userPermissions, "hotel", "update"); // true

// Convenience methods
canRead(userPermissions, "hotel"); // true
canCreate(userPermissions, "hotel"); // false
canUpdate(userPermissions, "hotel"); // true
canDelete(userPermissions, "hotel"); // false
```

## Best Practices

### 1. Always Validate on Server-Side

Never rely solely on client-side permission checks for security. Always validate permissions in:

- Server components
- Server actions
- API routes

```tsx
// ❌ Bad - Only client-side check
function DeleteButton() {
  const canDelete = useHasPermission("hotel:delete");

  return canDelete ? (
    <Button onClick={() => deleteHotel(id)}>Delete</Button>
  ) : null;
}

// ✅ Good - Both client and server checks
function DeleteButton() {
  const canDelete = useHasPermission("hotel:delete");

  const handleDelete = async () => {
    // Server action validates permission
    await deleteHotel(id);
  };

  return canDelete ? <Button onClick={handleDelete}>Delete</Button> : null;
}

// Server action
async function deleteHotel(id: string) {
  await requirePermission("hotel:delete"); // Server-side check
  // ... delete logic
}
```

### 2. Use Semantic Permission Names

Follow the `resource:action` pattern:

- `hotel:read` - View hotel listings
- `hotel:create` - Create new hotels
- `hotel:update` - Edit existing hotels
- `hotel:delete` - Delete hotels

### 3. Group Related UI Elements

```tsx
<Can permission="hotel:update">
  <div className="space-y-4">
    <EditForm />
    <SaveButton />
    <CancelButton />
  </div>
</Can>
```

### 4. Provide User Feedback

```tsx
<Can
  permission="hotel:delete"
  fallback={
    <Tooltip content="You don't have permission to delete hotels">
      <Button disabled>Delete</Button>
    </Tooltip>
  }
>
  <Button onClick={handleDelete}>Delete</Button>
</Can>
```

### 5. Cache Permission Checks in Components

The hooks use `useMemo` to cache results, but avoid calling them in loops:

```tsx
// ❌ Bad
hotels.map((hotel) => {
  const canEdit = useHasPermission("hotel:update"); // Called in loop
  return <HotelCard canEdit={canEdit} />;
});

// ✅ Good
const canEdit = useHasPermission("hotel:update"); // Called once
return hotels.map((hotel) => <HotelCard canEdit={canEdit} />);
```

### 6. Handle Loading States

```tsx
function ProtectedContent() {
  const { isLoading, isAuthenticated } = usePermissions();
  const canView = useHasPermission("hotel:read");

  if (isLoading) {
    return <Skeleton />;
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  if (!canView) {
    return <AccessDenied />;
  }

  return <HotelList />;
}
```

## Type Safety

All permissions are type-safe:

```typescript
import type { Permission } from "@/types/permissions";

// ✅ Valid permissions
const perm1: Permission = "hotel:read";
const perm2: Permission = "account:update";

// ❌ TypeScript error - invalid permission
const perm3: Permission = "invalid:permission";
const perm4: Permission = "hotel:invalidAction";
```

## Adding New Permissions

1. Update the resource or action types in `types/permissions.ts`:

```typescript
export type PermissionResource = "account" | "hotel" | "newResource"; // Add new resource

export type PermissionAction =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "customAction"; // Add new action
```

2. Add route mappings if needed:

```typescript
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/new-feature": ["newResource:read"],
};
```

3. Use the new permissions in your code:

```tsx
<Can permission="newResource:read">
  <NewFeature />
</Can>
```
