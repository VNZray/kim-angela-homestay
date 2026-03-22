-- Add last_active_at column for session tracking
-- This column stores the timestamp of the user's last heartbeat/activity
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill existing rows: use last_login if available, otherwise created_at
UPDATE users
SET last_active_at = COALESCE(last_login, created_at)
WHERE last_active_at IS NULL;
