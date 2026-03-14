export type PaymentMethod = "cash" | "gcash" | "bank_transfer" | "credit_card" | "other";
export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

export interface Transaction {
    id: string;
    booking_id: string;
    amount: number;
    payment_method: PaymentMethod;
    transaction_status: TransactionStatus;
    reference_number: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}
