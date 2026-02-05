import supabase from "@/utils/supabase";
import type { RoomReview } from "@/types/RoomReview";

const TABLE = "room_review";

export async function getAllRoomReviews(): Promise<RoomReview[]> {
    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
        console.error("Error fetching room reviews:", error);
        throw error;
    }

    return (data as RoomReview[]) ?? [];
}

export async function getRoomReviewsByRoomId(
    roomId: string,
): Promise<RoomReview[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching room reviews by room_id:", error);
        throw error;
    }

    return (data as RoomReview[]) ?? [];
}

export async function createRoomReview(payload: Partial<RoomReview>): Promise<RoomReview> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating room review:", error);
        throw error;
    }

    return data as RoomReview;
}

export async function getRoomReviewsByTouristId(
    touristId: string,
): Promise<RoomReview[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("tourist_id", touristId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching room reviews by tourist_id:", error);
        throw error;
    }

    return (data as RoomReview[]) ?? [];
}

export async function updateRoomReview(
    id: string,
    payload: Partial<RoomReview>,
): Promise<RoomReview> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating room review:", error);
        throw error;
    }

    return data as RoomReview;
}

export async function deleteRoomReview(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting room review:", error);
        throw error;
    }
}
