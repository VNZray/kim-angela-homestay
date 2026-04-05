import supabase from "@/utils/supabase";
import type { Tourist } from "@/types/Tourist";

const TABLE = "tourist";
const USERS_TABLE = "users";

export async function createTouristForUser(input: {
    firebaseUid: string;
    firstName: string;
    lastName: string;
}): Promise<void> {
    const { firebaseUid, firstName, lastName } = input;

    try {
        const { data: userRow, error: userError } = await supabase
            .from(USERS_TABLE)
            .select("id")
            .eq("firebase_uid", firebaseUid)
            .single();

        if (userError || !userRow) {
            console.error("Unable to find users row for tourist:", userError);
            return;
        }

        const { error: insertError } = await supabase.from(TABLE).insert({
            user_id: userRow.id,
            first_name: firstName,
            last_name: lastName,
        });

        if (insertError) {
            console.error("Error creating tourist profile:", insertError);
        }
    } catch (err) {
        console.error("Unexpected error creating tourist profile:", err);
    }
}

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

export async function getTouristByFirebaseUid(
    firebaseUid: string,
): Promise<Tourist | null> {
    const { data: userRow, error: userError } = await supabase
        .from(USERS_TABLE)
        .select("id")
        .eq("firebase_uid", firebaseUid)
        .single();

    if (userError || !userRow) return null;

    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("user_id", userRow.id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching tourist by firebase_uid:", error);
        return null;
    }

    return (data as Tourist) ?? null;
}

export async function deleteTourist(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting tourist:", error);
        throw error;
    }
}
