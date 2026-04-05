import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { Box } from "@mui/joy";
import { BookOpen, CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BookingSuccessProps {
  referenceId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  isGuest: boolean;
}

export default function BookingSuccess({
  referenceId,
  roomName,
  checkInDate,
  checkOutDate,
  totalPrice,
  isGuest,
}: BookingSuccessProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = referenceId;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container variant="outlined" padding="30px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          color: "var(--joy-palette-success-500, #28a745)",
        }}
      >
        <CheckCircle size={64} />
      </Box>

      <Typography.Header size="sm" color="success" sx={{ mb: 1 }}>
        Booking Submitted!
      </Typography.Header>
      <Typography.Body size="sm" color="default" sx={{ mb: 3 }}>
        Your booking has been received and is pending confirmation.
      </Typography.Body>

      {/* Reference ID */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 8,
          bgcolor: "var(--joy-palette-background-level1)",
          border: "1px dashed var(--joy-palette-neutral-400)",
        }}
      >
        <Typography.Label size="xs" color="default" sx={{ mb: 0.5 }}>
          Booking Reference ID
        </Typography.Label>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography.CardTitle size="md" color="primary" bold>
            {referenceId}
          </Typography.CardTitle>
          <Button
            variant="plain"
            colorScheme="primary"
            size="sm"
            onClick={handleCopy}
            sx={{ minWidth: "auto", px: 1 }}
          >
            <Copy size={16} />
          </Button>
        </Box>
        {copied && (
          <Typography.Body size="xs" color="success" sx={{ mt: 0.5 }}>
            Copied to clipboard!
          </Typography.Body>
        )}
      </Box>

      {/* Booking summary */}
      <Box
        sx={{
          textAlign: "left",
          p: 2,
          mb: 3,
          borderRadius: 8,
          border: "1px solid var(--joy-palette-neutral-200)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography.Label size="sm" color="default">
            Room
          </Typography.Label>
          <Typography.Body size="sm" color="dark" bold>
            {roomName}
          </Typography.Body>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography.Label size="sm" color="default">
            Check-in
          </Typography.Label>
          <Typography.Body size="sm" color="dark">
            {checkInDate}
          </Typography.Body>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography.Label size="sm" color="default">
            Check-out
          </Typography.Label>
          <Typography.Body size="sm" color="dark">
            {checkOutDate}
          </Typography.Body>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 1,
            borderTop: "1px dashed #ccc",
          }}
        >
          <Typography.Label size="sm" color="default">
            Total
          </Typography.Label>
          <Typography.CardTitle size="sm" color="primary">
            ₱{totalPrice.toLocaleString()}
          </Typography.CardTitle>
        </Box>
      </Box>

      {isGuest && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 8,
            bgcolor: "rgba(91, 192, 222, 0.08)",
          }}
        >
          <Typography.Body size="xs" color="info">
            Save your reference ID! You can track your booking anytime on the
            &quot;My Bookings&quot; page using your email or reference ID.
          </Typography.Body>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="solid"
          colorScheme="primary"
          startDecorator={<BookOpen size={16} />}
          onClick={() => navigate("/my-bookings")}
        >
          View My Bookings
        </Button>
        <Button
          variant="outlined"
          colorScheme="secondary"
          onClick={() => navigate("/rooms")}
        >
          Browse More Rooms
        </Button>
      </Box>
    </Container>
  );
}
