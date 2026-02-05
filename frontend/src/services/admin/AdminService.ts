import supabase from "@/utils/supabase";
import type { Admin } from "@/types/Admin";

const TABLE = "admin";

export async function getAllAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) {
        console.error("Error fetching admins:", error);
        throw error;
    }
    return (data as Admin[]) ?? [];
}

export async function getAdminById(id: string): Promise<Admin | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching admin:", error);
        throw error;
    }

    return (data as Admin) ?? null;
}

export async function getAdminsByUserId(userId: string): Promise<Admin[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching admins by user_id:", error);
        throw error;
    }

    return (data as Admin[]) ?? [];
}

export async function updateAdmin(
    id: string,
    payload: Partial<Admin>,
): Promise<Admin> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating admin:", error);
        throw error;
    }

    return data as Admin;
}

export async function deleteAdmin(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting admin:", error);
        throw error;
    }
}
