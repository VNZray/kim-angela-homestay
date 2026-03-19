import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  Chip,
} from "@mui/joy";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import BaseModal from "@/components/ui/BaseModal";
import type { Discount } from "@/types/Discount";
import type { Room } from "@/types/Room";

interface DiscountFormData {
  name: string;
  description: string;
  discount_percentage: string;
  promo_code: string;
  apply_to: "all" | "specific";
  room_ids: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit: string;
}

const INITIAL_FORM: DiscountFormData = {
  name: "",
  description: "",
  discount_percentage: "",
  promo_code: "",
  apply_to: "all",
  room_ids: [],
  start_date: "",
  end_date: "",
  is_active: true,
  usage_limit: "",
};

interface DiscountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Discount, "id" | "created_at" | "updated_at" | "used_count">,
  ) => Promise<void>;
  discount?: Discount | null;
  loading?: boolean;
  businessId: string;
  rooms: Room[];
}

export default function DiscountModal({
  open,
  onClose,
  onSubmit,
  discount,
  loading = false,
  businessId,
  rooms,
}: DiscountModalProps) {
  const isEditing = !!discount;
  const [form, setForm] = useState<DiscountFormData>(INITIAL_FORM);

  useEffect(() => {
    if (discount) {
      setForm({
        name: discount.name,
        description: discount.description ?? "",
        discount_percentage: discount.discount_percentage.toString(),
        promo_code: discount.promo_code ?? "",
        apply_to: discount.apply_to,
        room_ids: discount.room_ids ?? [],
        start_date: discount.start_date,
        end_date: discount.end_date,
        is_active: discount.is_active,
        usage_limit: discount.usage_limit?.toString() ?? "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [discount, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoomToggle = (roomId: string) => {
    setForm((prev) => ({
      ...prev,
      room_ids: prev.room_ids.includes(roomId)
        ? prev.room_ids.filter((id) => id !== roomId)
        : [...prev.room_ids, roomId],
    }));
  };

  const handleSubmit = async () => {
    const payload: Omit<
      Discount,
      "id" | "created_at" | "updated_at" | "used_count"
    > = {
      name: form.name,
      description: form.description || null,
      discount_percentage: parseInt(form.discount_percentage, 10),
      promo_code: form.promo_code || null,
      apply_to: form.apply_to,
      room_ids: form.apply_to === "all" ? [] : form.room_ids,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
      business_id: discount?.business_id ?? businessId,
    };

    await onSubmit(payload);
  };

  const isFormValid =
    form.name.trim() !== "" &&
    form.discount_percentage !== "" &&
    parseInt(form.discount_percentage, 10) >= 1 &&
    parseInt(form.discount_percentage, 10) <= 100 &&
    form.start_date !== "" &&
    form.end_date !== "" &&
    (form.apply_to === "all" || form.room_ids.length > 0);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Discount" : "Create New Discount"}
      description={
        isEditing
          ? "Update the discount details below"
          : "Set up a new discount for your rooms"
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
          label: isEditing ? "Save Changes" : "Create Discount",
          onClick: handleSubmit,
          variant: "solid",
          colorScheme: "primary",
          disabled: loading || !isFormValid,
        },
      ]}
      size="sm"
      maxWidth={560}
    >
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Discount Name */}
        <FormControl required>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Discount Name
            </Typography.Label>
          </FormLabel>
          <Input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="e.g. Summer Sale, Early Bird Discount"
          />
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Description
            </Typography.Label>
          </FormLabel>
          <Textarea
            name="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Brief description of the discount..."
            minRows={2}
            maxRows={4}
          />
        </FormControl>

        {/* Discount Percentage */}
        <FormControl required>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Discount Percentage (%)
            </Typography.Label>
          </FormLabel>
          <Input
            name="discount_percentage"
            type="number"
            value={form.discount_percentage}
            onChange={handleInputChange}
            placeholder="e.g. 10, 25, 50"
          />
        </FormControl>

        {/* Promo Code */}
        <FormControl>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Promo Code (Optional)
            </Typography.Label>
          </FormLabel>
          <Input
            name="promo_code"
            value={form.promo_code}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                promo_code: e.target.value.toUpperCase(),
              }))
            }
            placeholder="e.g. SUMMER2026, EARLYBIRD"
          />
        </FormControl>

        {/* Apply To - Toggle between All Rooms and Specific Rooms */}
        <FormControl required>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Apply To
            </Typography.Label>
          </FormLabel>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              variant={form.apply_to === "all" ? "solid" : "outlined"}
              color={form.apply_to === "all" ? "primary" : "neutral"}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  apply_to: "all",
                  room_ids: [],
                }))
              }
              sx={{ cursor: "pointer", px: 2 }}
            >
              All Rooms
            </Chip>
            <Chip
              variant={form.apply_to === "specific" ? "solid" : "outlined"}
              color={form.apply_to === "specific" ? "primary" : "neutral"}
              onClick={() =>
                setForm((prev) => ({ ...prev, apply_to: "specific" }))
              }
              sx={{ cursor: "pointer", px: 2 }}
            >
              Specific Rooms
            </Chip>
          </Box>
        </FormControl>

        {/* Room Selection - Only show when 'specific' is selected */}
        {form.apply_to === "specific" && (
          <FormControl required>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Select Rooms
              </Typography.Label>
            </FormLabel>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 200,
                overflowY: "auto",
                border: "1px solid",
                borderColor: "neutral.300",
                borderRadius: "8px",
                p: 1.5,
              }}
            >
              {rooms.length === 0 ? (
                <Typography.Body size="sm" color="default">
                  No rooms available
                </Typography.Body>
              ) : (
                rooms.map((room) => (
                  <Checkbox
                    key={room.id}
                    label={`Room ${room.room_number ?? "N/A"} - ${room.room_type ?? "Standard"} (₱${room.room_price ?? 0})`}
                    checked={form.room_ids.includes(room.id)}
                    onChange={() => handleRoomToggle(room.id)}
                    size="sm"
                  />
                ))
              )}
            </Box>
            {form.room_ids.length > 0 && (
              <Typography.Body size="xs" color="default" sx={{ mt: 0.5 }}>
                {form.room_ids.length} room(s) selected
              </Typography.Body>
            )}
          </FormControl>
        )}

        {/* Date Range */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl required sx={{ flex: 1 }}>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Start Date
              </Typography.Label>
            </FormLabel>
            <Input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl required sx={{ flex: 1 }}>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                End Date
              </Typography.Label>
            </FormLabel>
            <Input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleInputChange}
            />
          </FormControl>
        </Box>

        {/* Usage Limit */}
        <FormControl>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Usage Limit (Optional)
            </Typography.Label>
          </FormLabel>
          <Input
            name="usage_limit"
            type="number"
            value={form.usage_limit}
            onChange={handleInputChange}
            placeholder="Leave empty for unlimited"
          />
        </FormControl>

        {/* Active Status */}
        <Checkbox
          label="Active"
          checked={form.is_active}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, is_active: e.target.checked }))
          }
          size="sm"
        />
      </Box>
    </BaseModal>
  );
}
