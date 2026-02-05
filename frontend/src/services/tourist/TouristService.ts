import supabase from "@/utils/supabase";
import type { Tourist } from "@/types/Tourist";

const TABLE = "tourist";

export async function getAllTourists(): Promise<Tourist[]> {
    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
        console.error("Error fetching tourists:", error);
        throw error;
    }

    return (data as Tourist[]) ?? [];
}

export async function getTouristById(id: string): Promise<Tourist | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching tourist by id:", error);
        throw error;
    }

    return (data as Tourist) ?? null;
}

export async function getTouristsByUserId(
    userId: string,
): Promise<Tourist[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching tourists by user_id:", error);
        throw error;
    }

    return (data as Tourist[]) ?? [];
}

export async function updateTourist(
    id: string,
    payload: Partial<Tourist>,
): Promise<Tourist> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating tourist:", error);
        throw error;
    }

    return data as Tourist;
}

export async function deleteTourist(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting tourist:", error);
        throw error;
    }
}
