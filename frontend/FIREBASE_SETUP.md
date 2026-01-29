# Firebase + Supabase Third-Party Auth Setup Guide

This guide explains how to complete the Firebase authentication setup with Supabase third-party auth integration.

## Overview

Your application uses Firebase for **tourist/customer authentication** with Supabase as the backend. Firebase handles user authentication (email/password, Google OAuth), and the Firebase JWT tokens are used to authenticate with Supabase.

## Important: User Roles

- **Firebase Authentication**: Used exclusively for **tourists/customers** (role: 'tourist')
- **Admin Authentication**: Will be implemented separately (role: 'admin')
  - Admins should NOT use Firebase authentication
  - Admin auth will be a separate system with different credentials and permissions
  - The `/business/dashboard` and admin routes will require admin-specific authentication

## What's Been Implemented

1. ✅ Firebase SDK installed
2. ✅ Firebase configuration file created
3. ✅ Supabase client updated to accept Firebase tokens
4. ✅ AuthContext updated with Firebase authentication methods
5. ✅ Login component integrated with Firebase auth
6. ✅ Google Sign-In implemented
7. ✅ User profile display in header with dropdown menu
8. ✅ Logout functionality
9. ✅ User role system (tourist vs admin)

## Setup Instructions

### Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **kim-angela-homestay**
3. Click on the gear icon (⚙️) > **Project Settings**
4. Scroll down to "Your apps" section
5. If you don't have a web app, click **Add app** > **Web** (</>) and register your app
6. Copy the Firebase configuration values

### Step 2: Update Environment Variables

Update your `.env` file with the Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=kim-angela-homestay.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kim-angela-homestay
VITE_FIREBASE_STORAGE_BUCKET=kim-angela-homestay.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

### Step 3: Configure Firebase Authentication Methods

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - ✅ **Email/Password** - Already enabled
   - ✅ **Google** - Already enabled

### Step 4: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain

### Step 5: Set Up Supabase RLS Policies

According to the [Supabase Firebase Auth documentation](https://supabase.com/docs/guides/auth/third-party/firebase-auth), you need to set up Row Level Security (RLS) policies that check for the `authenticated` role.

Example RLS policy:

```sql
-- Example: Allow authenticated Firebase users to read data
CREATE POLICY "Allow authenticated users to read"
ON your_table_name
FOR SELECT
TO authenticated
USING (true);
```

The `authenticated` role is automatically set when a valid Firebase JWT token is provided.

### Step 6: Test the Integration

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the login page
3. Test email/password login (create a test user in Firebase Console if needed)
4. Test Google Sign-In

## How It Works

### Authentication Flow

1. **User logs in** via Firebase (email/password or Google)
2. **Firebase generates a JWT token** for the authenticated user
3. **The token is automatically passed to Supabase** via the Authorization header
4. **Supabase verifies the Firebase JWT** and grants the `authenticated` role
5. **Your app can now make authenticated requests** to Supabase

### Key Files

- **`src/utils/firebase.ts`** - Firebase initialization and auth functions
- **`src/utils/supabase.ts`** - Supabase client with Firebase token integration
- **`src/context/AuthContext.tsx`** - Authentication context with Firebase methods
- **`src/components/cards/LoginCard.tsx`** - Login UI with Firebase integration
- **`src/types/User.ts`** - User type definition

## Available Authentication Methods

The `useAuth` hook provides these methods:

```typescript
const {
  user,           // Current user object
  firebaseUser,   // Firebase user object
  loading,        // Loading state
  login,          // Email/password login
  register,       // Email/password registration
  loginWithGoogle, // Google OAuth login
  logout          // Sign out
} = useAuth();
```

## Usage Example

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, loginWithGoogle, logout } = useAuth();

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={loginWithGoogle}>Sign in with Google</button>;
}
```

## Security Considerations

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use environment variables** for all sensitive configuration
3. **Implement proper RLS policies** in Supabase for data access control
4. **Validate user permissions** on the backend for sensitive operations

## Troubleshooting

### "Firebase config not found"
- Make sure you've updated the `.env` file with actual Firebase values
- Restart the development server after updating `.env`

### "Authorization header not set"
- Check that the user is logged in via Firebase
- Verify the Firebase token is being generated (check console logs)

### "Access denied" errors from Supabase
- Check your RLS policies in Supabase
- Verify the `authenticated` role is properly configured
- Check Firebase JWT token is valid

### Google Sign-In not working
- Verify authorized domains in Firebase Console
- Check that Google provider is enabled
- Ensure popup blockers are disabled

## Additional Resources

- [Supabase Firebase Auth Guide](https://supabase.com/docs/guides/auth/third-party/firebase-auth)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

## Next Steps

1. Get Firebase configuration values from Firebase Console
2. Update `.env` file with actual values
3. Test authentication flows
4. Set up RLS policies in Supabase for your tables
5. Implement protected routes using the `useAuth` hook
