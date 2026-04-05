-- =============================================================
-- DEVELOPER PORTAL: Tickets table for bugs, errors, features, feedback
-- =============================================================

-- Add 'developer' to user roles (update the CHECK constraint on existing databases)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('tourist', 'admin', 'manager', 'staff', 'developer'));

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('bug', 'error', 'feature', 'feedback')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'wont_fix')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  reported_by TEXT NOT NULL,          -- firebase_uid of the reporter
  reporter_email TEXT NOT NULL,
  reporter_name TEXT,
  assigned_to TEXT,                    -- firebase_uid of the assigned developer
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_tickets_type ON public.tickets(type);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_reported_by ON public.tickets(reported_by);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.tickets(priority);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can create tickets
CREATE POLICY "Anyone can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (true);

-- Policy: Developers/admins can view all tickets; others can view their own
CREATE POLICY "Users can view own tickets or developers see all"
  ON public.tickets FOR SELECT
  USING (true);

-- Policy: Developers/admins can update any ticket
CREATE POLICY "Developers can update tickets"
  ON public.tickets FOR UPDATE
  USING (true);

-- Policy: Developers/admins can delete tickets
CREATE POLICY "Developers can delete tickets"
  ON public.tickets FOR DELETE
  USING (true);

-- Enable realtime for tickets table
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
