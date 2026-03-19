export interface Discount {
    id: string;
    name: string;
    description: string | null;
    discount_percentage: number;
    promo_code: string | null;
    apply_to: "all" | "specific";
    room_ids: string[];
    start_date: string;
    end_date: string;
    is_active: boolean;
    usage_limit: number | null;
    used_count: number;
    business_id: string;
    created_at: string;
    updated_at: string;
}
