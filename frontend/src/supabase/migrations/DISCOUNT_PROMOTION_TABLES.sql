-- =====================================================
-- DISCOUNT & PROMOTION TABLES MIGRATION
-- Apply this in the Supabase SQL Editor Dashboard
-- =====================================================

-- =====================================================
-- STEP 1: Create Discount table
-- =====================================================
-- Stores percentage-based discounts that can apply to
-- specific rooms or all rooms. Supports promo codes.
-- =====================================================

CREATE TABLE IF NOT EXISTS discount (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    discount_percentage SMALLINT NOT NULL CHECK (discount_percentage >= 1 AND discount_percentage <= 100),
    promo_code TEXT UNIQUE,
    apply_to TEXT NOT NULL DEFAULT 'all' CHECK (apply_to IN ('all', 'specific')),
    room_ids UUID[] DEFAULT '{}'::UUID[],
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    usage_limit INT,
    used_count INT NOT NULL DEFAULT 0,
    business_id UUID NOT NULL REFERENCES business(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_discount_business_id ON discount(business_id);
CREATE INDEX IF NOT EXISTS idx_discount_promo_code ON discount(promo_code);
CREATE INDEX IF NOT EXISTS idx_discount_is_active ON discount(is_active);

-- =====================================================
-- STEP 2: Create Promotion table
-- =====================================================
-- Stores promotional posts that can be displayed on
-- the landing page. Supports images and date ranges.
-- =====================================================

CREATE TABLE IF NOT EXISTS promotion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    business_id UUID NOT NULL REFERENCES business(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_promo_date_range CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_promotion_business_id ON promotion(business_id);
CREATE INDEX IF NOT EXISTS idx_promotion_is_active ON promotion(is_active);
CREATE INDEX IF NOT EXISTS idx_promotion_is_featured ON promotion(is_featured);

-- =====================================================
-- STEP 3: Auto-update timestamps
-- =====================================================

DROP TRIGGER IF EXISTS update_discount_updated_at ON discount;
CREATE TRIGGER update_discount_updated_at
BEFORE UPDATE ON discount
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promotion_updated_at ON promotion;
CREATE TRIGGER update_promotion_updated_at
BEFORE UPDATE ON promotion
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 4: Enable RLS and create policies
-- =====================================================

ALTER TABLE discount ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion ENABLE ROW LEVEL SECURITY;

-- Discount policies (relaxed for anon key, app logic handles auth)
DROP POLICY IF EXISTS "Allow anon read discount" ON discount;
CREATE POLICY "Allow anon read discount"
ON discount FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon insert discount" ON discount;
CREATE POLICY "Allow anon insert discount"
ON discount FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update discount" ON discount;
CREATE POLICY "Allow anon update discount"
ON discount FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon delete discount" ON discount;
CREATE POLICY "Allow anon delete discount"
ON discount FOR DELETE TO anon USING (true);

-- Promotion policies
DROP POLICY IF EXISTS "Allow anon read promotion" ON promotion;
CREATE POLICY "Allow anon read promotion"
ON promotion FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon insert promotion" ON promotion;
CREATE POLICY "Allow anon insert promotion"
ON promotion FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update promotion" ON promotion;
CREATE POLICY "Allow anon update promotion"
ON promotion FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon delete promotion" ON promotion;
CREATE POLICY "Allow anon delete promotion"
ON promotion FOR DELETE TO anon USING (true);

-- =====================================================
-- VERIFICATION
-- =====================================================
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'discount'
-- ORDER BY ordinal_position;
--
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'promotion'
-- ORDER BY ordinal_position;
