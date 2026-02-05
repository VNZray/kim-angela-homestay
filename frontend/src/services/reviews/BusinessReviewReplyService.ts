import supabase from "@/utils/supabase";
import type { BusinessReviewReply } from "@/types/BusinessReviewReply";

const TABLE = "business_review_reply";

export async function getAllBusinessReviewReplies(): Promise<BusinessReviewReply[]> {
    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
        console.error("Error fetching business review replies:", error);
        throw error;
    }

    return (data as BusinessReviewReply[]) ?? [];
}

export async function getBusinessReviewRepliesByReviewId(
    reviewId: string,
): Promise<BusinessReviewReply[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching business review replies by review_id:", error);
        throw error;
    }

    return (data as BusinessReviewReply[]) ?? [];
}

export async function createBusinessReviewReply(payload: Partial<BusinessReviewReply>): Promise<BusinessReviewReply> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating business review reply:", error);
        throw error;
    }

    return data as BusinessReviewReply;
}

export async function getBusinessReviewRepliesByResponder(
    responderUserId: string,
): Promise<BusinessReviewReply[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("responder_user_id", responderUserId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching business review replies by responder_user_id:", error);
        throw error;
    }

    return (data as BusinessReviewReply[]) ?? [];
}

export async function updateBusinessReviewReply(
    id: string,
    payload: Partial<BusinessReviewReply>,
): Promise<BusinessReviewReply> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating business review reply:", error);
        throw error;
    }

    return data as BusinessReviewReply;
}

export async function deleteBusinessReviewReply(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting business review reply:", error);
        throw error;
    }
}
