import supabase from "@/utils/supabase";

const USERS_TABLE = "users";
const GUEST_TABLE = "guest";

export interface GuestRegistrationInput {
  firebaseUid: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export async function createGuestForUser(
  input: GuestRegistrationInput,
): Promise<void> {
  const { firebaseUid, firstName, lastName } = input;

  try {
    const { data: userRow, error: userError } = await supabase
      .from(USERS_TABLE)
      .select("id")
      .eq("firebase_uid", firebaseUid)
      .single();

    if (userError || !userRow) {
      console.error("Unable to find users row for guest:", userError);
      return;
    }

    const { error: insertError } = await supabase.from(GUEST_TABLE).insert({
      user_id: userRow.id,
      first_name: firstName,
      last_name: lastName,
    });

    if (insertError) {
      console.error("Error creating guest profile:", insertError);
    }
  } catch (err) {
    console.error("Unexpected error creating guest profile:", err);
  }
}

export async function getGuestByFirebaseUid(firebaseUid: string) {
  const { data: userRow, error: userError } = await supabase
    .from(USERS_TABLE)
    .select("id")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (userError || !userRow) {
    return null;
  }

  const { data, error } = await supabase
    .from(GUEST_TABLE)
    .select("*")
    .eq("user_id", userRow.id)
    .single();

  if (error) {
    console.error("Error fetching guest profile:", error);
    return null;
  }

  return data;
}
