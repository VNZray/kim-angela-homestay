export interface Room {
    id: string;
    room_number: string | null;
    capacity: number | null;
    room_type: string | null;
    room_size: string | null;
    room_profile: string | null;
    description: string | null;
    room_price: number | null;
    per_hour_rate: number | null;
    floor: number | null;
    business_id: string | null;
}
