-- Seed business_review and room_review tables with sample data
-- This script fetches existing tourist and business/room IDs dynamically
-- Run this in the Supabase SQL Editor

-- Insert business reviews (uses first tourist and first business found)
DO $$
DECLARE
    v_tourist_id UUID;
    v_business_id UUID;
    v_room_id UUID;
    tourist_ids UUID[];
    i INT;
BEGIN
    -- Get all tourist IDs
    SELECT ARRAY(SELECT id FROM tourist LIMIT 5) INTO tourist_ids;

    -- Get first business
    SELECT id INTO v_business_id FROM business LIMIT 1;

    -- Get first room
    SELECT id INTO v_room_id FROM room LIMIT 1;

    -- Exit if no data to reference
    IF array_length(tourist_ids, 1) IS NULL OR v_business_id IS NULL THEN
        RAISE NOTICE 'No tourists or businesses found. Please create at least one tourist and one business first.';
        RETURN;
    END IF;

    -- Use first tourist for all reviews if we don't have many
    v_tourist_id := tourist_ids[1];

    -- Insert business reviews
    INSERT INTO business_review (tourist_id, business_id, rating, feedback, created_at)
    VALUES
        (v_tourist_id, v_business_id, 5, 'Amazing homestay! The view from the rooftop is breathtaking and the staff was incredibly welcoming. Will definitely come back!', NOW() - INTERVAL '2 days'),
        (v_tourist_id, v_business_id, 4, 'Great location and very affordable. The rooms were clean and comfortable. The dining area has a lovely atmosphere with colorful lanterns.', NOW() - INTERVAL '5 days'),
        (v_tourist_id, v_business_id, 5, 'Best homestay experience in Caramoan! The food was delicious and the owner was very hospitable. Highly recommended for families and groups.', NOW() - INTERVAL '10 days'),
        (v_tourist_id, v_business_id, 4, 'Cozy place with a homey feel. Perfect for island hopping trips. The rooftop area is great for relaxing in the evening.', NOW() - INTERVAL '15 days'),
        (v_tourist_id, v_business_id, 3, 'Good value for money. Location is convenient and close to the port. The room was a bit small but overall a nice stay.', NOW() - INTERVAL '20 days');

    RAISE NOTICE 'Inserted 5 business reviews.';

    -- Insert room reviews if a room exists
    IF v_room_id IS NOT NULL THEN
        INSERT INTO room_review (tourist_id, room_id, rating, feedback, created_at)
        VALUES
            (v_tourist_id, v_room_id, 5, 'The room was spotless and very comfortable. Loved the wooden interiors and the balcony overlooking the garden.', NOW() - INTERVAL '3 days'),
            (v_tourist_id, v_room_id, 4, 'Nice and spacious room. AC works perfectly. Good for couples or small families.', NOW() - INTERVAL '8 days'),
            (v_tourist_id, v_room_id, 5, 'Exceeded expectations! Very well maintained and the bed was super comfortable. Great value.', NOW() - INTERVAL '12 days'),
            (v_tourist_id, v_room_id, 4, 'Clean room with all basic amenities. The staff made sure everything was in order before check-in.', NOW() - INTERVAL '18 days'),
            (v_tourist_id, v_room_id, 3, 'Decent room for the price. Could use a bit more lighting but overall a pleasant stay.', NOW() - INTERVAL '25 days'),
            (v_tourist_id, v_room_id, 5, 'Absolutely loved it! The natural wood design gives it such a warm feeling. Perfect for our weekend getaway.', NOW() - INTERVAL '30 days');

        RAISE NOTICE 'Inserted 6 room reviews.';
    ELSE
        RAISE NOTICE 'No rooms found. Skipping room reviews.';
    END IF;
END $$;
