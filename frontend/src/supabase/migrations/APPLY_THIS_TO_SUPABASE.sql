-- =====================================================
-- COMBINED MIGRATION SCRIPT FOR SUPABASE
-- Apply this in the Supabase SQL Editor Dashboard
-- =====================================================
-- This script creates the users table and sets up
-- Row Level Security policies for role-based access
-- =====================================================

-- =====================================================
-- STEP 1: Create users table
-- =====================================================

-- User Roles Table
-- This table stores user roles for Firebase authenticated users
-- Roles are managed by admins through the User Management UI

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('tourist', 'admin', 'manager', 'staff')),
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TIMESTAMPTZ,
    updated_by TIMESTAMPTZ,
    is_online BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- STEP 2: Enable Row Level Security
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: Drop any existing policies (if they exist)
-- =====================================================

DROP POLICY IF EXISTS "Users can view own role" ON users;
DROP POLICY IF EXISTS "Admins can manage all roles" ON users;
DROP POLICY IF EXISTS "Allow anon read access" ON users;
DROP POLICY IF EXISTS "Allow anon insert" ON users;
DROP POLICY IF EXISTS "Allow anon update" ON users;
DROP POLICY IF EXISTS "Allow anon delete" ON users;

-- =====================================================
-- STEP 4: Create RLS Policies
-- =====================================================

-- Policy: Allow anon to read all roles
-- Security is handled by Firebase authentication in the frontend
CREATE POLICY "Allow anon read access"
ON users
FOR SELECT
TO anon
USING (true);

-- Policy: Allow anon to insert new user roles (for registration)
CREATE POLICY "Allow anon insert"
ON users
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow anon to update roles
-- Application logic will verify admin status before allowing updates
CREATE POLICY "Allow anon update"
ON users
FOR UPDATE
TO anon
USING (true);

-- Policy: Allow anon to delete roles
-- Application logic will verify admin status before allowing deletes
CREATE POLICY "Allow anon delete"
ON users
FOR DELETE
TO anon
USING (true);

-- =====================================================
-- STEP 5: Create trigger function and trigger
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on every update
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 6: Insert default admin users
-- =====================================================

-- Insert default admins
INSERT INTO users (firebase_uid, email, role, display_name)
VALUES
    ('KcpWaAyyfrckPDkhHI0nKFwxyR82', 'rayventzy@gmail.com', 'admin', 'System Admin'),
    ('cEMF9sDNV1gBKgIgfa2Jbf9hQVG2', 'rclores666@gmail.com', 'admin', 'System Admin')
ON CONFLICT (firebase_uid) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after the migration to verify everything works:

-- Check if table exists and view structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- View all users in the table
SELECT * FROM users;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';

-- =====================================================
-- OPTIONAL: Guest table RLS for browser access
-- =====================================================

-- Enable RLS on guest table if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'guest'
    ) THEN
        ALTER TABLE guest ENABLE ROW LEVEL SECURITY;

        -- Relaxed policy so frontend (anon key) can insert/select guest rows
        DROP POLICY IF EXISTS "Allow anon access to guest" ON guest;

        CREATE POLICY "Allow anon access to guest"
        ON guest
        FOR ALL
        TO anon
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Your users table is now ready to use
-- Restart your frontend application to test
-- =====================================================
