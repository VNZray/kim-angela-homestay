import { Box, Chip, Divider, Stack } from "@mui/joy";
import BaseModal from "@/components/ui/BaseModal";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import type { Ticket, TicketStatus } from "@/types/Ticket";

const STATUS_COLOR_MAP: Record<
  string,
  "warning" | "primary" | "success" | "danger" | "neutral"
> = {
  open: "warning",
  in_progress: "primary",
  resolved: "success",
  closed: "neutral",
  wont_fix: "danger",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  wont_fix: "Won't Fix",
};

const TYPE_COLOR_MAP: Record<
  string,
  "danger" | "warning" | "primary" | "success"
> = {
  bug: "danger",
  error: "warning",
  feature: "primary",
  feedback: "success",
};

const PRIORITY_COLOR_MAP: Record<
  string,
  "danger" | "warning" | "primary" | "neutral"
> = {
  critical: "danger",
  high: "warning",
  medium: "primary",
  low: "neutral",
};

interface TicketDetailsModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
  loading?: boolean;
}

export default function TicketDetailsModal({
  open,
  onClose,
  ticket,
  onStatusChange,
  loading = false,
}: TicketDetailsModalProps) {
  if (!ticket) return null;

  const availableTransitions: Record<TicketStatus, TicketStatus[]> = {
    open: ["in_progress", "wont_fix", "closed"],
    in_progress: ["resolved", "wont_fix", "closed"],
    resolved: ["closed", "open"],
    closed: ["open"],
    wont_fix: ["open"],
  };

  const transitions = availableTransitions[ticket.status] ?? [];

  return (
    <BaseModal open={open} onClose={onClose} title="Ticket Details" size="md">
      <Stack spacing={2} p={4}>
        {/* Header Info */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Chip
            size="sm"
            variant="soft"
            color={TYPE_COLOR_MAP[ticket.type] ?? "neutral"}
          >
            {ticket.type.toUpperCase()}
          </Chip>
          <Chip
            size="sm"
            variant="soft"
            color={PRIORITY_COLOR_MAP[ticket.priority] ?? "neutral"}
          >
            {ticket.priority.toUpperCase()}
          </Chip>
          <Chip
            size="sm"
            variant="soft"
            color={STATUS_COLOR_MAP[ticket.status] ?? "neutral"}
          >
            {STATUS_LABELS[ticket.status]}
          </Chip>
        </Box>

        {/* Title */}
        <Typography.CardTitle>{ticket.title}</Typography.CardTitle>

        <Divider />

        {/* Description */}
        <Box>
          <Typography.Label bold>Description</Typography.Label>
          <Typography.Body size="sm" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
            {ticket.description || "No description provided."}
          </Typography.Body>
        </Box>

        <Divider />

        {/* Meta Info */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <Box>
            <Typography.Label bold size="xs">
              Reported By
            </Typography.Label>
            <Typography.Body size="sm">
              {ticket.reporter_name ?? ticket.reporter_email}
            </Typography.Body>
          </Box>
          <Box>
            <Typography.Label bold size="xs">
              Email
            </Typography.Label>
            <Typography.Body size="sm">{ticket.reporter_email}</Typography.Body>
          </Box>
          <Box>
            <Typography.Label bold size="xs">
              Created
            </Typography.Label>
            <Typography.Body size="sm">
              {new Date(ticket.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography.Body>
          </Box>
          <Box>
            <Typography.Label bold size="xs">
              Last Updated
            </Typography.Label>
            <Typography.Body size="sm">
              {new Date(ticket.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography.Body>
          </Box>
          {ticket.resolved_at && (
            <Box>
              <Typography.Label bold size="xs">
                Resolved
              </Typography.Label>
              <Typography.Body size="sm">
                {new Date(ticket.resolved_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography.Body>
            </Box>
          )}
        </Box>

        {/* Status Actions */}
        {transitions.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography.Label bold size="xs" sx={{ mb: 1 }}>
                Change Status
              </Typography.Label>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {transitions.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="outlined"
                    colorScheme={
                      STATUS_COLOR_MAP[status] === "danger"
                        ? "error"
                        : "primary"
                    }
                    onClick={() => onStatusChange(ticket.id, status)}
                    disabled={loading}
                  >
                    {STATUS_LABELS[status]}
                  </Button>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Stack>
    </BaseModal>
  );
}
