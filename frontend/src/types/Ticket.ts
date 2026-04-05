export type TicketType = "bug" | "error" | "feature" | "feedback";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed" | "wont_fix";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface Ticket {
    id: string;
    title: string;
    description: string;
    type: TicketType;
    status: TicketStatus;
    priority: TicketPriority;
    reported_by: string; // firebase_uid
    reporter_email: string;
    reporter_name: string | null;
    assigned_to: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
}
