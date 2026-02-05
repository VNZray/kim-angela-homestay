export interface Business {
    id: string;
    business_name: string | null;
    category_id: number | null;
    email: string | null;
    phone_number: string | null;
    description: string | null;
    business_profile: string | null;
    created_at: string;
    owner_id: string;
    facebook_link: string | null;
    instagram_link: string | null;
    tiktok_link: string | null;
}
