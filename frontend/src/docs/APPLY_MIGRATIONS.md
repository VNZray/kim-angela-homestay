# How to Apply Supabase Migrations

The `users` table doesn't exist in your Supabase database because the migrations haven't been applied yet.

## Option 1: Using Supabase SQL Editor (Recommended - Easiest)

1. Go to your Supabase Dashboard: https://duieocvtqyfcnptziajj.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the contents of `src/supabase/migrations/APPLY_THIS_TO_SUPABASE.sql`
4. Click **Run** to execute the migration
5. Click **Run** to execute the migration

## Option 2: Using Supabase CLI

### Setup
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref duieocvtqyfcnptziajj
```

### Apply Migrations
```bash
# Navigate to frontend directory
cd c:\Users\rayve\OneDrive\Documents\AI Projects\Personal\kim-angela-homestay\frontend

# Apply latest database state based on migrations
supabase db push

# OR manually apply this migration file
supabase db execute --file src/supabase/migrations/APPLY_THIS_TO_SUPABASE.sql
```

## Verify the Table Exists

After running the migration, verify in the Supabase Dashboard:
1. Go to **Table Editor**
2. You should see `users` table with your two admin users

## What the Migration Creates

- ✅ `users` table with columns: id, firebase_uid, email, role, display_name, timestamps, is_online, last_login
- ✅ Indexes for fast lookups
- ✅ Row Level Security (RLS) policies allowing anon access
- ✅ Auto-update trigger for `updated_at` field
- ✅ Two default admin users (your Firebase users)

## Environment Variables

Make sure your `.env` file has the correct Supabase credentials:
```
VITE_SUPABASE_URL=https://duieocvtqyfcnptziajj.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
