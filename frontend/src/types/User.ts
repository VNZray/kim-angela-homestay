export type UserRole = 'tourist' | 'admin' | 'manager' | 'staff';

export type User = {
    email: string;
    uid: string;
    displayName?: string | null;
    photoURL?: string | null;
    rememberMe?: boolean;
    role: UserRole; // Required field for role-based access control
}
