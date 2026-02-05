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