export interface BusinessReview {
    id: string;
    tourist_id: string;
    business_id: string;
    rating: number;
    feedback: string | null;
    photos: string[];
    created_at: string;
    updated_at: string;
}
