import { useState, useEffect } from "react";
import { Box, IconButton, Stack, Alert as JoyAlert } from "@mui/joy";
import { Add, Edit, Delete, CheckCircle, Warning } from "@mui/icons-material";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getAllRooms, deleteRoom } from "@/services/room/RoomService";
import type { Room } from "@/types/Room";
import Loading from "@/components/Loading";

/**
 * ManageRooms Page
 * Business page for managing accommodation rooms
 * Allows business owners to add, edit, and delete rooms
 */
export default function ManageRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await deleteRoom(id);
      setSuccess("Room deleted successfully!");
      fetchRooms(); // Refresh the list
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting room:", err);
      setError("Failed to delete room. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (room: Room) => {
    // TODO: Implement edit modal/form
    console.log("Edit room:", room.id);
    alert("Edit functionality coming soon!");
  };

  const handleAdd = () => {
    // TODO: Implement add modal/form
    console.log("Add new room");
    alert("Add room functionality coming soon!");
  };

  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography.Header>Manage Rooms</Typography.Header>
          <Button
            variant="solid"
            colorScheme="primary"
            startDecorator={<Add />}
            onClick={handleAdd}
          >
            Add Room
          </Button>
        </Box>
        <Typography.Body color="default">
          Manage your accommodation rooms, update details, and set availability
        </Typography.Body>
      </Box>

      {/* Alert Messages */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <JoyAlert
            color="danger"
            startDecorator={<Warning />}
            variant="soft"
            endDecorator={
              <IconButton
                variant="plain"
                size="sm"
                color="danger"
                onClick={() => setError(null)}
              >
                ✕
              </IconButton>
            }
          >
            {error}
          </JoyAlert>
        </Box>
      )}
      {success && (
        <Box sx={{ mb: 2 }}>
          <JoyAlert
            color="success"
            startDecorator={<CheckCircle />}
            variant="soft"
            endDecorator={
              <IconButton
                variant="plain"
                size="sm"
                color="success"
                onClick={() => setSuccess(null)}
              >
                ✕
              </IconButton>
            }
          >
            {success}
          </JoyAlert>
        </Box>
      )}

      {/* Rooms List */}
      {rooms.length === 0 ? (
        <Card colorScheme="light" sx={{ p: 4, textAlign: "center" }}>
          <Typography.Body color="default">
            No rooms found. Start by adding your first room!
          </Typography.Body>
          <Button
            variant="outlined"
            colorScheme="primary"
            onClick={handleAdd}
            sx={{ mt: 2 }}
          >
            Add Your First Room
          </Button>
        </Card>
      ) : (
        <Stack spacing={2}>
          {rooms.map((room) => (
            <Card key={room.id} colorScheme="light" sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                {/* Room Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography.CardTitle size="md" color="dark">
                    {room.room_type || "Standard Room"} - Room{" "}
                    {room.room_number || "TBA"}
                  </Typography.CardTitle>
                  <Typography.Body size="sm" color="default" sx={{ mt: 1 }}>
                    {room.description || "No description available"}
                  </Typography.Body>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      mt: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography.Label size="xs" color="default">
                        Capacity
                      </Typography.Label>
                      <Typography.Body size="sm" color="dark">
                        {room.capacity || "N/A"} persons
                      </Typography.Body>
                    </Box>
                    <Box>
                      <Typography.Label size="xs" color="default">
                        Price
                      </Typography.Label>
                      <Typography.Body size="sm" color="dark">
                        ₱{room.room_price?.toLocaleString() || "N/A"}/night
                      </Typography.Body>
                    </Box>
                    <Box>
                      <Typography.Label size="xs" color="default">
                        Floor
                      </Typography.Label>
                      <Typography.Body size="sm" color="dark">
                        {room.floor || "N/A"}
                      </Typography.Body>
                    </Box>
                    <Box>
                      <Typography.Label size="xs" color="default">
                        Size
                      </Typography.Label>
                      <Typography.Body size="sm" color="dark">
                        {room.room_size || "N/A"}
                      </Typography.Body>
                    </Box>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    variant="outlined"
                    color="primary"
                    size="sm"
                    onClick={() => handleEdit(room)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(room.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}
