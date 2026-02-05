import supabase from "@/utils/supabase";
import type { Booking } from "@/types/Booking";

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
        .eq("tourist", touristId);

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
