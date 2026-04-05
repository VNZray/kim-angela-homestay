import type { LocalBooking, BookingStatus } from "@/types/Booking";

const STORAGE_KEY = "kah_guest_bookings";

function getStoredBookings(): LocalBooking[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveBookings(bookings: LocalBooking[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function generateReferenceId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `KAH-${timestamp}-${random}`;
}

export function generateLocalId(): string {
    return `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function saveLocalBooking(booking: LocalBooking): void {
    const bookings = getStoredBookings();
    bookings.unshift(booking);
    saveBookings(bookings);
}

export function getAllLocalBookings(): LocalBooking[] {
    return getStoredBookings();
}

export function searchLocalBookings(query: string): LocalBooking[] {
    const bookings = getStoredBookings();
    const normalized = query.toLowerCase().trim();
    return bookings.filter(
        (b) =>
            b.referenceId.toLowerCase().includes(normalized) ||
            b.email.toLowerCase().includes(normalized),
    );
}

export function getLocalBookingByRef(referenceId: string): LocalBooking | null {
    const bookings = getStoredBookings();
    return bookings.find((b) => b.referenceId === referenceId) ?? null;
}

export function updateLocalBookingStatus(
    id: string,
    status: BookingStatus,
): void {
    const bookings = getStoredBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx !== -1) {
        bookings[idx].status = status;
        saveBookings(bookings);
    }
}
