import Loading from "@/components/Loading";
import PageContainer from "@/components/PageContainer";
import Alert from "@/components/ui/Alert";
import NoDataFound from "@/components/ui/NoDataFound";
import type { TableColumn } from "@/components/ui/Table";
import Table from "@/components/ui/Table";
import Typography from "@/components/ui/Typography";
import {
  getAllBookings,
  updateBooking,
} from "@/services/booking/BookingService";
import type { Booking, BookingStatus } from "@/types/Booking";
import { Box, Chip } from "@mui/joy";
import { useEffect, useMemo, useState } from "react";
import BookingDetailsModal from "./components/BookingDetailsModal";

const STATUS_COLOR_MAP: Record<
  string,
  "warning" | "primary" | "success" | "danger" | "neutral"
> = {
  pending: "warning",
  reserved: "primary",
  checked_in: "warning",
  checked_out: "success",
  cancelled: "danger",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  reserved: "Reserved",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Alert
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  // Status change confirmation
  const [statusChange, setStatusChange] = useState<{
    bookingId: string;
    newStatus: BookingStatus;
    label: string;
  } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to load bookings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    const labelMap: Record<BookingStatus, string> = {
      reserved: "accept",
      checked_in: "check in",
      checked_out: "check out",
      cancelled: "cancel",
      pending: "set to pending",
    };
    setStatusChange({
      bookingId,
      newStatus,
      label: labelMap[newStatus],
    });
  };

  const confirmStatusChange = async () => {
    if (!statusChange) return;
    try {
      setSubmitting(true);
      await updateBooking(statusChange.bookingId, {
        booking_status: statusChange.newStatus,
      });
      setStatusChange(null);
      setSelectedBooking(null);
      setAlert({
        open: true,
        type: "success",
        title: "Updated",
        message: `Booking has been updated to "${STATUS_LABELS[statusChange.newStatus]}".`,
      });
      await fetchBookings();
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update booking status.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<Booking>[] = useMemo(
    () => [
      {
        id: "check_in_date",
        label: "Check-in",
        minWidth: 110,
      },
      {
        id: "check_out_date",
        label: "Check-out",
        minWidth: 110,
      },
      {
        id: "booking_type",
        label: "Type",
        minWidth: 100,
        render: (_row, value) => (
          <Typography.Body size="sm">
            {value === "overnight" ? "Overnight" : "Short Stay"}
          </Typography.Body>
        ),
      },
      {
        id: "pax",
        label: "Pax",
        minWidth: 60,
        align: "center" as const,
      },
      {
        id: "total_price",
        label: "Total",
        minWidth: 100,
        render: (_row, value) => (
          <Typography.Body size="sm" bold>
            ₱{value?.toLocaleString() ?? "—"}
          </Typography.Body>
        ),
      },
      {
        id: "booking_source",
        label: "Source",
        minWidth: 90,
        render: (_row, value) => (
          <Chip
            size="sm"
            variant="soft"
            color={value === "online" ? "primary" : "neutral"}
          >
            {value === "online" ? "Online" : "Walk-in"}
          </Chip>
        ),
      },
      {
        id: "booking_status",
        label: "Status",
        minWidth: 110,
        render: (_row, value) => (
          <Chip
            size="sm"
            variant="soft"
            color={STATUS_COLOR_MAP[value] ?? "neutral"}
          >
            {STATUS_LABELS[value as BookingStatus] ?? value}
          </Chip>
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
        <Typography.Header>Bookings</Typography.Header>
        <Typography.Body color="default" size="sm" sx={{ mt: 0.5 }}>
          View and manage guest bookings. Click a row to see full details.
        </Typography.Body>
      </Box>

      {/* Table */}
      {bookings.length === 0 ? (
        <NoDataFound
          icon="inbox"
          title="No Bookings Yet"
          message="Guest bookings will appear here once they are made."
        />
      ) : (
        <Table<Booking>
          columns={columns}
          data={bookings}
          rowKey="id"
          onRowClick={(row) => setSelectedBooking(row)}
          rowsPerPage={15}
        />
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        onStatusChange={handleStatusChange}
        loading={submitting}
      />

      {/* Status Change Confirmation */}
      <Alert
        open={!!statusChange}
        onClose={() => setStatusChange(null)}
        onConfirm={confirmStatusChange}
        type="warning"
        title="Confirm Action"
        message={`Are you sure you want to ${statusChange?.label} this booking?`}
        confirmText="Confirm"
        cancelText="Cancel"
        loading={submitting}
        buttonColorScheme={
          statusChange?.newStatus === "cancelled" ? "error" : "primary"
        }
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
