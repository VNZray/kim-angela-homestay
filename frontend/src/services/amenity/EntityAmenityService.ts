import supabase from "@/utils/supabase";
import type { EntityAmenity } from "@/types/EntityAmenity";

const TABLE = "entity_amenity";

export async function getAllEntityAmenities(): Promise<EntityAmenity[]> {
    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
        console.error("Error fetching entity amenities:", error);
        throw error;
    }

    return (data as EntityAmenity[]) ?? [];
}

export async function getEntityAmenitiesByEntityId(
    entityId: string,
): Promise<EntityAmenity[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("entity_id", entityId);

    if (error) {
        console.error("Error fetching entity amenities by entity_id:", error);
        throw error;
    }

    return (data as EntityAmenity[]) ?? [];
}

export async function getEntityAmenitiesByAmenityId(
    amenityId: number,
): Promise<EntityAmenity[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("amenity_id", amenityId);

    if (error) {
        console.error("Error fetching entity amenities by amenity_id:", error);
        throw error;
    }

    return (data as EntityAmenity[]) ?? [];
}

export async function updateEntityAmenity(
    id: number,
    payload: Partial<EntityAmenity>,
): Promise<EntityAmenity> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating entity amenity:", error);
        throw error;
    }

    return data as EntityAmenity;
}

export async function deleteEntityAmenity(id: number): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting entity amenity:", error);
        throw error;
    }
}
