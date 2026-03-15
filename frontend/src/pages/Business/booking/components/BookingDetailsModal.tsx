import { Box, Divider, Chip } from "@mui/joy";
import {
  People,
  CalendarMonth,
  AccessTime,
  Hotel,
  AttachMoney,
  FlightTakeoff,
  ChildCare,
  Person,
  ChildFriendly,
} from "@mui/icons-material";
import Typography from "@/components/ui/Typography";
import BaseModal from "@/components/ui/BaseModal";
import type { Booking, BookingStatus } from "@/types/Booking";

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

interface BookingDetailsModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusChange?: (bookingId: string, newStatus: BookingStatus) => void;
  loading?: boolean;
}

export default function BookingDetailsModal({
  open,
  onClose,
  booking,
  onStatusChange,
  loading = false,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  const status = booking.booking_status;

  // Allowed transitions
  const getActions = (): {
    label: string;
    status: BookingStatus;
    color: "primary" | "success" | "warning" | "error";
  }[] => {
    switch (status) {
      case "pending":
        return [
          { label: "Accept Booking", status: "reserved", color: "primary" },
          { label: "Cancel", status: "cancelled", color: "error" },
        ];
      case "reserved":
        return [
          { label: "Check In", status: "checked_in", color: "success" },
          { label: "Cancel", status: "cancelled", color: "error" },
        ];
      case "checked_in":
        return [
          { label: "Check Out", status: "checked_out", color: "success" },
        ];
      default:
        return [];
    }
  };

  const actions = getActions();

  const DetailRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number | React.ReactNode;
  }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
      <Box sx={{ color: "var(--joy-palette-primary-500)", mt: 0.25 }}>
        {icon}
      </Box>
      <Box>
        <Typography.Label size="xs" color="default">
          {label}
        </Typography.Label>
        <Typography.Body size="sm" color="dark">
          {value}
        </Typography.Body>
      </Box>
    </Box>
  );

  const modalActions = onStatusChange
    ? actions.map((action) => ({
        label: action.label,
        onClick: () => onStatusChange(booking.id, action.status),
        variant: (action.color === "error" ? "outlined" : "solid") as
          | "solid"
          | "outlined",
        colorScheme: action.color as
          | "primary"
          | "success"
          | "warning"
          | "error",
        disabled: loading,
      }))
    : [];

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      headerContent={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography.CardTitle size="md" color="dark">
            Booking Details
          </Typography.CardTitle>
          <Chip
            size="sm"
            variant="soft"
            color={STATUS_COLOR_MAP[status] ?? "neutral"}
          >
            {STATUS_LABELS[status]}
          </Chip>
        </Box>
      }
      actions={modalActions}
      size="sm"
      maxWidth={600}
    >
      {/* Content */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Booking Info */}
        <Box>
          <Typography.Label size="sm" color="primary" bold sx={{ mb: 1.5 }}>
            Booking Information
          </Typography.Label>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DetailRow
              icon={<Hotel sx={{ fontSize: 20 }} />}
              label="Booking Type"
              value={
                booking.booking_type === "overnight"
                  ? "Overnight"
                  : "Short Stay"
              }
            />
            <DetailRow
              icon={<FlightTakeoff sx={{ fontSize: 20 }} />}
              label="Booking Source"
              value={booking.booking_source === "online" ? "Online" : "Walk-in"}
            />
            <DetailRow
              icon={<CalendarMonth sx={{ fontSize: 20 }} />}
              label="Check-in Date"
              value={booking.check_in_date}
            />
            <DetailRow
              icon={<CalendarMonth sx={{ fontSize: 20 }} />}
              label="Check-out Date"
              value={booking.check_out_date}
            />
            <DetailRow
              icon={<AccessTime sx={{ fontSize: 20 }} />}
              label="Check-in Time"
              value={booking.check_in_time}
            />
            <DetailRow
              icon={<AccessTime sx={{ fontSize: 20 }} />}
              label="Check-out Time"
              value={booking.check_out_time}
            />
          </Box>
        </Box>

        <Divider />

        {/* Guest Info */}
        <Box>
          <Typography.Label size="sm" color="primary" bold sx={{ mb: 1.5 }}>
            Guest Information
          </Typography.Label>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DetailRow
              icon={<People sx={{ fontSize: 20 }} />}
              label="Total Pax"
              value={booking.pax}
            />
            <DetailRow
              icon={<Person sx={{ fontSize: 20 }} />}
              label="Adults"
              value={booking.num_adults}
            />
            <DetailRow
              icon={<ChildCare sx={{ fontSize: 20 }} />}
              label="Children"
              value={booking.num_children}
            />
            <DetailRow
              icon={<ChildFriendly sx={{ fontSize: 20 }} />}
              label="Infants"
              value={booking.num_infants}
            />
          </Box>
        </Box>

        <Divider />

        {/* Origin Breakdown */}
        <Box>
          <Typography.Label size="sm" color="primary" bold sx={{ mb: 1.5 }}>
            Guest Origin
          </Typography.Label>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <Box>
              <Typography.Label size="xs" color="default">
                Local
              </Typography.Label>
              <Typography.Body size="sm" color="dark">
                {booking.local_counts}
              </Typography.Body>
            </Box>
            <Box>
              <Typography.Label size="xs" color="default">
                Domestic
              </Typography.Label>
              <Typography.Body size="sm" color="dark">
                {booking.domestic_counts}
              </Typography.Body>
            </Box>
            <Box>
              <Typography.Label size="xs" color="default">
                Overseas
              </Typography.Label>
              <Typography.Body size="sm" color="dark">
                {booking.overseas_counts}
              </Typography.Body>
            </Box>
            <Box>
              <Typography.Label size="xs" color="default">
                Foreign
              </Typography.Label>
              <Typography.Body size="sm" color="dark">
                {booking.foreign_counts}
              </Typography.Body>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Payment Info */}
        <Box>
          <Typography.Label size="sm" color="primary" bold sx={{ mb: 1.5 }}>
            Payment
          </Typography.Label>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DetailRow
              icon={<AttachMoney sx={{ fontSize: 20 }} />}
              label="Total Price"
              value={`₱${booking.total_price.toLocaleString()}`}
            />
            <DetailRow
              icon={<AttachMoney sx={{ fontSize: 20 }} />}
              label="Balance"
              value={
                booking.balance != null
                  ? `₱${booking.balance.toLocaleString()}`
                  : "Fully Paid"
              }
            />
          </Box>
        </Box>

        {/* Trip Purpose */}
        {booking.trip_purpose && (
          <>
            <Divider />
            <Box>
              <Typography.Label size="xs" color="default">
                Trip Purpose
              </Typography.Label>
              <Typography.Body size="sm" color="dark">
                {booking.trip_purpose}
              </Typography.Body>
            </Box>
          </>
        )}
      </Box>
    </BaseModal>
  );
}
