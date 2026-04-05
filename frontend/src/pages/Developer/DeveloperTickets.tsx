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
import {
  getAllTickets,
  updateTicketStatus,
} from "@/services/ticket/TicketService";
import type { Ticket, TicketStatus, TicketType } from "@/types/Ticket";
import Button from "@/components/ui/Button";

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

type FilterType = "all" | TicketType;
type FilterStatus = "all" | TicketStatus;

export default function DeveloperTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Modal
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Alert
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  // Status change confirmation
  const [statusChange, setStatusChange] = useState<{
    ticketId: string;
    newStatus: TicketStatus;
    label: string;
  } | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setTickets(data);
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to load tickets.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      return true;
    });
  }, [tickets, filterType, filterStatus]);

  // Stats
  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      bugs: tickets.filter((t) => t.type === "bug").length,
      errors: tickets.filter((t) => t.type === "error").length,
      features: tickets.filter((t) => t.type === "feature").length,
      feedback: tickets.filter((t) => t.type === "feedback").length,
    }),
    [tickets],
  );

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setStatusChange({ ticketId, newStatus, label: STATUS_LABELS[newStatus] });
  };

  const confirmStatusChange = async () => {
    if (!statusChange) return;
    try {
      setSubmitting(true);
      await updateTicketStatus(statusChange.ticketId, statusChange.newStatus);
      setStatusChange(null);
      setSelectedTicket(null);
      setAlert({
        open: true,
        type: "success",
        title: "Updated",
        message: `Ticket status changed to "${statusChange.label}".`,
      });
      await fetchTickets();
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update ticket status.",
      });
    } finally {
      setSubmitting(false);
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
        id: "reporter_name",
        label: "Reporter",
        minWidth: 120,
        render: (row, value) => (
          <Typography.Body size="sm">
            {value ?? row.reporter_email}
          </Typography.Body>
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
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography.Header>Developer Portal</Typography.Header>
        <Typography.Body color="default" size="sm" sx={{ mt: 0.5 }}>
          Track and manage bugs, errors, feature requests, and feedback.
        </Typography.Body>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard label="Open" count={stats.open} color="warning" />
        <StatCard
          label="In Progress"
          count={stats.inProgress}
          color="primary"
        />
        <StatCard label="Resolved" count={stats.resolved} color="success" />
        <StatCard label="Total" count={stats.total} color="neutral" />
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <Typography.Label bold size="sm" sx={{ alignSelf: "center", mr: 1 }}>
          Type:
        </Typography.Label>
        {(["all", "bug", "error", "feature", "feedback"] as FilterType[]).map(
          (t) => (
            <Button
              key={t}
              size="sm"
              variant={filterType === t ? "solid" : "outlined"}
              colorScheme={t === "all" ? "secondary" : undefined}
              onClick={() => setFilterType(t)}
            >
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              {t !== "all" &&
                ` (${stats[t === "bug" ? "bugs" : t === "error" ? "errors" : t === "feature" ? "features" : "feedback"]})`}
            </Button>
          ),
        )}

        <Box sx={{ width: 16 }} />

        <Typography.Label bold size="sm" sx={{ alignSelf: "center", mr: 1 }}>
          Status:
        </Typography.Label>
        {(
          [
            "all",
            "open",
            "in_progress",
            "resolved",
            "closed",
            "wont_fix",
          ] as FilterStatus[]
        ).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filterStatus === s ? "solid" : "outlined"}
            colorScheme={s === "all" ? "secondary" : undefined}
            onClick={() => setFilterStatus(s)}
          >
            {s === "all" ? "All" : STATUS_LABELS[s as TicketStatus]}
          </Button>
        ))}
      </Box>

      {/* Table */}
      {filteredTickets.length === 0 ? (
        <NoDataFound
          icon="inbox"
          title="No Tickets Found"
          message="No tickets match the current filters."
        />
      ) : (
        <Table<Ticket>
          columns={columns}
          data={filteredTickets}
          rowKey="id"
          onRowClick={(row) => setSelectedTicket(row)}
          rowsPerPage={15}
        />
      )}

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onStatusChange={handleStatusChange}
        loading={submitting}
      />

      {/* Status Change Confirmation */}
      <Alert
        open={!!statusChange}
        onClose={() => setStatusChange(null)}
        onConfirm={confirmStatusChange}
        type="warning"
        title="Confirm Status Change"
        message={`Change ticket status to "${statusChange?.label}"?`}
        confirmText="Confirm"
        cancelText="Cancel"
        loading={submitting}
      />

      {/* Feedback Alert */}
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

// Stat card sub-component
function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "warning" | "primary" | "success" | "neutral";
}) {
  const colorMap = {
    warning: "#f59e0b",
    primary: "#3b82f6",
    success: "#10b981",
    neutral: "#6b7280",
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <Typography.Header size="md" bold>
        {count}
      </Typography.Header>
      <Typography.Body size="xs" sx={{ color: colorMap[color] }}>
        {label}
      </Typography.Body>
    </Box>
  );
}
