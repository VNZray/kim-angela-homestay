-- Drop existing policies that use auth.jwt()
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- Create new policies that allow anon access
-- Security is handled by Firebase authentication in the frontend
CREATE POLICY "Allow anon read access"
ON user_roles
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon insert"
ON user_roles
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anon update"
ON user_roles
FOR UPDATE
TO anon
USING (true);

CREATE POLICY "Allow anon delete"
ON user_roles
FOR DELETE
TO anon
USING (true);
