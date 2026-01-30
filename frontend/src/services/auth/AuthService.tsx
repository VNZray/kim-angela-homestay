import supabase from "@/utils/supabase";
import type { SupabaseUser, UserRole } from "@/types/User";

const USERS_TABLE = "users";

export async function getOrCreateUserRole(
  firebaseUid: string,
  email: string,
  displayName?: string | null,
): Promise<UserRole> {
  const now = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select("role")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user role:", error);
      return "tourist";
    }

    if (!data) {
      const { data: newUser, error: insertError } = await supabase
        .from(USERS_TABLE)
        .insert({
          firebase_uid: firebaseUid,
          email,
          role: "tourist",
          display_name: displayName ?? null,
          is_online: true,
          last_login: now,
        })
        .select("role")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          const { data: existing, error: fetchError } = await supabase
            .from(USERS_TABLE)
            .select("role")
            .eq("firebase_uid", firebaseUid)
            .single();

          if (!fetchError && existing) {
            return existing.role as UserRole;
          }
        }

        console.error("Error creating user record:", insertError);
        return "tourist";
      }

      if (!newUser) {
        return "tourist";
      }

      return newUser.role as UserRole;
    }

    // Update online status and last_login for existing users
    await supabase
      .from(USERS_TABLE)
      .update({ is_online: true, last_login: now })
      .eq("firebase_uid", firebaseUid);

    return data.role as UserRole;
  } catch (err) {
    console.error("Error fetching or creating user record:", err);
    return "tourist";
  }
}

export async function markUserOffline(firebaseUid: string): Promise<void> {
  if (!firebaseUid) return;

  try {
    await supabase
      .from(USERS_TABLE)
      .update({ is_online: false })
      .eq("firebase_uid", firebaseUid);
  } catch (err) {
    console.error("Error marking user offline:", err);
  }
}

export async function getAllUsers(): Promise<SupabaseUser[]> {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return (data as SupabaseUser[]) ?? [];
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<void> {
  const { error } = await supabase
    .from(USERS_TABLE)
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase.from(USERS_TABLE).delete().eq("id", userId);

  if (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
