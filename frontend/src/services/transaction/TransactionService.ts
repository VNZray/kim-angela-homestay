import supabase from "@/utils/supabase";
import type { Transaction } from "@/types/Transaction";

const TABLE = "transaction";

export async function getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
    return (data as Transaction[]) ?? [];
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching transaction:", error);
        throw error;
    }
    return (data as Transaction) ?? null;
}

export async function getTransactionsByBookingId(bookingId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching transactions by booking_id:", error);
        throw error;
    }
    return (data as Transaction[]) ?? [];
}

export async function createTransaction(payload: Omit<Transaction, "id" | "created_at" | "updated_at">): Promise<Transaction> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(payload)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
    return data as Transaction;
}

export async function updateTransaction(id: string, payload: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
    return data as Transaction;
}

export async function deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}
