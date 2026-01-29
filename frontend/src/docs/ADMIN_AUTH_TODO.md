# Admin Authentication Implementation Guide

## Current Status

✅ **Tourist Authentication (Complete)**
- Firebase authentication for tourists/customers
- Email/password and Google Sign-In
- User profile displayed in header
- Role: `'tourist'`

## TODO: Admin Authentication

### Requirements

Admin authentication should be **completely separate** from Firebase tourist auth:

1. **Separate Login Page**: `/admin/login`
2. **Different Auth System**:
   - Option 1: Supabase native auth (recommended)
   - Option 2: Custom JWT-based auth
   - Option 3: Session-based auth with backend
3. **Admin Role**: Set `role: 'admin'` for admin users
4. **Protected Admin Routes**: Require admin role to access

### Implementation Steps

#### 1. Create Admin Context

Create `src/context/AdminAuthContext.tsx`:

```tsx
interface AdminAuthContextType {
  admin: User | null;
  loading: boolean;
  loginAdmin: (email: string, password: string) => Promise<User>;
  logoutAdmin: () => Promise<void>;
}
```

#### 2. Create Admin Login Page

Create `src/pages/Admin/AdminLogin.tsx`:
- Separate form from tourist login
- Use AdminAuthContext
- Different styling/branding
- Redirect to `/admin/dashboard` on success

#### 3. Update User Type

The User type already includes role field:
```typescript
role?: UserRole; // 'tourist' | 'admin'
```

#### 4. Create Admin Protected Routes

Update `src/routes/ProtectedRoute.tsx` to handle admin routes:

```tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}
```

#### 5. Separate Admin Routes

Move business dashboard to admin-specific authentication:
- `/admin/dashboard` - Admin dashboard (requires admin auth)
- `/admin/bookings` - Manage bookings
- `/admin/rooms` - Manage rooms
- `/admin/users` - Manage users

#### 6. Update Header

The header already detects user role. Add admin-specific menu items:

```tsx
if (user?.role === 'admin') {
  // Show admin menu items
} else if (user?.role === 'tourist') {
  // Show tourist menu items
}
```

### Security Considerations

1. **Never mix admin and tourist credentials**
2. **Admin credentials should be stored separately in Supabase**
3. **Use different JWT tokens for admin vs tourist**
4. **Implement admin-specific RLS policies in Supabase**
5. **Admin emails should be whitelisted**
6. **Add 2FA for admin accounts (optional but recommended)**

### Database Schema (Supabase)

Create separate tables:

```sql
-- Tourist users (Firebase)
CREATE TABLE tourist_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users (Supabase native auth)
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  permissions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies Example

```sql
-- Only admins can access admin_users table
CREATE POLICY "Admins only"
ON admin_users
FOR ALL
USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Tourists can only access their own profile
CREATE POLICY "Tourists own profile"
ON tourist_profiles
FOR ALL
USING (
  auth.uid() = id AND
  auth.jwt() ->> 'role' = 'tourist'
);
```

### Recommended Approach

**Use Supabase Native Auth for Admins**:

1. Enable Email/Password provider in Supabase (separate from Firebase)
2. Manually create admin accounts via Supabase dashboard
3. Set custom claims in auth.users metadata: `{ "role": "admin" }`
4. Use Supabase's `signInWithPassword` for admin login
5. Store admin JWT separately from Firebase JWT

### Benefits of Separate Systems

- **Better security**: Admins and tourists never share credentials
- **Easier management**: Can disable tourist auth without affecting admins
- **Better audit trail**: Separate logs for admin vs tourist actions
- **Role isolation**: Clear separation of concerns
- **Independent scaling**: Can scale admin and tourist systems separately

### Next Steps

1. Decide on admin auth approach (Supabase native recommended)
2. Create AdminAuthContext
3. Implement admin login page
4. Update routing to separate admin from tourist routes
5. Test both auth systems work independently
