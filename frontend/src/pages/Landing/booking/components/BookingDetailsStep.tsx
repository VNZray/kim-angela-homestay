import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import type { OvernightDuration, StayType } from "@/types/Booking";
import type { Room } from "@/types/Room";
import { getColors } from "@/utils/Colors";
import { Box, useColorScheme } from "@mui/joy";
import { CalendarDays, Clock, Compass, MapPin, Moon, Sun } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { getItineraryByBusinessAndCode } from "@/services/itinerary/ItineraryService";

interface BookingDetailsStepProps {
  room: Room;
  stayType: StayType;
  arrivalDate: string;
  durationHours: number;
  overnightDuration: OvernightDuration;
  tripPurpose: string;
  foreignCounts: number;
  domesticCounts: number;
  overseasCounts: number;
  localCounts: number;
  pax: number;
  onChange: (field: string, value: string | number) => void;
  errors: Record<string, string>;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

const OVERNIGHT_OPTIONS: {
  value: OvernightDuration;
  label: string;
  nights: number;
}[] = [
  { value: "1D2N", label: "1 Day 2 Nights", nights: 2 },
  { value: "2D3N", label: "2 Days 3 Nights", nights: 3 },
  { value: "3D4N", label: "3 Days 4 Nights", nights: 4 },
  { value: "4D5N", label: "4 Days 5 Nights", nights: 5 },
  { value: "5D6N", label: "5 Days 6 Nights", nights: 6 },
  { value: "6D7N", label: "6 Days 7 Nights", nights: 7 },
];

const HOUR_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12];

export function computeCheckOut(
  arrivalDate: string,
  stayType: StayType,
  overnightDuration: OvernightDuration,
  durationHours: number,
): { checkOutDate: string; checkOutTime: string; checkInTime: string } {
  if (!arrivalDate) {
    return { checkOutDate: "", checkOutTime: "", checkInTime: "" };
  }

  if (stayType === "overnight") {
    const nights =
      OVERNIGHT_OPTIONS.find((o) => o.value === overnightDuration)?.nights ?? 2;
    const arrival = new Date(arrivalDate);
    arrival.setDate(arrival.getDate() + nights);
    const checkOutDate = arrival.toISOString().split("T")[0];
    return { checkOutDate, checkOutTime: "12:00", checkInTime: "14:00" };
  }

  // Short stay
  const checkInTime = "08:00";
  const [hours] = checkInTime.split(":").map(Number);
  const endHour = hours + durationHours;
  const checkOutTime = `${String(endHour % 24).padStart(2, "0")}:00`;

  return { checkOutDate: arrivalDate, checkOutTime, checkInTime };
}

const TRIP_PURPOSES = [
  "leisure",
  "business",
  "family",
  "celebration",
  "honeymoon",
  "adventure",
  "other",
];

export default function BookingDetailsStep({
  room,
  stayType,
  arrivalDate,
  durationHours,
  overnightDuration,
  tripPurpose,
  foreignCounts,
  domesticCounts,
  overseasCounts,
  localCounts,
  pax,
  onChange,
  errors,
  onSubmit,
  onBack,
  submitting,
}: BookingDetailsStepProps) {
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  const [itinerary, setItinerary] = useState<string | null>(null);
  const [itineraryLoading, setItineraryLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (stayType !== "overnight" || !room?.business_id) {
        if (mounted) setItinerary(null);
        return;
      }
      setItineraryLoading(true);
      try {
        const pkg = await getItineraryByBusinessAndCode(
          room.business_id ?? "",
          overnightDuration,
        );
        if (mounted) setItinerary(pkg?.content ?? null);
      } catch (err) {
        console.error("Failed to load itinerary:", err);
        if (mounted) setItinerary(null);
      } finally {
        if (mounted) setItineraryLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [room?.business_id, overnightDuration, stayType]);

  const today = new Date().toISOString().split("T")[0];

  const { checkOutDate, checkOutTime, checkInTime } = useMemo(
    () =>
      computeCheckOut(arrivalDate, stayType, overnightDuration, durationHours),
    [arrivalDate, stayType, overnightDuration, durationHours],
  );

  const totalPrice = useMemo(() => {
    if (stayType === "overnight") {
      const nights =
        OVERNIGHT_OPTIONS.find((o) => o.value === overnightDuration)?.nights ??
        2;
      return (room.room_price ?? 0) * nights;
    }
    return (room.per_hour_rate ?? 0) * durationHours;
  }, [stayType, overnightDuration, durationHours, room]);

  return (
    <Container variant="outlined">
      <Typography.CardTitle size="sm" color="dark" sx={{ mb: 3 }}>
        Booking Details
      </Typography.CardTitle>

      {/* Room info */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 8,
          bgcolor: `${colors.primary}08`,
          border: `1px solid ${colors.primary}20`,
        }}
      >
        <Typography.Label size="sm" color="primary" bold>
          {room.room_type || "Standard Room"}
          {room.room_number ? ` — Room ${room.room_number}` : ""}
        </Typography.Label>
        <Typography.Body size="xs" color="default" sx={{ mt: 0.5 }}>
          Capacity: {room.capacity ?? "—"} persons | ₱
          {room.room_price?.toLocaleString() ?? "—"}/night | ₱
          {room.per_hour_rate?.toLocaleString() ?? "—"}/hour
        </Typography.Body>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Stay type */}
        <Box>
          <Typography.Label size="sm" color="dark" sx={{ mb: 1 }}>
            Stay Type *
          </Typography.Label>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              onClick={() => onChange("stayType", "overnight")}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 8,
                border: `2px solid ${stayType === "overnight" ? colors.primary : mode === "dark" ? "#555" : "#ddd"}`,
                bgcolor:
                  stayType === "overnight"
                    ? `${colors.primary}10`
                    : "transparent",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <Moon
                size={20}
                style={{
                  color: stayType === "overnight" ? colors.primary : undefined,
                }}
              />
              <Typography.Label
                size="sm"
                bold={stayType === "overnight"}
                color={stayType === "overnight" ? "primary" : "default"}
                sx={{ mt: 0.5 }}
              >
                Overnight
              </Typography.Label>
            </Box>
            <Box
              onClick={() => onChange("stayType", "short-stay")}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 8,
                border: `2px solid ${stayType === "short-stay" ? colors.primary : mode === "dark" ? "#555" : "#ddd"}`,
                bgcolor:
                  stayType === "short-stay"
                    ? `${colors.primary}10`
                    : "transparent",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <Sun
                size={20}
                style={{
                  color: stayType === "short-stay" ? colors.primary : undefined,
                }}
              />
              <Typography.Label
                size="sm"
                bold={stayType === "short-stay"}
                color={stayType === "short-stay" ? "primary" : "default"}
                sx={{ mt: 0.5 }}
              >
                Short Stay
              </Typography.Label>
            </Box>
          </Box>
        </Box>

        {/* Itinerary preview (overnight only) */}
        {stayType === "overnight" && (
          <Box sx={{ mt: 1 }}>
            <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
              Itinerary
            </Typography.Label>
            <Box
              sx={{
                p: 2,
                borderRadius: 8,
                border: `1px solid ${mode === "dark" ? "#374151" : "#E5E7EB"}`,
              }}
            >
              {itineraryLoading ? (
                <Typography.Body size="xs">
                  Loading itinerary...
                </Typography.Body>
              ) : itinerary ? (
                <Typography.Body size="xs" sx={{ whiteSpace: "pre-wrap" }}>
                  {itinerary}
                </Typography.Body>
              ) : (
                <Typography.Body size="xs" color="default">
                  None
                </Typography.Body>
              )}
            </Box>
          </Box>
        )}

        {/* Arrival date */}
        <Box>
          <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
            Arrival Date *
          </Typography.Label>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarDays
              size={18}
              style={{ color: colors.primary, flexShrink: 0 }}
            />
            <input
              type="date"
              value={arrivalDate}
              min={today}
              onChange={(e) => onChange("arrivalDate", e.target.value)}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: 8,
                border: errors.arrivalDate
                  ? "1px solid var(--joy-palette-danger-500)"
                  : "1px solid var(--joy-palette-neutral-700)",
                backgroundColor: "var(--joy-palette-background-surface)",
                color: "var(--joy-palette-text-primary)",
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                outline: "none",
              }}
            />
          </Box>
          {errors.arrivalDate && (
            <Typography.Body size="xs" color="error" sx={{ mt: 0.5 }}>
              {errors.arrivalDate}
            </Typography.Body>
          )}
        </Box>

        {/* Duration */}
        <Box>
          <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
            Duration *
          </Typography.Label>
          {stayType === "overnight" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Moon
                size={18}
                style={{ color: colors.primary, flexShrink: 0 }}
              />
              <select
                value={overnightDuration}
                onChange={(e) => onChange("overnightDuration", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: 8,
                  border: "1px solid var(--joy-palette-neutral-700)",
                  backgroundColor: "var(--joy-palette-background-surface)",
                  color: "var(--joy-palette-text-primary)",
                  fontSize: "clamp(0.875rem, 2vw, 1rem)",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {OVERNIGHT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Clock
                size={18}
                style={{ color: colors.primary, flexShrink: 0 }}
              />
              <select
                value={durationHours}
                onChange={(e) =>
                  onChange("durationHours", Number(e.target.value))
                }
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: 8,
                  border: "1px solid var(--joy-palette-neutral-700)",
                  backgroundColor: "var(--joy-palette-background-surface)",
                  color: "var(--joy-palette-text-primary)",
                  fontSize: "clamp(0.875rem, 2vw, 1rem)",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {HOUR_OPTIONS.map((h) => (
                  <option key={h} value={h}>
                    {h} hours
                  </option>
                ))}
              </select>
            </Box>
          )}
        </Box>

        {/* Trip Purpose */}
        <Box>
          <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
            Trip Purpose *
          </Typography.Label>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Compass
              size={18}
              style={{ color: colors.primary, flexShrink: 0 }}
            />
            <select
              value={tripPurpose}
              onChange={(e) => onChange("tripPurpose", e.target.value)}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: 8,
                border: "1px solid var(--joy-palette-neutral-700)",
                backgroundColor: "var(--joy-palette-background-surface)",
                color: "var(--joy-palette-text-primary)",
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {TRIP_PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </Box>
        </Box>

        {/* Guest Origin Breakdown */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <MapPin
              size={18}
              style={{ color: colors.primary, flexShrink: 0 }}
            />
            <Typography.Label size="sm" color="dark">
              Guest Origin Breakdown
            </Typography.Label>
          </Box>
          <Typography.Body size="xs" color="default" sx={{ mb: 1.5 }}>
            Total pax: {pax}. Distribute counts below (should sum to {pax}).
          </Typography.Body>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
          >
            <Box>
              <Typography.Body size="xs" color="default" sx={{ mb: 0.5 }}>
                Foreign
              </Typography.Body>
              <input
                type="number"
                min={0}
                max={pax}
                value={foreignCounts}
                onChange={(e) =>
                  onChange("foreignCounts", Math.max(0, Number(e.target.value)))
                }
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
            <Box>
              <Typography.Body size="xs" color="default" sx={{ mb: 0.5 }}>
                Domestic
              </Typography.Body>
              <input
                type="number"
                min={0}
                max={pax}
                value={domesticCounts}
                onChange={(e) =>
                  onChange(
                    "domesticCounts",
                    Math.max(0, Number(e.target.value)),
                  )
                }
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
            <Box>
              <Typography.Body size="xs" color="default" sx={{ mb: 0.5 }}>
                Overseas
              </Typography.Body>
              <input
                type="number"
                min={0}
                max={pax}
                value={overseasCounts}
                onChange={(e) =>
                  onChange(
                    "overseasCounts",
                    Math.max(0, Number(e.target.value)),
                  )
                }
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
            <Box>
              <Typography.Body size="xs" color="default" sx={{ mb: 0.5 }}>
                Local
              </Typography.Body>
              <input
                type="number"
                min={0}
                max={pax}
                value={localCounts}
                onChange={(e) =>
                  onChange("localCounts", Math.max(0, Number(e.target.value)))
                }
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
          </Box>
          {errors.originCounts && (
            <Typography.Body size="xs" color="error" sx={{ mt: 0.5 }}>
              {errors.originCounts}
            </Typography.Body>
          )}
        </Box>

        {/* Computed checkout */}
        {arrivalDate && (
          <Box
            sx={{
              p: 2,
              borderRadius: 8,
              bgcolor: `${colors.success}10`,
              border: `1px solid ${colors.success}30`,
            }}
          >
            <Typography.Label size="sm" color="success" bold sx={{ mb: 1 }}>
              Booking Summary
            </Typography.Label>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography.Body size="xs" color="default">
                Check-in: {arrivalDate} at {checkInTime}
              </Typography.Body>
              <Typography.Body size="xs" color="default">
                Check-out: {checkOutDate} at {checkOutTime}
              </Typography.Body>
              <Typography.Body size="xs" color="default">
                Duration:{" "}
                {stayType === "overnight"
                  ? overnightDuration
                      .replace("D", " Day ")
                      .replace("N", " Nights")
                  : `${durationHours} hours`}
              </Typography.Body>
              <Typography.Body size="xs" color="default">
                Total Pax: {pax}
              </Typography.Body>
              <Typography.Body size="xs" color="default">
                Purpose:{" "}
                {tripPurpose.charAt(0).toUpperCase() + tripPurpose.slice(1)}
              </Typography.Body>
              <Box sx={{ mt: 1, pt: 1, borderTop: "1px dashed #ccc" }}>
                <Typography.CardTitle size="sm" color="primary">
                  Total: ₱{totalPrice.toLocaleString()}
                </Typography.CardTitle>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" colorScheme="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={onSubmit}
          loading={submitting}
        >
          Confirm Booking
        </Button>
      </Box>
    </Container>
  );
}
