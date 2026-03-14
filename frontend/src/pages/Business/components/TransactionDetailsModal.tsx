import { Box, Divider, Chip } from "@mui/joy";
import {
  AttachMoney,
  CreditCard,
  Receipt,
  CalendarMonth,
  Notes,
} from "@mui/icons-material";
import Typography from "@/components/ui/Typography";
import BaseModal from "@/components/ui/BaseModal";
import type { Transaction, TransactionStatus } from "@/types/Transaction";

const STATUS_COLOR_MAP: Record<
  string,
  "warning" | "success" | "danger" | "neutral"
> = {
  pending: "warning",
  completed: "success",
  failed: "danger",
  refunded: "neutral",
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  gcash: "GCash",
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  other: "Other",
};

interface TransactionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDetailsModal({
  open,
  onClose,
  transaction,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

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

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      headerContent={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography.CardTitle size="md" color="dark">
            Transaction Details
          </Typography.CardTitle>
          <Chip
            size="sm"
            variant="soft"
            color={
              STATUS_COLOR_MAP[transaction.transaction_status] ?? "neutral"
            }
          >
            {STATUS_LABELS[transaction.transaction_status]}
          </Chip>
        </Box>
      }
      size="sm"
      maxWidth={520}
    >
      {/* Content */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Transaction Info */}
        <Box>
          <Typography.Label size="sm" color="primary" bold sx={{ mb: 1.5 }}>
            Payment Information
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
              label="Amount"
              value={`₱${transaction.amount.toLocaleString()}`}
            />
            <DetailRow
              icon={<CreditCard sx={{ fontSize: 20 }} />}
              label="Payment Method"
              value={
                PAYMENT_METHOD_LABELS[transaction.payment_method] ??
                transaction.payment_method
              }
            />
            <DetailRow
              icon={<Receipt sx={{ fontSize: 20 }} />}
              label="Reference Number"
              value={transaction.reference_number ?? "—"}
            />
            <DetailRow
              icon={<Receipt sx={{ fontSize: 20 }} />}
              label="Booking ID"
              value={
                <Typography.Body size="xs" color="default">
                  {transaction.booking_id}
                </Typography.Body>
              }
            />
          </Box>
        </Box>

        <Divider />

        {/* Timestamps */}
        <Box>
          <Typography.Label size="sm" color="primary" bold sx={{ mb: 1.5 }}>
            Timestamps
          </Typography.Label>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DetailRow
              icon={<CalendarMonth sx={{ fontSize: 20 }} />}
              label="Created At"
              value={new Date(transaction.created_at).toLocaleString()}
            />
            <DetailRow
              icon={<CalendarMonth sx={{ fontSize: 20 }} />}
              label="Updated At"
              value={new Date(transaction.updated_at).toLocaleString()}
            />
          </Box>
        </Box>

        {/* Notes */}
        {transaction.notes && (
          <>
            <Divider />
            <Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box sx={{ color: "var(--joy-palette-primary-500)", mt: 0.25 }}>
                  <Notes sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography.Label size="xs" color="default">
                    Notes
                  </Typography.Label>
                  <Typography.Body size="sm" color="dark">
                    {transaction.notes}
                  </Typography.Body>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </BaseModal>
  );
}
