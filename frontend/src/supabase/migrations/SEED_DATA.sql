-- =====================================================
-- SEED DATA FOR KIM ANGELA HOMESTAY
-- Run this AFTER SUPABASE_TABLES.sql has been applied.
-- All inserts are idempotent (safe to re-run).
-- =====================================================

-- =====================================================
-- 1. Default admin users
-- =====================================================

INSERT INTO users (firebase_uid, email, role, display_name)
VALUES
    ('KcpWaAyyfrckPDkhHI0nKFwxyR82', 'rayventzy@gmail.com', 'admin', 'System Admin'),
    ('cEMF9sDNV1gBKgIgfa2Jbf9hQVG2', 'rclores666@gmail.com', 'admin', 'System Admin')
ON CONFLICT (firebase_uid) DO NOTHING;

-- =====================================================
-- 2. Categories
-- =====================================================

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

-- =====================================================
-- 3. Admin profile & default business
-- =====================================================

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

-- =====================================================
-- 4. Default rooms for "Kim Angela Homestay"
-- =====================================================

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

-- =====================================================
-- 5. Amenities & room-amenity links
-- =====================================================

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
-- SEED COMPLETE!
-- =====================================================
