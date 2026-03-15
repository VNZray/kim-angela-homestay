import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, AspectRatio, Chip, Tabs, TabList, Tab, TabPanel } from "@mui/joy";
import {
  ArrowBack,
  Edit,
  Delete,
  Hotel,
  AttachMoney,
  People,
  Maximize,
  Star,
  CalendarMonth,
} from "@mui/icons-material";
import { useColorScheme } from "@mui/joy/styles";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import IconButton from "@/components/ui/IconButton";
import Loading from "@/components/Loading";
import Calendar from "@/components/ui/Calendar";
import type { CalendarEvent } from "@/components/ui/Calendar";
import RoomModal from "./components/RoomModal";
import {
  getRoomById,
  updateRoom,
  deleteRoom,
} from "@/services/room/RoomService";
import { getBookingsByRoomId } from "@/services/booking/BookingService";
import { getRoomReviewsByRoomId } from "@/services/reviews/RoomReviewService";
import { getColors } from "@/utils/Colors";
import type { Room } from "@/types/Room";
import type { Booking } from "@/types/Booking";
import type { RoomReview } from "@/types/RoomReview";
import Container from "@/components/Container";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x500/e2e8f0/64748b?text=No+Room+Image";

export default function RoomProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
      const [roomData, bookingData, reviewData] = await Promise.all([
        getRoomById(id),
        getBookingsByRoomId(id),
        getRoomReviewsByRoomId(id),
      ]);
      setRoom(roomData);
      setBookings(bookingData);
      setReviews(reviewData);
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

  // Convert bookings to calendar events
  const calendarEvents: CalendarEvent[] = bookings.flatMap((booking) => {
    const events: CalendarEvent[] = [];
    const start = new Date(booking.check_in_date);
    const end = new Date(booking.check_out_date);
    const statusMap: Record<string, CalendarEvent["status"]> = {
      reserved: "Reserved",
      pending: "Reserved",
      checked_in: "Occupied",
      checked_out: "Available",
      cancelled: "Available",
    };
    const status = statusMap[booking.booking_status] ?? "Reserved";
    if (status === "Available") return events;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      events.push({
        date: new Date(d),
        status,
        label: `${booking.booking_status} — ${booking.booking_type}`,
        bookingId: booking.id,
      });
    }
    return events;
  });

  // Average rating
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

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
        <Container elevation={3}>
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
        </Container>
      </PageContainer>
    );
  }

  const statCards = [
    {
      icon: <Hotel sx={{ fontSize: 22 }} />,
      label: "Room Type",
      value: room.room_type ?? "—",
    },
    {
      icon: <People sx={{ fontSize: 22 }} />,
      label: "Capacity",
      value: room.capacity ? `${room.capacity} persons` : "—",
    },
    {
      icon: <Maximize sx={{ fontSize: 22 }} />,
      label: "Room Size",
      value: room.room_size ?? "—",
    },
    {
      icon: <AttachMoney sx={{ fontSize: 22 }} />,
      label: "Base Price",
      value: room.room_price ? `₱${room.room_price.toLocaleString()}` : "—",
    },
  ];

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            variant="outlined"
            colorScheme="dark"
            size="sm"
            onClick={() => navigate("/business/rooms")}
          >
            <ArrowBack sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography.Header color="dark" size="sm">
              Room {room.room_number || "TBA"}
            </Typography.Header>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}
            >
              {room.floor && (
                <Typography.Body size="xs" color="default">
                  Floor {room.floor}
                </Typography.Body>
              )}
              {room.room_type && (
                <Chip size="sm" variant="soft" color="warning">
                  {room.room_type}
                </Chip>
              )}
              {avgRating && (
                <Chip
                  size="sm"
                  variant="soft"
                  color="success"
                  startDecorator={<Star sx={{ fontSize: 14 }} />}
                >
                  {avgRating} ({reviews.length})
                </Chip>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            startDecorator={<Edit sx={{ fontSize: 18 }} />}
            onClick={() => setEditModalOpen(true)}
          >
            Edit Room
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

      {/* Hero Image */}
      <Card
        colorScheme="light"
        elevation={2}
        sx={{ p: 0, overflow: "hidden", mb: 2 }}
      >
        <AspectRatio ratio="21/7" sx={{ minHeight: 180 }}>
          <img
            src={room.room_profile || PLACEHOLDER_IMAGE}
            alt={`Room ${room.room_number}`}
            style={{ objectFit: "cover" }}
          />
        </AspectRatio>
      </Card>

      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 2,
        }}
      >
        {statCards.map((stat) => (
          <Container
            key={stat.label}
            elevation={2}
            align="center"
            direction="row"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "10px",
                bgcolor: `${colors.primary}15`,
                color: colors.primary,
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </Box>
            <Box>
              <Typography.Label size="xs" color="default">
                {stat.label}
              </Typography.Label>
              <Typography.CardTitle size="sm" color="dark">
                {stat.value}
              </Typography.CardTitle>
            </Box>
          </Container>
        ))}
      </Box>

      {/* Tabs */}
      <Container elevation={2}>
        <Tabs
          value={activeTab}
          onChange={(_e, val) => setActiveTab(val as number)}
          sx={{ borderRadius: "12px", bgcolor: "transparent" }}
        >
          <TabList
            sx={{
              gap: 1,
              [`& .MuiTab-root`]: {
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
              },
            }}
          >
            <Tab>Overview</Tab>
            <Tab>Bookings</Tab>
            <Tab>Pricing</Tab>
            <Tab>Photos</Tab>
            <Tab>Reviews</Tab>
          </TabList>

          {/* ===== OVERVIEW TAB ===== */}
          <TabPanel value={0} sx={{ p: 0, pt: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
                gap: 2,
              }}
            >
              {/* Description */}
              <Container variant="outlined">
                <Typography.CardTitle size="sm" color="dark" sx={{ mb: 1.5 }}>
                  Description
                </Typography.CardTitle>
                <Typography.Body
                  color="default"
                  size="sm"
                  sx={{ lineHeight: 1.7 }}
                >
                  {room.description ||
                    "No description available for this room."}
                </Typography.Body>
              </Container>

              {/* Calendar Sidebar */}
              <Container variant="outlined">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <CalendarMonth sx={{ fontSize: 20, color: colors.primary }} />
                  <Typography.CardTitle size="sm" color="dark">
                    Availability
                  </Typography.CardTitle>
                </Box>
                <Calendar events={calendarEvents} interactive={false} />
              </Container>
            </Box>
          </TabPanel>

          {/* ===== PHOTOS TAB ===== */}
          <TabPanel value={3} sx={{ p: 0, pt: 2 }}>
            {room.room_profile ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                <Card
                  colorScheme="light"
                  elevation={1}
                  sx={{ p: 0, overflow: "hidden" }}
                >
                  <AspectRatio ratio="4/3">
                    <img
                      src={room.room_profile}
                      alt={`Room ${room.room_number}`}
                      style={{ objectFit: "cover" }}
                    />
                  </AspectRatio>
                </Card>
              </Box>
            ) : (
              <Card
                colorScheme="light"
                elevation={1}
                sx={{ p: 4, textAlign: "center" }}
              >
                <Typography.Body color="default" size="sm">
                  No photos available for this room.
                </Typography.Body>
              </Card>
            )}
          </TabPanel>

          {/* ===== REVIEWS TAB ===== */}
          <TabPanel value={4} sx={{ p: 0, pt: 2 }}>
            {reviews.length === 0 ? (
              <Card
                colorScheme="light"
                elevation={1}
                sx={{ p: 4, textAlign: "center" }}
              >
                <Typography.Body color="default" size="sm">
                  No reviews yet for this room.
                </Typography.Body>
              </Card>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    colorScheme="light"
                    elevation={1}
                    sx={{ p: 2.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            sx={{
                              fontSize: 16,
                              color:
                                i < review.rating
                                  ? colors.secondary
                                  : `${colors.dark}20`,
                            }}
                          />
                        ))}
                        <Typography.Label
                          size="xs"
                          color="default"
                          sx={{ ml: 0.5 }}
                        >
                          {review.rating}/5
                        </Typography.Label>
                      </Box>
                      <Typography.Body size="xs" color="default">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography.Body>
                    </Box>
                    <Typography.Body
                      size="sm"
                      color="dark"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {review.feedback || "No feedback provided."}
                    </Typography.Body>
                    {review.photos && review.photos.length > 0 && (
                      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                        {review.photos.map((photo, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "8px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={photo}
                              alt={`Review photo ${idx + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
        </Tabs>
      </Container>

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
