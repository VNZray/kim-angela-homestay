import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, AspectRatio, Chip, Divider } from "@mui/joy";
import {
  ArrowBack,
  Edit,
  Delete,
  Hotel,
  AttachMoney,
  Schedule,
  Layers,
  Maximize,
  People,
} from "@mui/icons-material";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Loading from "@/components/Loading";
import RoomModal from "./components/RoomModal";
import {
  getRoomById,
  updateRoom,
  deleteRoom,
} from "@/services/room/RoomService";
import type { Room } from "@/types/Room";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x500/e2e8f0/64748b?text=No+Room+Image";

export default function RoomProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Alert
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  const fetchRoom = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getRoomById(id);
      setRoom(data);
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to load room details.",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  const handleUpdate = async (payload: Omit<Room, "id">) => {
    if (!room) return;
    try {
      setSubmitting(true);
      const updated = await updateRoom(room.id, payload);
      setRoom(updated);
      setEditModalOpen(false);
      setAlert({
        open: true,
        type: "success",
        title: "Updated",
        message: "Room updated successfully!",
      });
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update room.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!room) return;
    try {
      setSubmitting(true);
      await deleteRoom(room.id);
      setDeleteConfirmOpen(false);
      navigate("/business/rooms", { replace: true });
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to delete room.",
      });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }

  if (!room) {
    return (
      <PageContainer>
        <Card
          colorScheme="light"
          elevation={1}
          sx={{ p: 4, textAlign: "center" }}
        >
          <Typography.CardTitle color="dark" size="md" sx={{ mb: 1 }}>
            Room Not Found
          </Typography.CardTitle>
          <Typography.Body color="default" size="sm">
            The room you're looking for doesn't exist or has been removed.
          </Typography.Body>
          <Button
            variant="outlined"
            colorScheme="primary"
            onClick={() => navigate("/business/rooms")}
            sx={{ mt: 2 }}
          >
            Back to Rooms
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const details = [
    {
      icon: <People sx={{ fontSize: 20 }} />,
      label: "Capacity",
      value: room.capacity ? `${room.capacity} persons` : "—",
    },
    {
      icon: <Maximize sx={{ fontSize: 20 }} />,
      label: "Room Size",
      value: room.room_size ?? "—",
    },
    {
      icon: <Layers sx={{ fontSize: 20 }} />,
      label: "Floor",
      value: room.floor ? `Floor ${room.floor}` : "—",
    },
    {
      icon: <AttachMoney sx={{ fontSize: 20 }} />,
      label: "Price / Night",
      value: room.room_price ? `₱${room.room_price.toLocaleString()}` : "—",
    },
    {
      icon: <Schedule sx={{ fontSize: 20 }} />,
      label: "Per Hour Rate",
      value: room.per_hour_rate
        ? `₱${room.per_hour_rate.toLocaleString()}`
        : "—",
    },
    {
      icon: <Hotel sx={{ fontSize: 20 }} />,
      label: "Room Type",
      value: room.room_type ?? "—",
    },
  ];

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      {/* Back & Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Button
          variant="plain"
          colorScheme="dark"
          startDecorator={<ArrowBack />}
          onClick={() => navigate("/business/rooms")}
        >
          Back to Rooms
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            startDecorator={<Edit sx={{ fontSize: 18 }} />}
            onClick={() => setEditModalOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            colorScheme="error"
            startDecorator={<Delete sx={{ fontSize: 18 }} />}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Left: Image Section */}
        <Card
          colorScheme="light"
          elevation={2}
          sx={{ p: 0, overflow: "hidden" }}
        >
          <AspectRatio ratio="16/10">
            <img
              src={room.room_profile || PLACEHOLDER_IMAGE}
              alt={`Room ${room.room_number}`}
              style={{ objectFit: "cover" }}
            />
          </AspectRatio>
        </Card>

        {/* Right: Info Section */}
        <Card colorScheme="light" elevation={2} sx={{ p: 3 }}>
          {/* Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Typography.Header color="dark" size="sm">
              Room {room.room_number || "TBA"}
            </Typography.Header>
            {room.room_type && (
              <Chip size="sm" variant="solid" color="warning">
                {room.room_type}
              </Chip>
            )}
          </Box>

          {/* Price Highlight */}
          <Typography.CardTitle size="md" color="primary" sx={{ mb: 2 }}>
            ₱{room.room_price?.toLocaleString() ?? "—"}
            <Typography.Body size="sm" color="default">
              {" "}
              / night
            </Typography.Body>
          </Typography.CardTitle>

          <Divider sx={{ my: 2 }} />

          {/* Details Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2.5,
            }}
          >
            {details.map((item) => (
              <Box
                key={item.label}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <Box sx={{ color: "var(--joy-palette-primary-500)", mt: 0.25 }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography.Label size="xs" color="default">
                    {item.label}
                  </Typography.Label>
                  <Typography.Body size="sm" color="dark">
                    {item.value}
                  </Typography.Body>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>

      {/* Description Section */}
      <Card colorScheme="light" elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography.CardTitle size="sm" color="dark" sx={{ mb: 1.5 }}>
          Description
        </Typography.CardTitle>
        <Typography.Body color="default" size="sm">
          {room.description || "No description available for this room."}
        </Typography.Body>
      </Card>

      {/* Edit Modal */}
      <RoomModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        room={room}
        loading={submitting}
      />

      {/* Delete Confirmation */}
      <Alert
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        type="warning"
        title="Delete Room"
        message={`Are you sure you want to delete Room ${room.room_number ?? "this room"}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={submitting}
        buttonColorScheme="error"
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
