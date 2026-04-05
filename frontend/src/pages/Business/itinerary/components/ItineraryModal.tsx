import { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, Textarea } from "@mui/joy";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import BaseModal from "@/components/ui/BaseModal";
import type { ItineraryPackage } from "@/types/Itinerary";
import type { OvernightDuration } from "@/types/Booking";

interface ItineraryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<ItineraryPackage, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  itinerary?: ItineraryPackage | null;
  loading?: boolean;
  businessId: string;
}

const OVERNIGHT_OPTIONS: { value: OvernightDuration; label: string }[] = [
  { value: "1D2N", label: "1 Day 2 Nights" },
  { value: "2D3N", label: "2 Days 3 Nights" },
  { value: "3D4N", label: "3 Days 4 Nights" },
  { value: "4D5N", label: "4 Days 5 Nights" },
  { value: "5D6N", label: "5 Days 6 Nights" },
  { value: "6D7N", label: "6 Days 7 Nights" },
];

export default function ItineraryModal({
  open,
  onClose,
  onSubmit,
  itinerary,
  loading = false,
  businessId,
}: ItineraryModalProps) {
  const isEditing = !!itinerary;
  const [code, setCode] = useState<string>("1D2N");
  const [label, setLabel] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (itinerary) {
      setCode(itinerary.code);
      setLabel(itinerary.label ?? "");
      setContent(itinerary.content ?? "");
    } else {
      setCode("1D2N");
      setLabel("");
      setContent("");
    }
  }, [itinerary, open]);

  const handleSubmit = async () => {
    await onSubmit({
      business_id: itinerary?.business_id ?? businessId,
      code,
      label,
      content,
    });
  };

  const isFormValid = code.trim() !== "";

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Itinerary" : "Create New Itinerary"}
      description={
        isEditing
          ? "Update itinerary for the selected duration"
          : "Create an itinerary package for a duration (e.g., 3D2N)"
      }
      actions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
          colorScheme: "secondary",
          disabled: loading,
        },
        {
          label: isEditing ? "Save Changes" : "Create Itinerary",
          onClick: handleSubmit,
          variant: "solid",
          colorScheme: "primary",
          disabled: loading || !isFormValid,
        },
      ]}
      size="sm"
      maxWidth={720}
    >
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        <FormControl required>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Duration Code
            </Typography.Label>
          </FormLabel>
          <select
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--joy-palette-neutral-700)",
              backgroundColor: "var(--joy-palette-background-surface)",
              color: "var(--joy-palette-text-primary)",
            }}
          >
            {OVERNIGHT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} ({o.value})
              </option>
            ))}
          </select>
        </FormControl>

        <FormControl>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Label (optional)
            </Typography.Label>
          </FormLabel>
          <Input
            name="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional display label e.g. 3 days & 2 nights"
          />
        </FormControl>

        <FormControl>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Itinerary Content
            </Typography.Label>
          </FormLabel>
          <Textarea
            minRows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              "Enter itinerary text. Use new lines for separate entries. Example:\nDay 1: 9:00 - Arrival\nDay 1: 12:00 - Lunch\nDay 2: 08:00 - Breakfast"
            }
          />
        </FormControl>
      </Box>
    </BaseModal>
  );
}
