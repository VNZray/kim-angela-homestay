import supabase from "@/utils/supabase";
import type { Amenity } from "@/types/Amenity";

const TABLE = "amenity";

export async function getAllAmenities(): Promise<Amenity[]> {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) {
        console.error("Error fetching amenities:", error);
        throw error;
    }
    return (data as Amenity[]) ?? [];
}

export async function getAmenityById(id: number): Promise<Amenity | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching amenity by id:", error);
        throw error;
    }

    return (data as Amenity) ?? null;
}

export async function getAmenitiesByEntityType(
    entityType: string,
): Promise<Amenity[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("entity_type", entityType);

    if (error) {
        console.error("Error fetching amenities by entity_type:", error);
        throw error;
    }

    return (data as Amenity[]) ?? [];
}

export async function updateAmenity(
    id: number,
    payload: Partial<Amenity>,
): Promise<Amenity> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating amenity:", error);
        throw error;
    }

    return data as Amenity;
}

export async function deleteAmenity(id: number): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting amenity:", error);
        throw error;
    }
}
