import supabase from "@/utils/supabase";
import type { Business } from "@/types/Business";

const TABLE = "business";

export async function getAllBusinesses(): Promise<Business[]> {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) {
        console.error("Error fetching businesses:", error);
        throw error;
    }
    return (data as Business[]) ?? [];
}

export async function getBusinessById(id: string): Promise<Business | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching business:", error);
        throw error;
    }

    return (data as Business) ?? null;
}

export async function getBusinessesByOwnerId(ownerId: string): Promise<Business[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("owner_id", ownerId);

    if (error) {
        console.error("Error fetching businesses by owner_id:", error);
        throw error;
    }

    return (data as Business[]) ?? [];
}

export async function updateBusiness(
    id: string,
    payload: Partial<Business>,
): Promise<Business> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating business:", error);
        throw error;
    }

    return data as Business;
}

export async function deleteBusiness(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting business:", error);
        throw error;
    }
}
