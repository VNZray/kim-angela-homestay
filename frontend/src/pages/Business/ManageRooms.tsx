import { useState, useEffect } from "react";
import { Box } from "@mui/joy";
import { Add } from "@mui/icons-material";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/services/room/RoomService";
import type { Room } from "@/types/Room";
import Loading from "@/components/Loading";
import RoomModal from "./components/RoomModal";
import RoomManagementCard from "./components/RoomManagementCard";

export default function ManageRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  // Alert state
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data);
    } catch {
      showAlert("error", "Error", "Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (
    type: "success" | "error",
    title: string,
    message: string,
  ) => {
    setAlert({ open: true, type, title, message });
  };

  // Add Room
  const handleOpenAdd = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  // Edit Room
  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  // Submit (Add or Edit)
  const handleSubmit = async (payload: Omit<Room, "id">) => {
    try {
      setSubmitting(true);
      if (editingRoom) {
        await updateRoom(editingRoom.id, payload);
        showAlert("success", "Updated", "Room updated successfully!");
      } else {
        await createRoom(payload);
        showAlert("success", "Created", "Room added successfully!");
      }
      setModalOpen(false);
      setEditingRoom(null);
      await fetchRooms();
    } catch {
      showAlert(
        "error",
        "Error",
        editingRoom ? "Failed to update room." : "Failed to add room.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Room
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSubmitting(true);
      await deleteRoom(deleteTarget.id);
      setDeleteTarget(null);
      showAlert("success", "Deleted", "Room deleted successfully!");
      await fetchRooms();
    } catch {
      showAlert("error", "Error", "Failed to delete room.");
    } finally {
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

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography.Header>Manage Rooms</Typography.Header>
            <Typography.Body color="default" size="sm" sx={{ mt: 0.5 }}>
              Manage your accommodation rooms, update details, and set
              availability
            </Typography.Body>
          </Box>
          <Button
            variant="solid"
            colorScheme="primary"
            startDecorator={<Add />}
            onClick={handleOpenAdd}
          >
            Add Room
          </Button>
        </Box>
      </Box>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <Card
          colorScheme="light"
          elevation={1}
          sx={{ p: 6, textAlign: "center" }}
        >
          <Typography.CardTitle color="dark" size="md" sx={{ mb: 1 }}>
            No Rooms Yet
          </Typography.CardTitle>
          <Typography.Body color="default" size="sm">
            Start by adding your first room to manage.
          </Typography.Body>
          <Button
            variant="outlined"
            colorScheme="primary"
            startDecorator={<Add />}
            onClick={handleOpenAdd}
            sx={{ mt: 3 }}
          >
            Add Your First Room
          </Button>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {rooms.map((room) => (
            <RoomManagementCard
              key={room.id}
              room={room}
              onEdit={handleOpenEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </Box>
      )}

      {/* Room Modal (Add / Edit) */}
      <RoomModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRoom(null);
        }}
        onSubmit={handleSubmit}
        room={editingRoom}
        loading={submitting}
      />

      {/* Delete Confirmation */}
      <Alert
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        type="warning"
        title="Delete Room"
        message={`Are you sure you want to delete Room ${deleteTarget?.room_number ?? "this room"}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={submitting}
        buttonColorScheme="error"
      />

      {/* Success / Error Alert */}
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
