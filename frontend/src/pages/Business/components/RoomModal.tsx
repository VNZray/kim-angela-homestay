import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Option,
} from "@mui/joy";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import BaseModal from "@/components/ui/BaseModal";
import type { Room } from "@/types/Room";

interface RoomFormData {
  room_number: string;
  room_type: string;
  capacity: string;
  room_size: string;
  room_price: string;
  per_hour_rate: string;
  floor: string;
  description: string;
}

const INITIAL_FORM: RoomFormData = {
  room_number: "",
  room_type: "",
  capacity: "",
  room_size: "",
  room_price: "",
  per_hour_rate: "",
  floor: "",
  description: "",
};

const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Family",
  "Suite",
  "Twin",
  "Single",
  "Double",
];

interface RoomModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Room, "id">) => Promise<void>;
  room?: Room | null;
  loading?: boolean;
  businessId?: string;
}

export default function RoomModal({
  open,
  onClose,
  onSubmit,
  room,
  loading = false,
  businessId,
}: RoomModalProps) {
  const isEditing = !!room;
  const [form, setForm] = useState<RoomFormData>(INITIAL_FORM);

  useEffect(() => {
    if (room) {
      setForm({
        room_number: room.room_number ?? "",
        room_type: room.room_type ?? "",
        capacity: room.capacity?.toString() ?? "",
        room_size: room.room_size ?? "",
        room_price: room.room_price?.toString() ?? "",
        per_hour_rate: room.per_hour_rate?.toString() ?? "",
        floor: room.floor?.toString() ?? "",
        description: room.description ?? "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [room, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const payload: Omit<Room, "id"> = {
      room_number: form.room_number || null,
      room_type: form.room_type || null,
      capacity: form.capacity ? parseInt(form.capacity, 10) : null,
      room_size: form.room_size || null,
      room_price: form.room_price ? parseFloat(form.room_price) : null,
      per_hour_rate: form.per_hour_rate ? parseFloat(form.per_hour_rate) : null,
      floor: form.floor ? parseInt(form.floor, 10) : null,
      description: form.description || null,
      room_profile: room?.room_profile ?? null,
      business_id: room?.business_id ?? businessId ?? null,
    };

    await onSubmit(payload);
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Room" : "Add New Room"}
      actions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
          colorScheme: "secondary",
          disabled: loading,
        },
        {
          label: isEditing ? "Save Changes" : "Add Room",
          onClick: handleSubmit,
          variant: "solid",
          colorScheme: "primary",
          disabled: loading,
        },
      ]}
      size="sm"
      maxWidth={560}
    >
      {/* Form */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Room Number & Type Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Room Number
              </Typography.Label>
            </FormLabel>
            <Input
              name="room_number"
              value={form.room_number}
              onChange={handleInputChange}
              placeholder="e.g. 101"
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Room Type
              </Typography.Label>
            </FormLabel>
            <Select
              size="lg"
              value={form.room_type}
              onChange={(_e, val) =>
                setForm((prev) => ({ ...prev, room_type: val ?? "" }))
              }
              placeholder="Select type"
              sx={{ borderRadius: "8px" }}
            >
              {ROOM_TYPES.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Capacity & Floor Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Capacity (persons)
              </Typography.Label>
            </FormLabel>
            <Input
              name="capacity"
              value={form.capacity}
              onChange={handleInputChange}
              placeholder="e.g. 4"
              type="number"
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Floor
              </Typography.Label>
            </FormLabel>
            <Input
              name="floor"
              value={form.floor}
              onChange={handleInputChange}
              placeholder="e.g. 2"
              type="number"
            />
          </FormControl>
        </Box>

        {/* Size & Price Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Room Size
              </Typography.Label>
            </FormLabel>
            <Input
              name="room_size"
              value={form.room_size}
              onChange={handleInputChange}
              placeholder="e.g. 25 sqm"
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Price per Night (₱)
              </Typography.Label>
            </FormLabel>
            <Input
              name="room_price"
              value={form.room_price}
              onChange={handleInputChange}
              placeholder="e.g. 1500"
              type="number"
            />
          </FormControl>
        </Box>

        {/* Per Hour Rate */}
        <FormControl>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Per Hour Rate (₱)
            </Typography.Label>
          </FormLabel>
          <Input
            name="per_hour_rate"
            value={form.per_hour_rate}
            onChange={handleInputChange}
            placeholder="e.g. 200"
            type="number"
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
            placeholder="Describe the room..."
            minRows={3}
            maxRows={5}
            sx={{ borderRadius: "8px" }}
          />
        </FormControl>
      </Box>
    </BaseModal>
  );
}
