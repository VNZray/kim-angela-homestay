export interface ItineraryPackage {
    id: string;
    business_id: string;
    code: string; // e.g. "3D2N", "4D3N"
    label?: string | null;
    content?: string | null; // Plain text or markdown describing the itinerary
    created_at?: string;
    updated_at?: string;
}
