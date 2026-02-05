export type BookingStatus =
    | "pending"
    | "reserved"
    | "checked_in"
    | "checked_out"
    | "cancelled";

export type BookingSource = "online" | "walk-in";

export interface Booking {
    id: string;
    pax: number;
    num_children: number;
    num_adults: number;
    num_infants: number;
    foreign_counts: number;
    domestic_counts: number;
    overseas_counts: number;
    local_counts: number;
    trip_purpose: string;
    booking_type: "overnight" | "short-stay";
    check_in_date: string;
    check_out_date: string;
    check_in_time: string;
    check_out_time: string;
    total_price: number;
    balance: number | null;
    booking_status: BookingStatus;
    booking_source: BookingSource;
    room_id: string;
    business_id: string;
    tourist: string | null;
}
