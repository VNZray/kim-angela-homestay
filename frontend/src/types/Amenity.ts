export interface Amenity {
    id: number;
    name: string;
    entity_type: string | null;
    slug: string | null;
    icon: string | null;
    is_active: boolean;
}
