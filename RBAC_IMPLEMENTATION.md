# RBAC Implementation Guide

## Overview

A comprehensive Role-Based Access Control (RBAC) system has been implemented for the wtm-admin Next.js application. This system integrates seamlessly with the existing NextAuth.js authentication setup and provides both client-side and server-side permission checking.

## Architecture

### 1. Permission Structure

Permissions follow the format: `resource:action`

- **Resources**: `account`, `hotel`, `promo`, `promo-group`, `report`, `booking`, `settings`
- **Actions**: `read`, `create`, `update`, `delete`

Example permissions:

- `hotel:read` - View hotel listings
- `hotel:update` - Edit hotels
- `account:delete` - Delete user accounts

### 2. Key Components

#### Type System (`types/permissions.ts`)

- Type-safe permission definitions
- Permission groups for easier management
- Route-to-permission mappings

#### Authentication Layer (`lib/auth.ts`, `types/next-auth.d.ts`)

- Extended NextAuth types to include permissions
- Backend response parsing and normalization
- Session and JWT token management

#### Permission Utilities (`lib/permissions.ts`)

- Core permission checking functions
- Works with both client and server
- Reusable across the application

#### Client Hooks (`hooks/use-permissions.ts`)

- React hooks for permission checking
- Cached results using `useMemo`
- Easy integration into components

#### Server Utilities (`server/permissions.ts`)

- Server-side permission verification
- API route guards
- Page protection utilities

#### UI Components (`components/permissions/can.tsx`)

- Declarative permission-based rendering
- `<Can>` and `<Cannot>` components
- Fallback support for unauthorized states

#### Middleware (`middleware.ts`)

- Route-level protection
- Automatic redirection for unauthorized access
- Pattern matching for dynamic routes

## Files Created/Modified

### New Files

1. `types/permissions.ts` - Permission type definitions and route mappings
2. `lib/permissions.ts` - Core permission utility functions
3. `hooks/use-permissions.ts` - Client-side React hooks
4. `server/permissions.ts` - Server-side utilities
5. `components/permissions/can.tsx` - Permission-based UI components
6. `app/access-denied/page.tsx` - Access denied page
7. `RBAC_USAGE_EXAMPLES.md` - Usage documentation
8. `RBAC_INTEGRATION_EXAMPLES.md` - Integration examples
9. `RBAC_IMPLEMENTATION.md` - This file

### Modified Files

1. `types/next-auth.d.ts` - Added permission types to User interface
2. `lib/auth.ts` - Added permission normalization in authorize callback
3. `middleware.ts` - Added route permission checking

## How It Works

### 1. Authentication Flow

```
User Login
    ↓
Backend returns: { user: { role_id, role, permissions: [...] } }
    ↓
NextAuth processes in authorize callback
    ↓
Permissions normalized and stored in JWT token
    ↓
Token included in session
    ↓
Available throughout the app
```

### 2. Client-Side Permission Check

```tsx
// Component
const canEdit = useHasPermission("hotel:update");

// Or declaratively
<Can permission="hotel:update">
  <Button>Edit</Button>
</Can>;
```

### 3. Server-Side Permission Check

```tsx
// Server Component
await verifyPermissionOrRedirect("hotel:read");

// Server Action
await requirePermission("hotel:update");

// API Route
const guard = await guardApiRoute("hotel:delete");
if (!guard.authorized) return guard.response;
```

### 4. Middleware Protection

```tsx
// Automatically protects routes based on ROUTE_PERMISSIONS mapping
// User without "hotel:read" accessing "/hotel-listing" → redirected to /access-denied
```

## Security Layers

### Layer 1: Middleware

- Prevents unauthorized users from accessing routes
- Redirects to `/access-denied`
- First line of defense

### Layer 2: Server Components/Actions

- Validates permissions before executing logic
- Throws errors or returns error responses
- Second line of defense

### Layer 3: API Routes

- Guards API endpoints
- Returns 401/403 responses
- Third line of defense

### Layer 4: Client UI

- Hides UI elements user can't access
- Improves user experience
- NOT a security layer (can be bypassed)

## Permission Storage & Access

### Server-Side

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
const permissions = session?.user?.permissions ?? [];
```

### Client-Side

```tsx
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const permissions = session?.user?.permissions ?? [];
```

### Using Utilities

```tsx
// Server
import { getCurrentUserPermissions } from "@/server/permissions";
const permissions = await getCurrentUserPermissions();

// Client
import { usePermissions } from "@/hooks/use-permissions";
const { permissions } = usePermissions();
```

## Common Patterns

### 1. Protect a Page

```tsx
// app/(dashboard)/hotels/page.tsx
import { verifyPermissionOrRedirect } from "@/server/permissions";

export default async function HotelsPage() {
  await verifyPermissionOrRedirect("hotel:read");
  // Page content...
}
```

### 2. Conditional Rendering

```tsx
import { Can } from "@/components/permissions/can";

<Can permission="hotel:update">
  <EditButton />
</Can>;
```

### 3. Protect Server Action

```tsx
"use server";
import { requirePermission } from "@/server/permissions";

export async function updateHotel(data) {
  await requirePermission("hotel:update");
  // Update logic...
}
```

### 4. Protect API Route

```tsx
import { guardApiRoute } from "@/server/permissions";

export async function PUT(request: Request) {
  const guard = await guardApiRoute("hotel:update");
  if (!guard.authorized) return guard.response;

  // API logic...
}
```

## Configuration

### Adding New Resources

1. Update `PermissionResource` type in `types/permissions.ts`:

```typescript
export type PermissionResource = "account" | "hotel" | "your-new-resource";
```

2. Add to `PERMISSION_GROUPS`:

```typescript
"your-new-resource": {
  label: "Your New Resource",
  permissions: [
    "your-new-resource:read",
    "your-new-resource:create",
    "your-new-resource:update",
    "your-new-resource:delete",
  ] as Permission[],
}
```

3. Add route mappings:

```typescript
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/your-route": ["your-new-resource:read"],
};
```

### Adding Custom Actions

Update `PermissionAction` type:

```typescript
export type PermissionAction =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "your-custom-action";
```

## Performance Considerations

### 1. Hook Memoization

All permission hooks use `useMemo` to cache results:

```tsx
const canEdit = useHasPermission("hotel:update"); // Cached
```

### 2. Avoid Repeated Checks

```tsx
// ❌ Bad - checks in loop
items.map((item) => {
  const canEdit = useHasPermission("hotel:update");
  return <ItemCard canEdit={canEdit} />;
});

// ✅ Good - check once
const canEdit = useHasPermission("hotel:update");
return items.map((item) => <ItemCard canEdit={canEdit} />);
```

### 3. Server-Side Caching

```tsx
// Cache session and permissions
const session = await getServerSession(authOptions);
const permissions = session?.user?.permissions ?? [];

// Reuse permissions for multiple checks
const canRead = permissions.includes("hotel:read");
const canUpdate = permissions.includes("hotel:update");
```

## Testing

### Test Different Roles

Create test users with different permission sets:

```json
{
  "user": {
    "role": "Viewer",
    "permissions": ["hotel:read", "booking:read"]
  }
}
```

```json
{
  "user": {
    "role": "Editor",
    "permissions": [
      "hotel:read",
      "hotel:update",
      "booking:read",
      "booking:update"
    ]
  }
}
```

```json
{
  "user": {
    "role": "Admin",
    "permissions": [
      "account:read",
      "account:create",
      "account:update",
      "account:delete",
      "hotel:read",
      "hotel:create",
      "hotel:update",
      "hotel:delete",
      "booking:read",
      "booking:create",
      "booking:update",
      "booking:delete"
    ]
  }
}
```

### Test Scenarios

1. **Unauthorized Page Access**

   - User without permission tries to access protected route
   - Should redirect to `/access-denied`

2. **Missing UI Elements**

   - User without permission views a page they can access
   - Should not see buttons/actions they can't perform

3. **Server Action Protection**

   - User tries to call server action without permission
   - Should return error message

4. **API Route Protection**
   - API call made without proper permissions
   - Should return 403 Forbidden

## Troubleshooting

### Permissions Not Working

1. **Check session data**

```tsx
const { data: session } = useSession();
console.log(session?.user?.permissions);
```

2. **Verify backend response**

```tsx
// In lib/auth.ts authorize callback
console.log({ user: data.data.user });
```

3. **Check route mapping**

```tsx
// In types/permissions.ts
console.log(ROUTE_PERMISSIONS["/your-route"]);
```

### Infinite Redirects

Check if access denied page is protected:

```tsx
// middleware.ts - ensure /access-denied is not in ROUTE_PERMISSIONS
```

### TypeScript Errors

Ensure imports are correct:

```tsx
import type { Permission } from "@/types/permissions";
```

## Best Practices

1. **Always validate on server-side** - Client-side checks are for UX only
2. **Use type-safe permissions** - Leverage TypeScript for autocomplete
3. **Provide clear error messages** - Help users understand why access was denied
4. **Cache permission checks** - Avoid repeated computations
5. **Document custom permissions** - Keep team informed of new permissions
6. **Test with different roles** - Ensure RBAC works for all user types
7. **Use semantic naming** - Follow `resource:action` pattern
8. **Graceful fallbacks** - Show helpful messages when access is denied

## Migration Checklist

For existing features:

- [ ] Add permissions to `ROUTE_PERMISSIONS`
- [ ] Protect server components with `verifyPermissionOrRedirect`
- [ ] Protect server actions with `requirePermission`
- [ ] Protect API routes with `guardApiRoute`
- [ ] Wrap client UI with `<Can>` components
- [ ] Update table action columns
- [ ] Update navigation menus
- [ ] Test with different user roles

## Resources

- **Usage Examples**: See `RBAC_USAGE_EXAMPLES.md`
- **Integration Examples**: See `RBAC_INTEGRATION_EXAMPLES.md`
- **NextAuth Docs**: https://next-auth.js.org/
- **TypeScript Docs**: https://www.typescriptlang.org/

## Support

For questions or issues:

1. Check the usage and integration example files
2. Review this implementation guide
3. Test with different permission configurations
4. Verify backend is returning correct permission format
