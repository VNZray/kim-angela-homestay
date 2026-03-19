import { useState, useEffect, useMemo } from "react";
import { Box, Chip } from "@mui/joy";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Table from "@/components/ui/Table";
import type { TableColumn } from "@/components/ui/Table";
import Alert from "@/components/ui/Alert";
import Loading from "@/components/Loading";
import NoDataFound from "@/components/ui/NoDataFound";
import TransactionDetailsModal from "./components/TransactionDetailsModal";
import { getAllTransactions } from "@/services/transaction/TransactionService";
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

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Alert
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data);
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to load transactions.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<Transaction>[] = useMemo(
    () => [
      {
        id: "created_at",
        label: "Date",
        minWidth: 150,
        render: (_row, value) => (
          <Typography.Body size="sm">
            {new Date(value).toLocaleDateString()}
          </Typography.Body>
        ),
      },
      {
        id: "amount",
        label: "Amount",
        minWidth: 110,
        render: (_row, value) => (
          <Typography.Body size="sm" bold>
            ₱{value?.toLocaleString() ?? "—"}
          </Typography.Body>
        ),
      },
      {
        id: "payment_method",
        label: "Payment Method",
        minWidth: 130,
        render: (_row, value) => (
          <Typography.Body size="sm">
            {PAYMENT_METHOD_LABELS[value] ?? value}
          </Typography.Body>
        ),
      },
      {
        id: "reference_number",
        label: "Reference #",
        minWidth: 130,
        render: (_row, value) => (
          <Typography.Body size="sm">{value ?? "—"}</Typography.Body>
        ),
      },
      {
        id: "transaction_status",
        label: "Status",
        minWidth: 110,
        render: (_row, value) => (
          <Chip
            size="sm"
            variant="soft"
            color={STATUS_COLOR_MAP[value] ?? "neutral"}
          >
            {STATUS_LABELS[value as TransactionStatus] ?? value}
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
        <Typography.Header>Transactions</Typography.Header>
        <Typography.Body color="default" size="sm" sx={{ mt: 0.5 }}>
          View payment records. Click a row to see full transaction details.
        </Typography.Body>
      </Box>

      {/* Table */}
      {transactions.length === 0 ? (
        <NoDataFound
          icon="inbox"
          title="No Transactions Yet"
          size="large"
          message="Payment records will appear here once transactions are processed."
        />
      ) : (
        <Table<Transaction>
          columns={columns}
          data={transactions}
          rowKey="id"
          onRowClick={(row) => setSelectedTransaction(row)}
          rowsPerPage={10}
        />
      )}

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
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
