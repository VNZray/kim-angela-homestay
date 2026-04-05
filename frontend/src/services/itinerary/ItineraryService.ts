import supabase from "@/utils/supabase";
import type { ItineraryPackage } from "@/types/Itinerary";

const TABLE = "itinerary_package";

export async function getItinerariesByBusiness(businessId: string): Promise<ItineraryPackage[]> {
    const { data, error } = await supabase.from(TABLE).select("*").eq("business_id", businessId).order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching itineraries:", error);
        throw error;
    }
    return (data as ItineraryPackage[]) ?? [];
}

export async function getItineraryByBusinessAndCode(businessId: string, code: string): Promise<ItineraryPackage | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("business_id", businessId)
        .eq("code", code)
        .maybeSingle();

    if (error) {
        console.error("Error fetching itinerary by code:", error);
        throw error;
    }

    return (data as ItineraryPackage) ?? null;
}

export async function createItinerary(payload: Omit<ItineraryPackage, "id" | "created_at" | "updated_at">): Promise<ItineraryPackage> {
    const { data, error } = await supabase.from(TABLE).insert(payload).select("*").single();
    if (error) {
        console.error("Error creating itinerary:", error);
        throw error;
    }
    return data as ItineraryPackage;
}

export async function updateItinerary(id: string, payload: Partial<ItineraryPackage>): Promise<ItineraryPackage> {
    const { data, error } = await supabase.from(TABLE).update(payload).eq("id", id).select("*").single();
    if (error) {
        console.error("Error updating itinerary:", error);
        throw error;
    }
    return data as ItineraryPackage;
}

export async function deleteItinerary(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting itinerary:", error);
        throw error;
    }
}
