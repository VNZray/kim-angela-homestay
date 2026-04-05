import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";
import type { BookingGuestInfo } from "@/types/Booking";
import { Box } from "@mui/joy";
import { Trash2, UserPlus, Users } from "lucide-react";

interface GuestDetailsStepProps {
  guests: BookingGuestInfo[];
  onChange: (guests: BookingGuestInfo[]) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  isAuthenticated: boolean;
}

const CLASSIFICATIONS: BookingGuestInfo["classification"][] = [
  "adult",
  "minor",
  "infant",
  "toddler",
];

export default function GuestDetailsStep({
  guests,
  onChange,
  errors,
  onNext,
  onBack,
  isAuthenticated,
}: GuestDetailsStepProps) {
  const pax = guests.length + 1;

  const addGuest = () => {
    onChange([...guests, { name: "", classification: "adult", age: null }]);
  };

  const removeGuest = (idx: number) => {
    if (guests.length <= 1) return;
    onChange(guests.filter((_, i) => i !== idx));
  };

  const updateGuest = (
    idx: number,
    field: keyof BookingGuestInfo,
    value: string | number | null,
  ) => {
    const updated = guests.map((g, i) =>
      i === idx ? { ...g, [field]: value } : g,
    );
    onChange(updated);
  };

  return (
    <Container variant="outlined" padding="30px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Users size={20} />
          <Typography.CardTitle size="sm" color="dark">
            Guest Details
          </Typography.CardTitle>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.25,
          }}
        >
          <Typography.Label size="sm" color="primary" bold>
            {guests.length} {guests.length === 1 ? "Guest" : "Guests"}
          </Typography.Label>
          <Typography.Body size="xs" color="default">
            Total Pax: {pax} (you + {guests.length} guest
            {guests.length !== 1 ? "s" : ""})
          </Typography.Body>
        </Box>
      </Box>

      {!isAuthenticated && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 8,
            bgcolor: "rgba(25, 118, 210, 0.06)",
          }}
        >
          <Typography.Body size="xs" color="primary">
            You are counted as the primary guest. Add your companions below.
          </Typography.Body>
        </Box>
      )}

      {isAuthenticated && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 8,
            bgcolor: "rgba(25, 118, 210, 0.06)",
          }}
        >
          <Typography.Body size="xs" color="primary">
            Your profile is auto-filled as the primary guest. Add your
            companions below.
          </Typography.Body>
        </Box>
      )}

      {errors.guests && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 8,
            bgcolor: "rgba(199, 0, 48, 0.08)",
          }}
        >
          <Typography.Body size="xs" color="error">
            {errors.guests}
          </Typography.Body>
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {guests.map((guest, idx) => (
          <Container
            direction="row"
            key={idx}
            variant="outlined"
            padding="20px"
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Input
                name={`guest_${idx}_name`}
                value={guest.name}
                onChange={(e) => updateGuest(idx, "name", e.target.value)}
                placeholder={`Guest ${idx + 1} full name`}
                error={!!errors[`guest_${idx}_name`]}
                errorMessage={errors[`guest_${idx}_name`]}
              />
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <select
                  value={guest.classification}
                  onChange={(e) =>
                    updateGuest(idx, "classification", e.target.value)
                  }
                  style={{
                    flex: 2,
                    padding: "0.75rem 1rem",
                    borderRadius: 8,
                    border: "1px solid var(--joy-palette-neutral-700)",
                    backgroundColor: "var(--joy-palette-background-surface)",
                    color: "var(--joy-palette-text-primary)",
                    fontSize: "clamp(0.875rem, 2vw, 1rem)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {CLASSIFICATIONS.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={guest.age ?? ""}
                  onChange={(e) =>
                    updateGuest(
                      idx,
                      "age",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  placeholder="Age"
                  style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    borderRadius: 8,
                    border: "1px solid var(--joy-palette-neutral-700)",
                    backgroundColor: "var(--joy-palette-background-surface)",
                    color: "var(--joy-palette-text-primary)",
                    fontSize: "clamp(0.875rem, 2vw, 1rem)",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </Box>
            </Box>
            {guests.length > 1 && (
              <Button
                variant="soft"
                colorScheme="error"
                size="sm"
                onClick={() => removeGuest(idx)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </Container>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          colorScheme="primary"
          size="sm"
          startDecorator={<UserPlus size={16} />}
          onClick={addGuest}
        >
          Add Guest
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" colorScheme="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="solid" colorScheme="primary" onClick={onNext}>
          Next: Booking Details
        </Button>
      </Box>
    </Container>
  );
}
