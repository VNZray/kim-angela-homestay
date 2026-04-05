import supabase from "@/utils/supabase";
import type { Booking } from "@/types/Booking";
import type { BookingGuestInfo } from "@/types/Booking";

const TABLE = "booking";

export async function getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }

    return (data as Booking[]) ?? [];
}

export async function getBookingsByTouristId(
    touristId: string,
): Promise<Booking[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("tourist", touristId)
        .order("check_in_date", { ascending: false });

    if (error) {
        console.error("Error fetching bookings by tourist:", error);
        throw error;
    }

    return (data as Booking[]) ?? [];
}

export async function getBookingsByBusinessId(
    businessId: string,
): Promise<Booking[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("business_id", businessId);

    if (error) {
        console.error("Error fetching bookings by business_id:", error);
        throw error;
    }

    return (data as Booking[]) ?? [];
}

export async function getBookingsByRoomId(roomId: string): Promise<Booking[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("room_id", roomId);

    if (error) {
        console.error("Error fetching bookings by room_id:", error);
        throw error;
    }

    return (data as Booking[]) ?? [];
}

export async function getBookingByReferenceId(referenceId: string): Promise<Booking | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("reference_id", referenceId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching booking by reference_id:", error);
        throw error;
    }

    return (data as Booking) ?? null;
}

export async function getBookingsByEmail(email: string): Promise<Booking[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("guest_email", email)
        .order("check_in_date", { ascending: false });

    if (error) {
        console.error("Error fetching bookings by email:", error);
        throw error;
    }

    return (data as Booking[]) ?? [];
}

export async function getActiveBookingsByRoomId(roomId: string): Promise<Booking[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("room_id", roomId)
        .in("booking_status", ["pending", "reserved", "checked_in"]);

    if (error) {
        console.error("Error fetching active bookings:", error);
        throw error;
    }

    return (data as Booking[]) ?? [];
}

export async function createBooking(payload: Partial<Booking>): Promise<Booking> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating booking:", error);
        throw error;
    }

    return data as Booking;
}

export async function updateBooking(
    id: string,
    payload: Partial<Booking>,
): Promise<Booking> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating booking:", error);
        throw error;
    }

    return data as Booking;
}

export async function deleteBooking(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting booking:", error);
        throw error;
    }
}

// Check room availability for a given date range
export async function checkRoomAvailability(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
): Promise<boolean> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("id")
        .eq("room_id", roomId)
        .in("booking_status", ["pending", "reserved", "checked_in"])
        .lte("check_in_date", checkOutDate)
        .gte("check_out_date", checkInDate);

    if (error) {
        console.error("Error checking room availability:", error);
        throw error;
    }

    return !data || data.length === 0;
}

// Get all rooms that are available for a given date range
export async function getAvailableRoomIds(
    checkInDate: string,
    checkOutDate: string,
): Promise<Set<string>> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("room_id")
        .in("booking_status", ["pending", "reserved", "checked_in"])
        .lte("check_in_date", checkOutDate)
        .gte("check_out_date", checkInDate);

    if (error) {
        console.error("Error checking available rooms:", error);
        throw error;
    }

    const bookedRoomIds = new Set((data ?? []).map((b: { room_id: string }) => b.room_id));
    return bookedRoomIds;
}

/**
 * Insert guest records into the `guest` table and link them to the booking
 * via the `booking_confirmation` join table.
 */
export async function createBookingGuests(
    bookingId: string,
    guests: BookingGuestInfo[],
): Promise<void> {
    for (const guest of guests) {
        const { data: guestRow, error: guestError } = await supabase
            .from("guest")
            .insert({
                guest_name: guest.name.trim() || null,
                classification: guest.classification,
                age: guest.age ?? null,
            })
            .select("id")
            .single();

        if (guestError || !guestRow) {
            console.error("Error creating guest record:", guestError);
            continue;
        }

        const { error: confirmError } = await supabase
            .from("booking_confirmation")
            .insert({
                guest_id: guestRow.id,
                booking_id: bookingId,
            });

        if (confirmError) {
            console.error("Error creating booking_confirmation:", confirmError);
        }
    }
}
