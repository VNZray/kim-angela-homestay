import supabase from "@/utils/supabase";
import type { Ticket, TicketStatus, TicketType } from "@/types/Ticket";

const TICKETS_TABLE = "tickets";

// Create a new ticket (anyone can submit)
export async function createTicket(
    ticket: Omit<Ticket, "id" | "created_at" | "updated_at" | "resolved_at" | "assigned_to">,
): Promise<Ticket> {
    const { data, error } = await supabase
        .from(TICKETS_TABLE)
        .insert({
            title: ticket.title,
            description: ticket.description,
            type: ticket.type,
            status: "open",
            priority: ticket.priority,
            reported_by: ticket.reported_by,
            reporter_email: ticket.reporter_email,
            reporter_name: ticket.reporter_name,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating ticket:", error);
        throw error;
    }

    return data as Ticket;
}

// Get all tickets (developer portal)
export async function getAllTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
        .from(TICKETS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }

    return (data as Ticket[]) ?? [];
}

// Get tickets by type
export async function getTicketsByType(type: TicketType): Promise<Ticket[]> {
    const { data, error } = await supabase
        .from(TICKETS_TABLE)
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tickets by type:", error);
        throw error;
    }

    return (data as Ticket[]) ?? [];
}

// Get tickets submitted by a specific user
export async function getTicketsByUser(firebaseUid: string): Promise<Ticket[]> {
    const { data, error } = await supabase
        .from(TICKETS_TABLE)
        .select("*")
        .eq("reported_by", firebaseUid)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching user tickets:", error);
        throw error;
    }

    return (data as Ticket[]) ?? [];
}

// Update ticket status (developer only)
export async function updateTicketStatus(
    ticketId: string,
    status: TicketStatus,
): Promise<void> {
    const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
    };

    if (status === "resolved" || status === "closed") {
        updates.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
        .from(TICKETS_TABLE)
        .update(updates)
        .eq("id", ticketId);

    if (error) {
        console.error("Error updating ticket status:", error);
        throw error;
    }
}

// Update ticket (developer can edit any field)
export async function updateTicket(
    ticketId: string,
    updates: Partial<Pick<Ticket, "title" | "description" | "type" | "priority" | "status" | "assigned_to">>,
): Promise<void> {
    const { error } = await supabase
        .from(TICKETS_TABLE)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", ticketId);

    if (error) {
        console.error("Error updating ticket:", error);
        throw error;
    }
}

// Delete ticket
export async function deleteTicket(ticketId: string): Promise<void> {
    const { error } = await supabase
        .from(TICKETS_TABLE)
        .delete()
        .eq("id", ticketId);

    if (error) {
        console.error("Error deleting ticket:", error);
        throw error;
    }
}
