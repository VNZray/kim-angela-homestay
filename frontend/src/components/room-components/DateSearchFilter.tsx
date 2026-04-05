import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { getColors } from "@/utils/Colors";
import { Box, useColorScheme } from "@mui/joy";
import { CalendarDays, Search, X } from "lucide-react";
import { useState } from "react";
import Container from "../Container";

interface DateSearchFilterProps {
  onFilter: (checkIn: string, checkOut: string) => void;
  onClear: () => void;
  isFiltered: boolean;
}

export default function DateSearchFilter({
  onFilter,
  onClear,
  isFiltered,
}: DateSearchFilterProps) {
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");
  const today = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;
    if (checkOut <= checkIn) return;
    onFilter(checkIn, checkOut);
  };

  const handleClear = () => {
    setCheckIn("");
    setCheckOut("");
    onClear();
  };

  return (
    <Container elevation={2} style={{ marginBottom: "20px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CalendarDays size={20} style={{ color: colors.primary }} />
        <Typography.CardTitle size="sm" color="dark">
          Search Available Rooms by Date
        </Typography.CardTitle>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 160 }}>
          <Typography.Label size="xs" color="default" sx={{ mb: 0.5 }}>
            Check-in Date
          </Typography.Label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && e.target.value >= checkOut) setCheckOut("");
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--joy-palette-neutral-700)",
              backgroundColor: "var(--joy-palette-background-surface)",
              color: "var(--joy-palette-text-primary)",
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              outline: "none",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 160 }}>
          <Typography.Label size="xs" color="default" sx={{ mb: 0.5 }}>
            Check-out Date
          </Typography.Label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--joy-palette-neutral-700)",
              backgroundColor: "var(--joy-palette-background-surface)",
              color: "var(--joy-palette-text-primary)",
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              outline: "none",
            }}
            disabled={!checkIn}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="solid"
            colorScheme="primary"
            startDecorator={<Search size={16} />}
            onClick={handleSearch}
            disabled={!checkIn || !checkOut}
          >
            Search
          </Button>
          {isFiltered && (
            <Button
              variant="outlined"
              colorScheme="secondary"
              startDecorator={<X size={16} />}
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {isFiltered && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 8,
            bgcolor: `${colors.success}10`,
            border: `1px solid ${colors.success}30`,
          }}
        >
          <Typography.Body size="xs" color="success">
            Showing rooms available from {checkIn} to {checkOut}
          </Typography.Body>
        </Box>
      )}
    </Container>
  );
}
