export type UserRole = "tourist" | "admin" | "manager" | "staff";

// App-level authenticated user (Firebase + role)
export type User = {
    email: string;
    uid: string;
    displayName?: string | null;
    photoURL?: string | null;
    rememberMe?: boolean;
    role: UserRole;
};

// Supabase public.users table record
export interface SupabaseUser {
    id: string;
    firebase_uid: string;
    email: string;
    role: UserRole;
    display_name: string | null;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
    is_online: boolean | null;
    last_login: string | null;
}

// Admin profile table (public.admin)
export interface AdminProfile {
    id: string;
    user_id: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    created_at: string;
}

// Guest profile table (public.guest)
export interface GuestProfile {
    id: string;
    user_id: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    age: number | null;
    birthdate: string | null;
    barangay_id: string | null;
    nationality: string | null;
    gender: string | null;
    created_at: string;
    address: string | null;
}
