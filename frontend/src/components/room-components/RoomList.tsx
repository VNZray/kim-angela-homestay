import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/joy";
import RoomCard from "../cards/RoomCard";
import Typography from "../ui/Typography";
import Loading from "../Loading";
import { getAllRooms } from "@/services/room/RoomService";
import type { Room } from "@/types/Room";
import { People } from "@mui/icons-material";

/**
 * RoomList Component
 * Displays a list of rooms with their details from the database
 * Used in both public Rooms page and business management
 */

interface RoomListProps {
  businessId?: string; // Optional filter by business
  limit?: number; // Optional limit for featured display
  showBookButton?: boolean; // Show book button (public) or manage actions (business)
}

export default function RoomList({
  businessId,
  limit,
  showBookButton = true,
}: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getAllRooms();

        // Filter by business if provided
        let filteredRooms = businessId
          ? data.filter((room) => room.business_id === businessId)
          : data;

        // Apply limit if provided
        if (limit) {
          filteredRooms = filteredRooms.slice(0, limit);
        }

        setRooms(filteredRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [businessId, limit]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography.Body color="error">{error}</Typography.Body>
      </Box>
    );
  }

  if (rooms.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography.Body color="default">
          No rooms available at the moment.
        </Typography.Body>
      </Box>
    );
  }

  return (
    <Grid
      container
      sm={12}
      md={10}
      lg={10}
      spacing={{ xs: 3, md: 4 }}
      sx={{
        justifyContent: "center",
      }}
    >
      {rooms.map((room) => (
        <Grid key={room.id} xs={12} sm={12} md={6} lg={6} xl={4}>
          <RoomCard
            title={room.room_type || "Standard Room"}
            description={room.description || "Comfortable accommodation"}
            capacity={`${room.capacity || 2} persons`}
            features={[
              `Room ${room.room_number || "TBA"}`,
              `Floor ${room.floor || 1}`,
              room.room_size ? `Size: ${room.room_size}` : "Standard size",
            ]}
            price={
              room.room_price
                ? `₱${room.room_price.toLocaleString()}/night`
                : "Contact for pricing"
            }
            image={
              room.room_profile ||
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070"
            }
            icon={<People />}
            buttonText={showBookButton ? "Book Now" : "Manage"}
            onClick={() => {
              // Handle booking or management action
              console.log("Room action:", room.id);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
