import supabase from "@/utils/supabase";
import type { BusinessReview } from "@/types/BusinessReview";

const TABLE = "business_review";

export async function getAllBusinessReviews(): Promise<BusinessReview[]> {
    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
        console.error("Error fetching business reviews:", error);
        throw error;
    }

    return (data as BusinessReview[]) ?? [];
}

export async function getBusinessReviewsByBusinessId(
    businessId: string,
): Promise<BusinessReview[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching business reviews by business_id:", error);
        throw error;
    }

    return (data as BusinessReview[]) ?? [];
}

export async function createBusinessReview(payload: Partial<BusinessReview>): Promise<BusinessReview> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating business review:", error);
        throw error;
    }

    return data as BusinessReview;
}

export async function getBusinessReviewsByTouristId(
    touristId: string,
): Promise<BusinessReview[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("tourist_id", touristId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching business reviews by tourist_id:", error);
        throw error;
    }

    return (data as BusinessReview[]) ?? [];
}

export async function updateBusinessReview(
    id: string,
    payload: Partial<BusinessReview>,
): Promise<BusinessReview> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating business review:", error);
        throw error;
    }

    return data as BusinessReview;
}

export async function deleteBusinessReview(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting business review:", error);
        throw error;
    }
}
