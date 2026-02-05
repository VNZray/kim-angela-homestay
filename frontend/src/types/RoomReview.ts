export interface RoomReview {
    id: string;
    tourist_id: string;
    room_id: string;
    rating: number;
    feedback: string | null;
    photos: string[];
    created_at: string;
    updated_at: string;
}
