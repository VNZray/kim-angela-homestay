export interface Guest {
    id: string;
    guest_name: string | null;
    classification: 'adult' | 'minor' | 'infant' | 'toddler';
    age: number | null;
}

export interface BookingConfirmation {
    id: string;
    guest_id: string;
    booking_id: string;
}