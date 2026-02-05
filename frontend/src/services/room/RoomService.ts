import supabase from "@/utils/supabase";
import type { Room } from "@/types/Room";

const TABLE = "room";

export async function getAllRooms(): Promise<Room[]> {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
    return (data as Room[]) ?? [];
}

export async function getRoomById(id: string): Promise<Room | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching room:", error);
        throw error;
    }

    return (data as Room) ?? null;
}

export async function getRoomsByBusinessId(businessId: string): Promise<Room[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("business_id", businessId);

    if (error) {
        console.error("Error fetching rooms by business_id:", error);
        throw error;
    }

    return (data as Room[]) ?? [];
}

export async function updateRoom(
    id: string,
    payload: Partial<Room>,
): Promise<Room> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating room:", error);
        throw error;
    }

    return data as Room;
}

export async function deleteRoom(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting room:", error);
        throw error;
    }
}
