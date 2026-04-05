export type BookingStatus =
    | "pending"
    | "reserved"
    | "checked_in"
    | "checked_out"
    | "cancelled";

export type BookingSource = "online" | "walk-in";

export type StayType = "overnight" | "short-stay";

export type OvernightDuration = "1D2N" | "2D3N" | "3D4N" | "4D5N" | "5D6N" | "6D7N";

export interface Booking {
    id: string;
    reference_id: string;
    pax: number;
    num_children: number;
    num_adults: number;
    num_infants: number;
    foreign_counts: number;
    domestic_counts: number;
    overseas_counts: number;
    local_counts: number;
    trip_purpose: string;
    booking_type: StayType;
    check_in_date: string;
    check_out_date: string;
    check_in_time: string;
    check_out_time: string;
    duration_hours: number | null;
    duration_nights: number | null;
    total_price: number;
    balance: number | null;
    booking_status: BookingStatus;
    booking_source: BookingSource;
    room_id: string;
    business_id: string;
    tourist: string | null;
    guest_name?: string | null;
    guest_email?: string | null;
    guest_phone?: string | null;
}

// Form data used during the booking flow
export interface BookingGuestInfo {
    name: string;
    classification: "adult" | "minor" | "infant" | "toddler";
    age: number | null;
}

export interface BookingFormData {
    // Personal info (guest mode only)
    fullName: string;
    email: string;
    phone: string;

    // Guest details
    numGuests: number;
    guests: BookingGuestInfo[];

    // Booking details
    roomId: string;
    stayType: StayType;
    arrivalDate: string;
    durationHours: number;
    overnightDuration: OvernightDuration;

    // Origin & purpose
    tripPurpose: string;
    foreignCounts: number;
    domesticCounts: number;
    overseasCounts: number;
    localCounts: number;

    // Computed
    checkOutDate: string;
    checkOutTime: string;
    totalPrice: number;
}

// For guest (non-authenticated) bookings stored in localStorage
export interface LocalBooking {
    id: string;
    referenceId: string;
    fullName: string;
    email: string;
    phone: string;
    guests: BookingGuestInfo[];
    roomId: string;
    roomName: string;
    roomNumber: string;
    stayType: StayType;
    arrivalDate: string;
    checkOutDate: string;
    checkInTime: string;
    checkOutTime: string;
    durationHours: number | null;
    durationNights: number | null;
    pax: number;
    tripPurpose: string;
    foreignCounts: number;
    domesticCounts: number;
    overseasCounts: number;
    localCounts: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
}