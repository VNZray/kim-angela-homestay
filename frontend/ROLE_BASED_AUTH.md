# Role-Based Authentication System

## Overview

Your application now uses **Firebase Authentication with Role-Based Access Control (RBAC)**. All users authenticate through Firebase, but their permissions are controlled by their assigned role stored in Supabase.

## User Roles

### Available Roles

1. **Tourist** (Default)
   - Regular customers/guests
   - Can view and book rooms
   - Access to tourist features

2. **Staff**
   - Hotel/homestay employees
   - Can manage bookings, rooms
   - No access to sensitive business data

3. **Manager**
   - Business managers
   - Can access reports, manage staff
   - Higher level access to business operations

4. **Admin**
   - Full system access
   - Can manage user roles
   - Access to all features including User Management

## How It Works

### 1. Authentication Flow

```
User Signs Up/Logs In
         ↓
Firebase Authentication
         ↓
Fetch Role from Supabase (user_roles table)
         ↓
User Object Created with Role
         ↓
Access Control Applied
```

### 2. Default Role Assignment

- When a new user registers, they are automatically assigned the **tourist** role
- Admins can change user roles through the User Management UI
- Roles are stored in Supabase `user_roles` table

### 3. Database Structure

**Table: `user_roles`**

```sql
- id (UUID)
- firebase_uid (TEXT) - Links to Firebase user
- email (TEXT)
- role (TEXT) - 'tourist' | 'admin' | 'manager' | 'staff'
- display_name (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Implementation Details

### Setting Up the Database

1. **Run the Migration**

   Execute the SQL file at:
   ```
   frontend/src/supabase/migrations/001_user_roles.sql
   ```

2. **Create Your First Admin**

   After creating a Firebase account, update the `user_roles` table:

   ```sql
   UPDATE user_roles
   SET role = 'admin'
   WHERE firebase_uid = 'YOUR_FIREBASE_UID';
   ```

### Protected Routes

Routes can be protected with specific role requirements:

```tsx
// Admin-only route
<Route
  path="users"
  element={
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  }
/>

// Multiple roles allowed
<Route
  path="reports"
  element={
    <ProtectedRoute requiredRole={["admin", "manager"]}>
      <Reports />
    </ProtectedRoute>
  }
/>
```

### User Management UI

**Access:** `/business/users` (Admin only)

**Features:**
- View all users and their roles
- Edit user roles (change tourist → staff → manager → admin)
- Delete user roles (reverts to tourist)
- Real-time updates
- Role statistics dashboard

**Only visible to users with `role === 'admin'`**

## Usage in Code

### Check User Role

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    // Show admin features
  }

  if (["admin", "manager"].includes(user?.role)) {
    // Show features for both admins and managers
  }
}
```

### Refresh User Role

After changing a role, refresh the user's session:

```tsx
const { refreshUserRole } = useAuth();

// After role update
await refreshUserRole();
```

## Security Considerations

### Row Level Security (RLS)

The `user_roles` table has RLS policies:

1. **Users can view their own role**
   - Ensures users know their permissions

2. **Only admins can manage roles**
   - Prevents unauthorized role escalation

### Best Practices

1. **Never trust client-side role checks alone**
   - Always validate permissions on the backend
   - Use Supabase RLS policies

2. **Audit trail**
   - Track who changes user roles
   - Log important admin actions

3. **Principle of least privilege**
   - Assign minimum necessary permissions
   - Start users as tourists by default

4. **Regular review**
   - Periodically review admin access
   - Remove unnecessary elevated permissions

## Role Hierarchy

```
Admin (Highest)
  ↓
Manager
  ↓
Staff
  ↓
Tourist (Lowest)
```

## Sidebar Menu Visibility

Menu items can be restricted by role:

```tsx
{
  title: "User Management",
  icon: <PersonIcon />,
  path: "/business/users",
  requiredRole: "admin", // Only admins see this
}
```

## Common Tasks

### Make a User Admin

1. **Via Supabase Dashboard:**
   ```sql
   UPDATE user_roles
   SET role = 'admin'
   WHERE email = 'user@example.com';
   ```

2. **Via User Management UI:**
   - Login as an existing admin
   - Go to `/business/users`
   - Click Edit on the user
   - Select "Admin" role
   - Save changes

### Change Multiple Roles

```sql
-- Promote all staff to managers
UPDATE user_roles
SET role = 'manager'
WHERE role = 'staff';
```

### View Role Statistics

```sql
SELECT role, COUNT(*) as count
FROM user_roles
GROUP BY role
ORDER BY count DESC;
```

## Troubleshooting

### User Can't Access Admin Features

1. Check user role in database:
   ```sql
   SELECT * FROM user_roles WHERE email = 'user@example.com';
   ```

2. Verify user is logged in:
   ```tsx
   const { user } = useAuth();
   console.log('User:', user);
   ```

3. Refresh role:
   ```tsx
   const { refreshUserRole } = useAuth();
   await refreshUserRole();
   ```

### Role Not Updating

- Clear browser cache
- Log out and log back in
- Check Supabase RLS policies
- Verify `updated_at` timestamp in database

## Migration from Tourist-Only System

Your previous system had all Firebase users as "tourists". With this update:

1. ✅ Existing users remain functional
2. ✅ New `role` field added to User type
3. ✅ Default role is "tourist" for backwards compatibility
4. ✅ Admin users need to be manually promoted

## Next Steps

1. **Run the migration SQL** to create `user_roles` table
2. **Create your first admin** user
3. **Test the User Management UI** at `/business/users`
4. **Add role checks** to sensitive features
5. **Implement RLS policies** for your data tables
6. **Add audit logging** for admin actions

## Files Modified

- ✅ `types/User.ts` - Added role field with 4 roles
- ✅ `context/AuthContext.tsx` - Fetches role from Supabase
- ✅ `routes/ProtectedRoute.tsx` - Supports role-based protection
- ✅ `components/Sidebar.tsx` - Filters menu by role
- ✅ `pages/Business/UserManagement.tsx` - Admin UI for managing roles
- ✅ `supabase/migrations/001_user_roles.sql` - Database schema

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs
3. Check Firebase Authentication console
4. Verify RLS policies in Supabase

---

**Remember:** The first admin must be created manually via SQL. After that, admins can manage all other user roles through the UI.
