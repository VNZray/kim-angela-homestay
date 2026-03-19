import supabase from "@/utils/supabase";
import type { Promotion } from "@/types/Promotion";

const TABLE = "promotion";

export async function createPromotion(
    payload: Omit<Promotion, "id" | "created_at" | "updated_at">,
): Promise<Promotion> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating promotion:", error);
        throw error;
    }

    return data as Promotion;
}

export async function getAllPromotions(): Promise<Promotion[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching promotions:", error);
        throw error;
    }

    return (data as Promotion[]) ?? [];
}

export async function getPromotionsByBusinessId(businessId: string): Promise<Promotion[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching promotions by business_id:", error);
        throw error;
    }

    return (data as Promotion[]) ?? [];
}

export async function getActivePromotions(): Promise<Promotion[]> {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("is_featured", { ascending: false });

    if (error) {
        console.error("Error fetching active promotions:", error);
        throw error;
    }

    return (data as Promotion[]) ?? [];
}

export async function getFeaturedPromotions(): Promise<Promotion[]> {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching featured promotions:", error);
        throw error;
    }

    return (data as Promotion[]) ?? [];
}

export async function updatePromotion(
    id: string,
    payload: Partial<Promotion>,
): Promise<Promotion> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating promotion:", error);
        throw error;
    }

    return data as Promotion;
}

export async function deletePromotion(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting promotion:", error);
        throw error;
    }
}
