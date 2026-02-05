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
-- STEP 1B: Create core domain tables (optional)
-- These tables mirror your existing schema for admin,
-- business, category, tourist and room entities.
-- They only run if the tables do NOT already exist.
-- =====================================================

-- Admin table (stores staff/admin profiles linked to users)
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    user_id UUID REFERENCES users(id),
    phone_number TEXT
);

-- Category table (business categories, e.g., rooms, tours, dining)
CREATE TABLE IF NOT EXISTS category (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT,
    display_name TEXT,
    description TEXT
);

-- Business table (homestay business metadata)
CREATE TABLE IF NOT EXISTS business (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT,
    category_id BIGINT REFERENCES category(id),
    email TEXT,
    phone_number TEXT,
    description TEXT,
    business_profile TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    owner_id UUID NOT NULL REFERENCES admin(id),
    facebook_link TEXT,
    instagram_link TEXT,
    tiktok_link TEXT
);

-- Guest table (linked to users table)
CREATE TABLE IF NOT EXISTS tourist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    age SMALLINT,
    birthdate DATE,
    barangay_id TEXT,
    nationaliy TEXT,
    gender VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    address TEXT
);

-- Room table (rooms for the homestay business)
CREATE TABLE IF NOT EXISTS room (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number TEXT,
    capacity SMALLINT,
    room_type TEXT,
    room_size TEXT,
    room_profile TEXT,
    description TEXT,
    room_price DOUBLE PRECISION,
    per_hour_rate DOUBLE PRECISION,
    floor SMALLINT,
    business_id UUID REFERENCES business(id)
);

-- Amenity master table (list of amenities that can be attached to rooms or businesses)
CREATE TABLE IF NOT EXISTS amenity (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    entity_type TEXT,
    slug TEXT UNIQUE,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Amenity mapping table (links amenities to a generic entity like room or business)
CREATE TABLE IF NOT EXISTS entity_amenity (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_id UUID NOT NULL,
    amenity_id BIGINT NOT NULL REFERENCES amenity(id) ON DELETE CASCADE
);

-- Index for faster lookups by entity (room, business, etc.)
CREATE INDEX IF NOT EXISTS idx_entity_amenity_entity_id ON entity_amenity(entity_id);

-- Ensure primary keys exist on referenced tables for FKs
DO $$
BEGIN
    -- Add primary key on room.id if missing
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'room'
    ) THEN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conrelid = 'public.room'::regclass
              AND contype = 'p'
        ) THEN
            ALTER TABLE room ADD CONSTRAINT room_pkey PRIMARY KEY (id);
        END IF;
    END IF;

    -- Add primary key on business.id if missing
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'business'
    ) THEN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conrelid = 'public.business'::regclass
              AND contype = 'p'
        ) THEN
            ALTER TABLE business ADD CONSTRAINT business_pkey PRIMARY KEY (id);
        END IF;
    END IF;

    -- Add primary key on tourist.id if missing
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'tourist'
    ) THEN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conrelid = 'public.tourist'::regclass
              AND contype = 'p'
        ) THEN
            ALTER TABLE tourist ADD CONSTRAINT tourist_pkey PRIMARY KEY (id);
        END IF;
    END IF;
END $$;

-- Booking table (room bookings for guests)
CREATE TABLE IF NOT EXISTS booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pax SMALLINT NOT NULL,
    num_children SMALLINT NOT NULL DEFAULT 0,
    num_adults SMALLINT NOT NULL DEFAULT 0,
    num_infants SMALLINT NOT NULL DEFAULT 0,
    foreign_counts SMALLINT NOT NULL DEFAULT 0,
    domestic_counts SMALLINT NOT NULL DEFAULT 0,
    overseas_counts SMALLINT NOT NULL DEFAULT 0,
    local_counts SMALLINT NOT NULL DEFAULT 0,
    trip_purpose VARCHAR(30) NOT NULL,
    booking_type TEXT NOT NULL DEFAULT 'overnight' CHECK (booking_type IN ('overnight', 'short-stay')),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    balance DOUBLE PRECISION,
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        booking_status IN ('pending', 'reserved', 'checked_in', 'checked_out', 'cancelled')
    ),
    booking_source TEXT NOT NULL DEFAULT 'online' CHECK (booking_source IN ('online', 'walk-in')),
    room_id UUID NOT NULL REFERENCES room(id),
    business_id UUID NOT NULL REFERENCES business(id),
    tourist UUID REFERENCES tourist(id)
);

-- Clean up any old generic review tables (if they exist)
DROP TABLE IF EXISTS review_reply;
DROP TABLE IF EXISTS review;

-- Business review table (tourist reviews for businesses)
CREATE TABLE IF NOT EXISTS business_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_id UUID NOT NULL REFERENCES tourist(id),
    business_id UUID NOT NULL REFERENCES business(id),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    photos TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Room review table (tourist reviews for rooms)
CREATE TABLE IF NOT EXISTS room_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_id UUID NOT NULL REFERENCES tourist(id),
    room_id UUID NOT NULL REFERENCES room(id),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    photos TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business review reply table (owner/admin/manager replies to business reviews)
CREATE TABLE IF NOT EXISTS business_review_reply (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES business_review(id) ON DELETE CASCADE,
    responder_user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Room review reply table (owner/admin/manager replies to room reviews)
CREATE TABLE IF NOT EXISTS room_review_reply (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES room_review(id) ON DELETE CASCADE,
    responder_user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
-- STEP 7: Seed core reference data (optional, idempotent)
-- These blocks will only run if the target tables exist
-- and will NOT create duplicate rows.
-- =====================================================

-- Seed base categories used by the business
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'category'
    ) THEN
        INSERT INTO category (name, display_name, description)
        SELECT 'homestay', 'Homestay', 'Homestay accommodations'
        WHERE NOT EXISTS (
            SELECT 1 FROM category WHERE name = 'homestay'
        );

        INSERT INTO category (name, display_name, description)
        SELECT 'tour', 'Tour Packages', 'Island hopping and tour packages'
        WHERE NOT EXISTS (
            SELECT 1 FROM category WHERE name = 'tour'
        );

        INSERT INTO category (name, display_name, description)
        SELECT 'dining', 'Dining Packages', 'Meal and dining packages'
        WHERE NOT EXISTS (
            SELECT 1 FROM category WHERE name = 'dining'
        );
    END IF;
END $$;

-- Seed admin profile and default business row
DO $$
DECLARE
    v_admin_id UUID;
BEGIN
    -- Only proceed if admin table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'admin'
    ) THEN
        -- Create admin profile linked to the primary default admin user
        INSERT INTO admin (first_name, last_name, user_id, phone_number)
        SELECT
            'Rayven',
            'Clores',
            u.id,
            NULL
        FROM users u
        WHERE u.email = 'rayventzy@gmail.com'
          AND NOT EXISTS (
              SELECT 1 FROM admin a WHERE a.user_id = u.id
          )
        RETURNING id INTO v_admin_id;

        -- If the admin profile already existed, fetch its id
        IF v_admin_id IS NULL THEN
            SELECT a.id INTO v_admin_id
            FROM admin a
            JOIN users u ON a.user_id = u.id
            WHERE u.email = 'rayventzy@gmail.com'
            LIMIT 1;
        END IF;

        -- Seed default business row if business table exists
        IF v_admin_id IS NOT NULL
           AND EXISTS (
               SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'public' AND table_name = 'business'
           ) THEN
            INSERT INTO business (
                business_name,
                category_id,
                email,
                phone_number,
                description,
                business_profile,
                owner_id
            )
            SELECT
                'Kim Angela Homestay',
                (SELECT id FROM category WHERE name = 'homestay' LIMIT 1),
                'kimangela@gmail.com',      -- update to your real email
                '+63-000-000-0000',      -- update to your real phone
                'Default homestay business profile',
                'Default homestay profile',
                v_admin_id
            WHERE NOT EXISTS (
                SELECT 1 FROM business
                WHERE business_name = 'Kim Angela Homestay'
            );
        END IF;
    END IF;
END $$;

-- Seed default rooms for "Kim Angela Homestay"
DO $$
DECLARE
    v_business_id UUID;
BEGIN
    -- Only proceed if room and business tables exist
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'room'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'business'
    ) THEN
        SELECT id
        INTO v_business_id
        FROM business
        WHERE business_name = 'Kim Angela Homestay'
        LIMIT 1;

        IF v_business_id IS NOT NULL THEN
            -- Room 1
            INSERT INTO room (
                room_number,
                capacity,
                room_type,
                room_size,
                room_profile,
                description,
                room_price,
                per_hour_rate,
                floor,
                business_id
            )
            SELECT
                'Room 1',
                8, -- Pax: 6-8
                'Family Room',
                NULL,
                NULL,
                'Pax 6-8; Beds: 3; Extra bed: 1',
                3000,
                NULL,
                1,
                v_business_id
            WHERE NOT EXISTS (
                SELECT 1 FROM room
                WHERE business_id = v_business_id
                  AND room_number = 'Room 1'
            );

            -- Room 2
            INSERT INTO room (
                room_number,
                capacity,
                room_type,
                room_size,
                room_profile,
                description,
                room_price,
                per_hour_rate,
                floor,
                business_id
            )
            SELECT
                'Room 2',
                6, -- Pax: 4-6
                'Family Room',
                NULL,
                NULL,
                'Pax 4-6; Beds: 2; Extra bed: 1',
                1500,
                NULL,
                1,
                v_business_id
            WHERE NOT EXISTS (
                SELECT 1 FROM room
                WHERE business_id = v_business_id
                  AND room_number = 'Room 2'
            );

            -- Room 3
            INSERT INTO room (
                room_number,
                capacity,
                room_type,
                room_size,
                room_profile,
                description,
                room_price,
                per_hour_rate,
                floor,
                business_id
            )
            SELECT
                'Room 3',
                10, -- Pax: 6-10
                'Family Room',
                NULL,
                NULL,
                'Pax 6-10; Beds: 3; Extra bed: 2',
                3000,
                NULL,
                1,
                v_business_id
            WHERE NOT EXISTS (
                SELECT 1 FROM room
                WHERE business_id = v_business_id
                  AND room_number = 'Room 3'
            );

            -- Room 4
            INSERT INTO room (
                room_number,
                capacity,
                room_type,
                room_size,
                room_profile,
                description,
                room_price,
                per_hour_rate,
                floor,
                business_id
            )
            SELECT
                'Room 4',
                6, -- Pax: 4-6
                NULL,
                NULL,
                NULL,
                'Pax 4-6; Bed: 1 double deck; Extra bed: 1',
                1500,
                NULL,
                1,
                v_business_id
            WHERE NOT EXISTS (
                SELECT 1 FROM room
                WHERE business_id = v_business_id
                  AND room_number = 'Room 4'
            );

            -- Room 5
            INSERT INTO room (
                room_number,
                capacity,
                room_type,
                room_size,
                room_profile,
                description,
                room_price,
                per_hour_rate,
                floor,
                business_id
            )
            SELECT
                'Room 5',
                4, -- Pax: 2-4
                'Couple Room',
                NULL,
                NULL,
                'Pax 2-4; Beds: 1; Extra bed: 1',
                1000,
                NULL,
                1,
                v_business_id
            WHERE NOT EXISTS (
                SELECT 1 FROM room
                WHERE business_id = v_business_id
                  AND room_number = 'Room 5'
            );

            -- Room 6
            INSERT INTO room (
                room_number,
                capacity,
                room_type,
                room_size,
                room_profile,
                description,
                room_price,
                per_hour_rate,
                floor,
                business_id
            )
            SELECT
                'Room 6',
                4, -- Pax: 2-4
                'Couple Room',
                NULL,
                NULL,
                'Pax 2-4; Beds: 1; Extra bed: 1',
                1000,
                NULL,
                1,
                v_business_id
            WHERE NOT EXISTS (
                SELECT 1 FROM room
                WHERE business_id = v_business_id
                  AND room_number = 'Room 6'
            );

            -- Room 7
            INSERT INTO room (
                room_number,
                capacity,
                room_type,
                room_size,
                room_profile,
                description,
                room_price,
                per_hour_rate,
                floor,
                business_id
            )
            SELECT
                'Room 7',
                10, -- Pax: 8-10
                'Family Room',
                NULL,
                NULL,
                'Pax 8-10; Beds: 2 and 1 double deck; Extra bed: 1',
                3000,
                NULL,
                1,
                v_business_id
            WHERE NOT EXISTS (
                SELECT 1 FROM room
                WHERE business_id = v_business_id
                  AND room_number = 'Room 7'
            );
        END IF;
    END IF;
END $$;

-- Seed amenities and link them to the seeded rooms
DO $$
BEGIN
    -- Ensure amenity, entity_amenity, room, and business tables exist
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'amenity'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'entity_amenity'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'room'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'business'
    ) THEN
        -- Insert base amenities for rooms (idempotent)
        INSERT INTO amenity (name, entity_type, slug, icon)
        VALUES
            ('Air Conditioner', 'room', 'air-conditioner', 'air-conditioner'),
            ('TV', 'room', 'tv', 'tv'),
            ('Shower', 'room', 'shower', 'shower')
        ON CONFLICT (slug) DO NOTHING;

        -- Link all seeded rooms of Kim Angela Homestay to these amenities
        INSERT INTO entity_amenity (entity_id, amenity_id)
        SELECT r.id, a.id
        FROM room r
        JOIN business b ON r.business_id = b.id
        JOIN amenity a ON a.slug IN ('air-conditioner', 'tv', 'shower')
        WHERE b.business_name = 'Kim Angela Homestay'
          AND r.room_number IN ('Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7')
          AND NOT EXISTS (
              SELECT 1
              FROM entity_amenity ea
              WHERE ea.entity_id = r.id
                AND ea.amenity_id = a.id
          );
    END IF;
END $$;

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

-- Enable RLS on tourist table if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'tourist'
    ) THEN
        ALTER TABLE tourist ENABLE ROW LEVEL SECURITY;

        -- Relaxed policy so frontend (anon key) can insert/select tourist rows
        DROP POLICY IF EXISTS "Allow anon access to tourist" ON tourist;

        CREATE POLICY "Allow anon access to tourist"
        ON tourist
        FOR ALL
        TO anon
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- =====================================================
-- OPTIONAL: RLS for admin, business, category, and room tables
-- These are relaxed policies so the frontend (anon key)
-- can read data. Tighten them later as needed.
-- =====================================================

DO $$
BEGIN
    -- Admin table RLS (full access; guarded in frontend by Firebase roles)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'admin'
    ) THEN
        ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to admin" ON admin;

        CREATE POLICY "Allow anon access to admin"
        ON admin
        FOR ALL
        TO anon
        USING (true)
        WITH CHECK (true);
    END IF;

    -- Category table RLS (read-only for anon)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'category'
    ) THEN
        ALTER TABLE category ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to category" ON category;

        CREATE POLICY "Allow anon access to category"
        ON category
        FOR SELECT
        TO anon
        USING (true);
    END IF;

    -- Business table RLS (read-only for anon)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'business'
    ) THEN
        ALTER TABLE business ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to business" ON business;

        CREATE POLICY "Allow anon access to business"
        ON business
        FOR SELECT
        TO anon
        USING (true);
    END IF;

    -- Room table RLS (read-only for anon)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'room'
    ) THEN
        ALTER TABLE room ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to room" ON room;

        CREATE POLICY "Allow anon access to room"
        ON room
        FOR SELECT
        TO anon
        USING (true);
    END IF;

    -- Amenity table RLS (read-only for anon)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'amenity'
    ) THEN
        ALTER TABLE amenity ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to amenity" ON amenity;

        CREATE POLICY "Allow anon access to amenity"
        ON amenity
        FOR SELECT
        TO anon
        USING (true);
    END IF;

    -- Entity_amenity table RLS (read-only for anon)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'entity_amenity'
    ) THEN
        ALTER TABLE entity_amenity ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to entity_amenity" ON entity_amenity;

        CREATE POLICY "Allow anon access to entity_amenity"
        ON entity_amenity
        FOR SELECT
        TO anon
        USING (true);
    END IF;

    -- Booking table RLS (full access; guarded in frontend by Firebase roles)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'booking'
    ) THEN
        ALTER TABLE booking ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to booking" ON booking;

        CREATE POLICY "Allow anon access to booking"
        ON booking
        FOR ALL
        TO anon
        USING (true)
        WITH CHECK (true);
    END IF;

    -- Business review table RLS (full access; guarded in frontend by Firebase roles)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'business_review'
    ) THEN
        ALTER TABLE business_review ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to business_review" ON business_review;

        CREATE POLICY "Allow anon access to business_review"
        ON business_review
        FOR ALL
        TO anon
        USING (true)
        WITH CHECK (true);
    END IF;

    -- Room review table RLS (full access; guarded in frontend by Firebase roles)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'room_review'
    ) THEN
        ALTER TABLE room_review ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to room_review" ON room_review;

        CREATE POLICY "Allow anon access to room_review"
        ON room_review
        FOR ALL
        TO anon
        USING (true)
        WITH CHECK (true);
    END IF;

    -- Business review reply table RLS (full access; guarded in frontend by Firebase roles)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'business_review_reply'
    ) THEN
        ALTER TABLE business_review_reply ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to business_review_reply" ON business_review_reply;

        CREATE POLICY "Allow anon access to business_review_reply"
        ON business_review_reply
        FOR ALL
        TO anon
        USING (true)
        WITH CHECK (true);
    END IF;

    -- Room review reply table RLS (full access; guarded in frontend by Firebase roles)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'room_review_reply'
    ) THEN
        ALTER TABLE room_review_reply ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow anon access to room_review_reply" ON room_review_reply;

        CREATE POLICY "Allow anon access to room_review_reply"
        ON room_review_reply
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
