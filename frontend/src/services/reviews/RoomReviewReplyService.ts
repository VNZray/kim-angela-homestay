import supabase from "@/utils/supabase";
import type { RoomReviewReply } from "@/types/RoomReviewReply";

const TABLE = "room_review_reply";

export async function getAllRoomReviewReplies(): Promise<RoomReviewReply[]> {
    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
        console.error("Error fetching room review replies:", error);
        throw error;
    }

    return (data as RoomReviewReply[]) ?? [];
}

export async function getRoomReviewRepliesByReviewId(
    reviewId: string,
): Promise<RoomReviewReply[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching room review replies by review_id:", error);
        throw error;
    }

    return (data as RoomReviewReply[]) ?? [];
}

export async function createRoomReviewReply(payload: Partial<RoomReviewReply>): Promise<RoomReviewReply> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating room review reply:", error);
        throw error;
    }

    return data as RoomReviewReply;
}

export async function getRoomReviewRepliesByResponder(
    responderUserId: string,
): Promise<RoomReviewReply[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("responder_user_id", responderUserId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching room review replies by responder_user_id:", error);
        throw error;
    }

    return (data as RoomReviewReply[]) ?? [];
}

export async function updateRoomReviewReply(
    id: string,
    payload: Partial<RoomReviewReply>,
): Promise<RoomReviewReply> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating room review reply:", error);
        throw error;
    }

    return data as RoomReviewReply;
}

export async function deleteRoomReviewReply(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting room review reply:", error);
        throw error;
    }
}
