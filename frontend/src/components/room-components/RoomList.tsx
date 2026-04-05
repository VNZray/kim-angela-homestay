import { getAvailableRoomIds } from "@/services/booking/BookingService";
import { getAllRooms } from "@/services/room/RoomService";
import type { Room } from "@/types/Room";
import { People } from "@mui/icons-material";
import { Box, Grid } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../cards/RoomCard";
import Loading from "../Loading";
import Typography from "../ui/Typography";
import DateSearchFilter from "./DateSearchFilter";

interface RoomListProps {
  businessId?: string;
  limit?: number;
  showBookButton?: boolean;
  showDateFilter?: boolean;
}

export default function RoomList({
  businessId,
  limit,
  showBookButton = true,
  showDateFilter = true,
}: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getAllRooms();

        let result = businessId
          ? data.filter((room) => room.business_id === businessId)
          : data;

        if (limit) {
          result = result.slice(0, limit);
        }

        setRooms(result);
        setFilteredRooms(result);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [businessId, limit]);

  const handleDateFilter = useCallback(
    async (checkIn: string, checkOut: string) => {
      try {
        const bookedRoomIds = await getAvailableRoomIds(checkIn, checkOut);
        const available = rooms.filter((r) => !bookedRoomIds.has(r.id));
        setFilteredRooms(available);
        setIsDateFiltered(true);
      } catch (err) {
        console.error("Error filtering rooms:", err);
      }
    },
    [rooms],
  );

  const handleClearFilter = useCallback(() => {
    setFilteredRooms(rooms);
    setIsDateFiltered(false);
  }, [rooms]);

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

  return (
    <>
      {showBookButton && showDateFilter && (
        <DateSearchFilter
          onFilter={handleDateFilter}
          onClear={handleClearFilter}
          isFiltered={isDateFiltered}
        />
      )}

      {filteredRooms.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography.Body color="default">
            {isDateFiltered
              ? "No rooms available for the selected dates. Try different dates."
              : "No rooms available at the moment."}
          </Typography.Body>
        </Box>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            justifyContent: "center",
            width: "100%",
            mx: "auto",
          }}
        >
          {filteredRooms.map((room) => (
            <Grid key={room.id} xs={12} sm={12} md={6} lg={6} xl={4}>
              <RoomCard
                title={room.room_type || "Standard Room"}
                description={room.description || "Comfortable accommodation"}
                capacity={`${room.capacity || 2} persons`}
                features={[
                  room.room_number ? `${room.room_number}` : "Room TBA",
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
                  if (showBookButton) {
                    navigate(`/rooms/${room.id}`);
                  } else {
                    console.log("Room action:", room.id);
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
