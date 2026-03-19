import supabase from "@/utils/supabase";
import type { Discount } from "@/types/Discount";

const TABLE = "discount";

export async function createDiscount(
    payload: Omit<Discount, "id" | "created_at" | "updated_at" | "used_count">,
): Promise<Discount> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert({ ...payload, used_count: 0 })
        .select("*")
        .single();

    if (error) {
        console.error("Error creating discount:", error);
        throw error;
    }

    return data as Discount;
}

export async function getAllDiscounts(): Promise<Discount[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching discounts:", error);
        throw error;
    }

    return (data as Discount[]) ?? [];
}

export async function getDiscountsByBusinessId(businessId: string): Promise<Discount[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching discounts by business_id:", error);
        throw error;
    }

    return (data as Discount[]) ?? [];
}

export async function getActiveDiscounts(): Promise<Discount[]> {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("discount_percentage", { ascending: false });

    if (error) {
        console.error("Error fetching active discounts:", error);
        throw error;
    }

    return (data as Discount[]) ?? [];
}

export async function getDiscountByPromoCode(promoCode: string): Promise<Discount | null> {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("promo_code", promoCode)
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .maybeSingle();

    if (error) {
        console.error("Error fetching discount by promo code:", error);
        throw error;
    }

    if (data && data.usage_limit !== null && data.used_count >= data.usage_limit) {
        return null;
    }

    return (data as Discount) ?? null;
}

export async function updateDiscount(
    id: string,
    payload: Partial<Discount>,
): Promise<Discount> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating discount:", error);
        throw error;
    }

    return data as Discount;
}

export async function deleteDiscount(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting discount:", error);
        throw error;
    }
}

export async function incrementDiscountUsage(id: string): Promise<void> {
    const { error } = await supabase.rpc("increment_discount_usage", { discount_id: id });

    if (error) {
        // Fallback: manual increment
        const { data } = await supabase
            .from(TABLE)
            .select("used_count")
            .eq("id", id)
            .single();

        if (data) {
            await supabase
                .from(TABLE)
                .update({ used_count: (data.used_count ?? 0) + 1 })
                .eq("id", id);
        }
    }
}
