-- =====================================================
-- COMBINED MIGRATION SCRIPT FOR SUPABASE
-- Apply this in the Supabase SQL Editor Dashboard
-- =====================================================
-- This script creates the user_roles table and sets up
-- Row Level Security policies for role-based access
-- =====================================================

-- =====================================================
-- STEP 1: Create user_roles table
-- =====================================================

-- User Roles Table
-- This table stores user roles for Firebase authenticated users
-- Roles are managed by admins through the User Management UI

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('tourist', 'admin', 'manager', 'staff')),
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_firebase_uid ON user_roles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON user_roles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- =====================================================
-- STEP 2: Enable Row Level Security
-- =====================================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: Drop any existing policies (if they exist)
-- =====================================================

DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Allow anon read access" ON user_roles;
DROP POLICY IF EXISTS "Allow anon insert" ON user_roles;
DROP POLICY IF EXISTS "Allow anon update" ON user_roles;
DROP POLICY IF EXISTS "Allow anon delete" ON user_roles;

-- =====================================================
-- STEP 4: Create RLS Policies
-- =====================================================

-- Policy: Allow anon to read all roles
-- Security is handled by Firebase authentication in the frontend
CREATE POLICY "Allow anon read access"
ON user_roles
FOR SELECT
TO anon
USING (true);

-- Policy: Allow anon to insert new user roles (for registration)
CREATE POLICY "Allow anon insert"
ON user_roles
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow anon to update roles
-- Application logic will verify admin status before allowing updates
CREATE POLICY "Allow anon update"
ON user_roles
FOR UPDATE
TO anon
USING (true);

-- Policy: Allow anon to delete roles
-- Application logic will verify admin status before allowing deletes
CREATE POLICY "Allow anon delete"
ON user_roles
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
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 6: Insert default admin users
-- =====================================================

-- Insert default admins
INSERT INTO user_roles (firebase_uid, email, role, display_name)
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
WHERE table_schema = 'public' AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- View all users in the table
SELECT * FROM user_roles;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_roles';

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Your user_roles table is now ready to use
-- Restart your frontend application to test
-- =====================================================
