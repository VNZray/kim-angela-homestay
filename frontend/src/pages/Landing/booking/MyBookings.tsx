import { useState, useEffect, useCallback } from "react";
import { Box, Chip, Divider } from "@mui/joy";
import Typography from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loading from "@/components/Loading";
import NoDataFound from "@/components/ui/NoDataFound";
import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/context/AuthContext";
import {
  getBookingsByEmail,
  getBookingByReferenceId,
  getBookingsByTouristId,
} from "@/services/booking/BookingService";
import {
  getAllLocalBookings,
  searchLocalBookings,
} from "@/services/booking/LocalBookingService";
import { getTouristByFirebaseUid } from "@/services/tourist/TouristService";
import { getRoomById } from "@/services/room/RoomService";
import type { Booking, BookingStatus, LocalBooking } from "@/types/Booking";
import type { Room } from "@/types/Room";
import { Search, CalendarDays, Clock, MapPin, Hash } from "lucide-react";

type DisplayBooking = {
  id: string;
  referenceId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  stayType: string;
  totalPrice: number;
  status: BookingStatus;
  guestName: string;
  createdAt: string;
};

function getStatusColor(
  status: BookingStatus,
): "warning" | "primary" | "success" | "neutral" | "danger" {
  switch (status) {
    case "pending":
      return "warning";
    case "reserved":
      return "primary";
    case "checked_in":
      return "success";
    case "checked_out":
      return "neutral";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

function formatStatus(status: BookingStatus): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MyBookings() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [bookings, setBookings] = useState<DisplayBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  // Room cache for resolving room IDs to names
  const [roomCache, setRoomCache] = useState<Record<string, Room>>({});

  const resolveRoomName = useCallback(
    async (roomId: string): Promise<string> => {
      if (roomCache[roomId]) {
        const r = roomCache[roomId];
        return `${r.room_type || "Room"}${r.room_number ? ` — ${r.room_number}` : ""}`;
      }
      try {
        const room = await getRoomById(roomId);
        if (room) {
          setRoomCache((prev) => ({ ...prev, [roomId]: room }));
          return `${room.room_type || "Room"}${room.room_number ? ` — ${room.room_number}` : ""}`;
        }
      } catch {
        // ignore
      }
      return "Room";
    },
    [roomCache],
  );

  const mapDbBooking = useCallback(
    async (b: Booking): Promise<DisplayBooking> => {
      const roomName = await resolveRoomName(b.room_id);
      return {
        id: b.id,
        referenceId: b.reference_id ?? b.id.slice(0, 8).toUpperCase(),
        roomName,
        checkInDate: b.check_in_date,
        checkOutDate: b.check_out_date,
        checkInTime: b.check_in_time,
        checkOutTime: b.check_out_time,
        stayType: b.booking_type,
        totalPrice: b.total_price,
        status: b.booking_status,
        guestName: b.guest_name ?? "",
        createdAt: "",
      };
    },
    [resolveRoomName],
  );

  const mapLocalBooking = (b: LocalBooking): DisplayBooking => ({
    id: b.id,
    referenceId: b.referenceId,
    roomName: b.roomName,
    checkInDate: b.arrivalDate,
    checkOutDate: b.checkOutDate,
    checkInTime: b.checkInTime,
    checkOutTime: b.checkOutTime,
    stayType: b.stayType,
    totalPrice: b.totalPrice,
    status: b.status,
    guestName: b.fullName,
    createdAt: b.createdAt,
  });

  // Load bookings on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isAuthenticated && user) {
          const tourist = await getTouristByFirebaseUid(user.uid);
          let dbBookings: Booking[] = [];
          if (tourist) {
            dbBookings = await getBookingsByTouristId(tourist.id);
          }
          // Also fetch by email as fallback
          if (user.email) {
            const emailBookings = await getBookingsByEmail(user.email);
            const existingIds = new Set(dbBookings.map((b) => b.id));
            emailBookings.forEach((b) => {
              if (!existingIds.has(b.id)) dbBookings.push(b);
            });
          }
          const mapped = await Promise.all(dbBookings.map(mapDbBooking));
          setBookings(mapped);
        } else {
          // Guest: load from localStorage
          const local = getAllLocalBookings();
          setBookings(local.map(mapLocalBooking));
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, user, mapDbBooking]);

  // Search for guest bookings
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      if (isAuthenticated) {
        // Search DB by reference ID
        const booking = await getBookingByReferenceId(searchQuery.trim());
        if (booking) {
          const mapped = await mapDbBooking(booking);
          setBookings([mapped]);
        } else {
          setBookings([]);
        }
      } else {
        // Search localStorage
        const results = searchLocalBookings(searchQuery.trim());
        if (results.length > 0) {
          setBookings(results.map(mapLocalBooking));
        } else {
          // Try DB by reference or email
          const byRef = await getBookingByReferenceId(searchQuery.trim());
          if (byRef) {
            const mapped = await mapDbBooking(byRef);
            setBookings([mapped]);
          } else {
            const byEmail = await getBookingsByEmail(searchQuery.trim());
            if (byEmail.length > 0) {
              const mapped = await Promise.all(byEmail.map(mapDbBooking));
              setBookings(mapped);
            } else {
              setBookings([]);
            }
          }
        }
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  }, [searchQuery, isAuthenticated, mapDbBooking]);

  const handleReset = useCallback(async () => {
    setSearchQuery("");
    setLoading(true);
    try {
      if (isAuthenticated && user) {
        const tourist = await getTouristByFirebaseUid(user.uid);
        let dbBookings: Booking[] = [];
        if (tourist) {
          dbBookings = await getBookingsByTouristId(tourist.id);
        }
        if (user.email) {
          const emailBookings = await getBookingsByEmail(user.email);
          const existingIds = new Set(dbBookings.map((b) => b.id));
          emailBookings.forEach((b) => {
            if (!existingIds.has(b.id)) dbBookings.push(b);
          });
        }
        const mapped = await Promise.all(dbBookings.map(mapDbBooking));
        setBookings(mapped);
      } else {
        const local = getAllLocalBookings();
        setBookings(local.map(mapLocalBooking));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, mapDbBooking]);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 10 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <SectionHeader
          title="My Bookings"
          subtitle={
            isAuthenticated
              ? "View and track all your booking history"
              : "Search your bookings using your email or booking reference ID"
          }
        />

        {/* Search bar for guests (always visible for guest, optional for auth) */}
        <Card colorScheme="light" elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
                {isAuthenticated
                  ? "Search by Reference ID"
                  : "Search by Email or Reference ID"}
              </Typography.Label>
              <Input
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAuthenticated
                    ? "Enter booking reference ID"
                    : "Enter email or booking reference ID"
                }
                leftIcon={<Search size={18} />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="solid"
                colorScheme="primary"
                onClick={handleSearch}
                loading={searching}
              >
                Search
              </Button>
              {searchQuery && (
                <Button
                  variant="outlined"
                  colorScheme="secondary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </Box>
          </Box>
        </Card>

        {/* Loading */}
        {loading ? (
          <Loading />
        ) : bookings.length === 0 ? (
          <NoDataFound
            title="No Bookings Found"
            message={
              isAuthenticated
                ? "You haven't made any bookings yet. Browse rooms to get started!"
                : "No bookings found. Try searching with your email or booking reference ID."
            }
            icon="inbox"
          />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                colorScheme="light"
                elevation={2}
                sx={{ p: 0, overflow: "hidden" }}
              >
                {/* Header with status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "var(--joy-palette-neutral-200)",
                    bgcolor: "var(--joy-palette-background-level1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Hash size={14} />
                    <Typography.Label size="sm" color="primary" bold>
                      {booking.referenceId}
                    </Typography.Label>
                  </Box>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={getStatusColor(booking.status)}
                  >
                    {formatStatus(booking.status)}
                  </Chip>
                </Box>

                {/* Body */}
                <Box sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <MapPin
                        size={16}
                        style={{ flexShrink: 0, opacity: 0.6 }}
                      />
                      <Box>
                        <Typography.Label size="xs" color="default">
                          Room
                        </Typography.Label>
                        <Typography.Body size="sm" color="dark" bold>
                          {booking.roomName}
                        </Typography.Body>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <CalendarDays
                        size={16}
                        style={{ flexShrink: 0, opacity: 0.6 }}
                      />
                      <Box>
                        <Typography.Label size="xs" color="default">
                          Check-in
                        </Typography.Label>
                        <Typography.Body size="sm" color="dark">
                          {booking.checkInDate} at {booking.checkInTime}
                        </Typography.Body>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <CalendarDays
                        size={16}
                        style={{ flexShrink: 0, opacity: 0.6 }}
                      />
                      <Box>
                        <Typography.Label size="xs" color="default">
                          Check-out
                        </Typography.Label>
                        <Typography.Body size="sm" color="dark">
                          {booking.checkOutDate} at {booking.checkOutTime}
                        </Typography.Body>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Clock
                        size={16}
                        style={{ flexShrink: 0, opacity: 0.6 }}
                      />
                      <Box>
                        <Typography.Label size="xs" color="default">
                          Stay Type
                        </Typography.Label>
                        <Typography.Body size="sm" color="dark">
                          {booking.stayType === "overnight"
                            ? "Overnight"
                            : "Short Stay"}
                        </Typography.Body>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {booking.guestName && (
                      <Typography.Body size="xs" color="default">
                        Booked by: {booking.guestName}
                      </Typography.Body>
                    )}
                    <Typography.CardTitle size="sm" color="primary">
                      ₱{booking.totalPrice.toLocaleString()}
                    </Typography.CardTitle>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
