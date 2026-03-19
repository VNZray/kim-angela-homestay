export interface Promotion {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_featured: boolean;
    business_id: string;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}
