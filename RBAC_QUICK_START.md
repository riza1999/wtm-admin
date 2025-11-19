# RBAC Quick Start Guide

## 🚀 Quick Start

The RBAC system is now fully integrated into your application. Here's everything you need to know to start using it immediately.

## ✅ What's Already Working

### 1. Authentication

Your backend returns user data with permissions:

```json
{
  "user": {
    "role_id": 2,
    "role": "Admin",
    "permissions": [
      "account:read",
      "account:update",
      "hotel:read",
      "hotel:update",
      "promo:read",
      "promo:update"
    ]
  }
}
```

These permissions are automatically:

- ✅ Parsed during login
- ✅ Stored in NextAuth session
- ✅ Available on client and server
- ✅ Type-safe with TypeScript

### 2. Route Protection

Routes are automatically protected based on `ROUTE_PERMISSIONS` mapping:

- User visits `/hotel-listing` → Checks if user has `hotel:read`
- No permission → Redirects to `/access-denied`
- Has permission → Access granted

### 3. Access Denied Page

- Created at `/access-denied`
- Shown when users try to access unauthorized routes
- Provides links to dashboard and logout

## 📝 Common Usage Patterns

### Client Components

```tsx
"use client";

import { Can } from "@/components/permissions/can";
import { useHasPermission } from "@/hooks/use-permissions";

export function HotelActions() {
  // Using hooks
  const canEdit = useHasPermission("hotel:update");
  const canDelete = useHasPermission("hotel:delete");

  return (
    <div>
      {/* Using component */}
      <Can permission="hotel:update">
        <Button>Edit</Button>
      </Can>

      {/* Using hook */}
      {canDelete && <Button variant="destructive">Delete</Button>}
    </div>
  );
}
```

### Server Components

```tsx
// app/(dashboard)/hotels/page.tsx
import { verifyPermissionOrRedirect } from "@/server/permissions";

export default async function HotelsPage() {
  // Redirects if no permission
  await verifyPermissionOrRedirect("hotel:read");

  return <div>Your content here</div>;
}
```

### Server Actions

```tsx
"use server";

import { requirePermission } from "@/server/permissions";

export async function updateHotel(data: HotelData) {
  // Throws error if no permission
  await requirePermission("hotel:update");

  // Your update logic
  return { success: true };
}
```

### API Routes

```tsx
import { guardApiRoute } from "@/server/permissions";

export async function PUT(request: Request) {
  const guard = await guardApiRoute("hotel:update");

  if (!guard.authorized) {
    return guard.response; // Returns 401 or 403
  }

  // Your API logic
  return Response.json({ success: true });
}
```

## 🔧 Customization

### Add Route Protection

Edit `types/permissions.ts`:

```typescript
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/your-new-route": ["your-resource:read"],
};
```

### Add New Resource

1. Add to `PermissionResource` type:

```typescript
export type PermissionResource = "account" | "hotel" | "your-resource"; // Add here
```

2. Add to `PERMISSION_GROUPS`:

```typescript
"your-resource": {
  label: "Your Resource",
  permissions: [
    "your-resource:read",
    "your-resource:create",
    "your-resource:update",
    "your-resource:delete",
  ] as Permission[],
}
```

## 🎯 Available Permissions

### Current Resources

- `account` - User and role management
- `hotel` - Hotel listings
- `promo` - Promotions
- `promo-group` - Promo groups
- `report` - Reports
- `booking` - Bookings
- `settings` - Application settings

### Actions

- `read` - View/list resources
- `create` - Create new resources
- `update` - Edit existing resources
- `delete` - Delete resources

### Examples

- `hotel:read` - View hotel listings
- `hotel:create` - Create new hotels
- `account:update` - Edit user accounts
- `booking:delete` - Delete bookings

## 🛠️ Utilities Reference

### Client Hooks

```tsx
import {
  usePermissions, // Get all permissions
  useHasPermission, // Check single permission
  useHasAllPermissions, // Check multiple (ALL required)
  useHasAnyPermission, // Check multiple (ANY required)
  useResourcePermissions, // Get resource-specific helpers
  useRole, // Get role info
  useCurrentUser, // Get current user
} from "@/hooks/use-permissions";
```

### Server Functions

```tsx
import {
  getSession, // Get current session
  getCurrentUser, // Get current user
  getCurrentUserPermissions, // Get user permissions
  requirePermission, // Require permission (throws)
  requireAllPermissions, // Require all permissions (throws)
  checkPermission, // Check permission (boolean)
  verifyPermissionOrRedirect, // Verify or redirect
  guardApiRoute, // Guard API route
} from "@/server/permissions";
```

### UI Components

```tsx
import { Can, Cannot, ShowForAuthenticated, ShowByAuth }
from "@/components/permissions/can";

// Render if has permission
<Can permission="hotel:update">
  <EditButton />
</Can>

// Render if doesn't have permission
<Cannot permission="hotel:delete">
  <p>You cannot delete hotels</p>
</Cannot>

// With fallback
<Can permission="hotel:update" fallback={<ReadOnlyView />}>
  <EditableView />
</Can>
```

## 📚 Documentation Files

- **`RBAC_USAGE_EXAMPLES.md`** - Comprehensive usage guide with examples
- **`RBAC_INTEGRATION_EXAMPLES.md`** - Real-world integration examples
- **`RBAC_IMPLEMENTATION.md`** - Complete technical implementation details
- **`RBAC_QUICK_START.md`** - This file

## 🔒 Security Checklist

- ✅ Middleware protects routes
- ✅ Server components verify permissions
- ✅ Server actions validate permissions
- ✅ API routes are guarded
- ✅ Client UI hides unauthorized elements
- ✅ All permissions are type-safe

## 🚨 Important Notes

1. **Client-side checks are for UX only** - Always validate on server
2. **Type-safe permissions** - Use TypeScript autocomplete
3. **Test with different roles** - Verify RBAC works correctly
4. **Don't skip server validation** - Client can be bypassed

## 💡 Quick Examples

### Hide Button

```tsx
<Can permission="hotel:delete">
  <Button variant="destructive">Delete</Button>
</Can>
```

### Protect Page

```tsx
await verifyPermissionOrRedirect("hotel:read");
```

### Protect Action

```tsx
await requirePermission("hotel:update");
```

### Guard API

```tsx
const guard = await guardApiRoute("hotel:delete");
if (!guard.authorized) return guard.response;
```

## 🎉 You're Ready!

Your RBAC system is fully functional. Start protecting your routes, components, and actions using the patterns above. Refer to the detailed documentation files for more advanced use cases.

### Next Steps

1. Review `ROUTE_PERMISSIONS` in `types/permissions.ts`
2. Add permission checks to your existing components
3. Test with different user roles
4. Add new permissions as needed

Happy coding! 🚀
