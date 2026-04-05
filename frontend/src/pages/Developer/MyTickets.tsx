import { useState, useEffect, useMemo } from "react";
import { Box, Chip } from "@mui/joy";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Table from "@/components/ui/Table";
import type { TableColumn } from "@/components/ui/Table";
import Alert from "@/components/ui/Alert";
import Loading from "@/components/Loading";
import NoDataFound from "@/components/ui/NoDataFound";
import TicketDetailsModal from "./components/TicketDetailsModal";
import { getTicketsByUser } from "@/services/ticket/TicketService";
import { useAuth } from "@/context/AuthContext";
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

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  useEffect(() => {
    if (user?.uid) {
      fetchTickets();
    }
  }, [user?.uid]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTicketsByUser(user!.uid);
      setTickets(data);
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to load your tickets.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<Ticket>[] = useMemo(
    () => [
      {
        id: "type",
        label: "Type",
        minWidth: 90,
        render: (_row, value) => (
          <Chip
            size="sm"
            variant="soft"
            color={TYPE_COLOR_MAP[value] ?? "neutral"}
          >
            {(value as string).toUpperCase()}
          </Chip>
        ),
      },
      {
        id: "title",
        label: "Title",
        minWidth: 200,
        render: (_row, value) => (
          <Typography.Body size="sm" bold>
            {value}
          </Typography.Body>
        ),
      },
      {
        id: "priority",
        label: "Priority",
        minWidth: 90,
        render: (_row, value) => (
          <Chip
            size="sm"
            variant="soft"
            color={PRIORITY_COLOR_MAP[value] ?? "neutral"}
          >
            {(value as string).toUpperCase()}
          </Chip>
        ),
      },
      {
        id: "status",
        label: "Status",
        minWidth: 110,
        render: (_row, value) => (
          <Chip
            size="sm"
            variant="soft"
            color={STATUS_COLOR_MAP[value] ?? "neutral"}
          >
            {STATUS_LABELS[value as TicketStatus] ?? value}
          </Chip>
        ),
      },
      {
        id: "created_at",
        label: "Created",
        minWidth: 110,
        render: (_row, value) => (
          <Typography.Body size="sm">
            {new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography.Body>
        ),
      },
    ],
    [],
  );

  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      <Box sx={{ mb: 3 }}>
        <Typography.Header>My Tickets</Typography.Header>
        <Typography.Body color="default" size="sm" sx={{ mt: 0.5 }}>
          View the status of your submitted bug reports, feature requests, and
          feedback.
        </Typography.Body>
      </Box>

      {tickets.length === 0 ? (
        <NoDataFound
          icon="inbox"
          title="No Tickets Yet"
          message="You haven't submitted any tickets. Use 'Submit Report' to create one."
        />
      ) : (
        <Table<Ticket>
          columns={columns}
          data={tickets}
          rowKey="id"
          onRowClick={(row) => setSelectedTicket(row)}
          rowsPerPage={15}
        />
      )}

      {/* Read-only details modal (no status change for regular users) */}
      <TicketDetailsModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onStatusChange={() => {}}
        loading={false}
      />

      <Alert
        open={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
      />
    </PageContainer>
  );
}
