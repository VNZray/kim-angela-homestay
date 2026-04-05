-- Enable Supabase Realtime on the users table
-- This allows clients to subscribe to INSERT/UPDATE/DELETE changes on the users table

-- Set REPLICA IDENTITY to FULL so UPDATE events include the full row (not just changed columns)
ALTER TABLE users REPLICA IDENTITY FULL;

-- Add the users table to the Supabase realtime publication
-- (Supabase uses this publication to broadcast changes via websockets)
ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- Create a function to mark stale sessions as offline.
-- Called periodically to handle cases where beforeunload/heartbeat fails
-- (e.g. browser crash, OS kill, network loss).
-- A user is considered stale if they are marked online but their last heartbeat
-- was more than 2 minutes ago.
CREATE OR REPLACE FUNCTION cleanup_stale_sessions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE users
  SET is_online = FALSE,
      last_active_at = NOW()
  WHERE is_online = TRUE
    AND last_active_at < NOW() - INTERVAL '2 minutes';
END;
$$;

-- Optional: If you have pg_cron enabled, schedule automatic cleanup every 2 minutes:
-- SELECT cron.schedule('cleanup-stale-sessions', '*/2 * * * *', 'SELECT cleanup_stale_sessions()');
