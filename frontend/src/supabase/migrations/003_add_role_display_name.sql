-- Add role_display_name column for custom role titles (e.g., "System Admin", "Front Desk Manager")
-- This is separate from display_name which stores the user's actual full name

ALTER TABLE user_roles
ADD COLUMN IF NOT EXISTS role_display_name TEXT;

-- Add a comment explaining the field
COMMENT ON COLUMN user_roles.role_display_name IS 'Custom display name for the role (e.g., System Admin, Front Desk Manager). Different from display_name which is the user''s actual full name.';
