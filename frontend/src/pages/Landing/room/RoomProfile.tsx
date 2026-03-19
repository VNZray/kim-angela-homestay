import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, AspectRatio, Chip, Divider, useColorScheme } from "@mui/joy";
import {
  ArrowBack,
  People,
  Hotel,
  Maximize,
  AttachMoney,
  Star,
  AccessTime,
  Layers,
} from "@mui/icons-material";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import Loading from "@/components/Loading";
import ReviewCard from "@/components/cards/ReviewCard";
import ReviewStats from "@/components/cards/ReviewStats";
import Calendar from "@/components/ui/Calendar";
import type { CalendarEvent } from "@/components/ui/Calendar";
import { getRoomById } from "@/services/room/RoomService";
import { getRoomReviewsByRoomId } from "@/services/reviews/RoomReviewService";
import { getTouristById } from "@/services/tourist/TouristService";
import { getBookingsByRoomId } from "@/services/booking/BookingService";
import { getColors } from "@/utils/Colors";
import type { Room } from "@/types/Room";
import type { Booking } from "@/types/Booking";
import type { RoomReview } from "@/types/RoomReview";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x500/e2e8f0/64748b?text=No+Room+Image";

const INITIAL_REVIEWS = 5;

export default function TouristRoomProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [reviewerNames, setReviewerNames] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
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

      // Fetch reviewer names
      const uniqueTouristIds = [
        ...new Set(reviewData.map((r) => r.tourist_id)),
      ];
      const names: Record<string, string> = {};
      await Promise.all(
        uniqueTouristIds.map(async (touristId) => {
          try {
            const tourist = await getTouristById(touristId);
            if (tourist) {
              names[touristId] =
                `${tourist.first_name ?? ""} ${tourist.last_name ?? ""}`.trim() ||
                "Guest";
            }
          } catch {
            names[touristId] = "Guest";
          }
        }),
      );
      setReviewerNames(names);
    } catch {
      console.error("Failed to load room profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const displayedReviews = reviews.slice(0, INITIAL_REVIEWS);
  const hasMoreReviews = reviews.length > INITIAL_REVIEWS;

  /* Expand booking date ranges into individual CalendarEvent entries */
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const activeStatuses = new Set(["pending", "reserved", "checked_in"]);
    return bookings
      .filter((b) => activeStatuses.has(b.booking_status))
      .flatMap((b) => {
        const status: CalendarEvent["status"] =
          b.booking_status === "checked_in" ? "Occupied" : "Reserved";
        const start = new Date(b.check_in_date);
        const end = new Date(b.check_out_date);
        const events: CalendarEvent[] = [];
        const current = new Date(start);
        while (current <= end) {
          events.push({
            date: new Date(current),
            status,
            label: `${status} · ${b.check_in_date} → ${b.check_out_date}`,
          });
          current.setDate(current.getDate() + 1);
        }
        return events;
      });
  }, [bookings]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </Box>
    );
  }

  if (!room) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2,
        }}
      >
        <Typography.Header color="dark" size="sm">
          Room Not Found
        </Typography.Header>
        <Typography.Body color="default" size="sm">
          The room you&apos;re looking for doesn&apos;t exist.
        </Typography.Body>
        <Button
          variant="outlined"
          colorScheme="primary"
          onClick={() => navigate("/rooms")}
        >
          Back to Rooms
        </Button>
      </Box>
    );
  }

  const infoItems = [
    {
      icon: <Hotel sx={{ fontSize: 20 }} />,
      label: "Type",
      value: room.room_type ?? "Standard",
    },
    {
      icon: <People sx={{ fontSize: 20 }} />,
      label: "Capacity",
      value: room.capacity ? `${room.capacity} persons` : "—",
    },
    {
      icon: <Maximize sx={{ fontSize: 20 }} />,
      label: "Size",
      value: room.room_size ?? "—",
    },
    {
      icon: <Layers sx={{ fontSize: 20 }} />,
      label: "Floor",
      value: room.floor ? `Floor ${room.floor}` : "—",
    },
    {
      icon: <AttachMoney sx={{ fontSize: 20 }} />,
      label: "Price",
      value: room.room_price
        ? `₱${room.room_price.toLocaleString()}/night`
        : "Contact us",
    },
    {
      icon: <AccessTime sx={{ fontSize: 20 }} />,
      label: "Hourly",
      value: room.per_hour_rate
        ? `₱${room.per_hour_rate.toLocaleString()}/hr`
        : "—",
    },
  ];

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
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <IconButton
            variant="outlined"
            colorScheme="dark"
            size="sm"
            onClick={() => navigate("/rooms")}
          >
            <ArrowBack sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography.Body size="sm" color="default">
            Back to Rooms
          </Typography.Body>
        </Box>

        {/* Main Grid - Room Info (left) + Reviews (right) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* LEFT: Room Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Hero Image */}
            <Card
              colorScheme="light"
              elevation={3}
              sx={{ p: 0, overflow: "hidden" }}
            >
              <AspectRatio ratio="16/9" sx={{ minHeight: 250 }}>
                <img
                  src={room.room_profile || PLACEHOLDER_IMAGE}
                  alt={`Room ${room.room_number}`}
                  style={{ objectFit: "cover" }}
                />
              </AspectRatio>
            </Card>

            {/* Title + Rating + Book Now */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography.Header color="dark" size="sm">
                  {room.room_type || "Standard Room"}
                  {room.room_number ? ` — Room ${room.room_number}` : ""}
                </Typography.Header>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
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
                      {avgRating} ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </Chip>
                  )}
                </Box>
              </Box>
              <Button
                variant="solid"
                colorScheme="primary"
                size="lg"
                sx={{ px: 4 }}
              >
                Book Now
              </Button>
            </Box>

            {/* Description */}
            <Card colorScheme="light" elevation={2} sx={{ p: 3 }}>
              <Typography.CardTitle size="sm" color="dark" sx={{ mb: 1.5 }}>
                About This Room
              </Typography.CardTitle>
              <Typography.Body
                color="default"
                size="sm"
                sx={{ lineHeight: 1.7 }}
              >
                {room.description ||
                  "A comfortable and well-appointed room perfect for your stay."}
              </Typography.Body>
            </Card>

            {/* Room Info Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {infoItems.map((item) => (
                <Card
                  key={item.label}
                  colorScheme="light"
                  elevation={2}
                  sx={{ p: 2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        bgcolor: `${colors.primary}15`,
                        color: colors.primary,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography.Label size="xs" color="default">
                        {item.label}
                      </Typography.Label>
                      <Typography.CardTitle size="sm" color="dark">
                        {item.value}
                      </Typography.CardTitle>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>

            {/* Review Stats (visible on mobile, hidden on desktop since right panel shows it) */}
            <Box sx={{ display: { xs: "block", lg: "none" } }}>
              {reviews.length > 0 && (
                <ReviewStats
                  ratings={reviews.map((r) => r.rating)}
                  totalReviews={reviews.length}
                />
              )}
            </Box>
          </Box>

          {/* RIGHT: Reviews Sidebar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: { lg: "sticky" },
              top: { lg: 100 },
            }}
          >
            {/* Availability Calendar */}
            <Card colorScheme="light" elevation={2} sx={{ p: 2 }}>
              <Typography.CardTitle size="sm" color="dark" sx={{ mb: 1 }}>
                Availability
              </Typography.CardTitle>
              <Calendar
                events={calendarEvents}
                interactive={false}
                showBlockButton={false}
              />
            </Card>
            {/* Review Stats (desktop only) */}
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              {reviews.length > 0 && (
                <ReviewStats
                  ratings={reviews.map((r) => r.rating)}
                  totalReviews={reviews.length}
                />
              )}
            </Box>

            {/* Reviews Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.CardTitle size="sm" color="dark">
                Guest Reviews
              </Typography.CardTitle>
              {reviews.length > 0 && (
                <Typography.Body size="xs" color="default">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </Typography.Body>
              )}
            </Box>

            <Divider />

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <Card
                colorScheme="light"
                elevation={1}
                sx={{ p: 3, textAlign: "center" }}
              >
                <Typography.Body color="default" size="sm">
                  No reviews yet for this room.
                </Typography.Body>
              </Card>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {displayedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    feedback={review.feedback}
                    photos={review.photos}
                    reviewerName={reviewerNames[review.tourist_id] || "Guest"}
                    createdAt={review.created_at}
                    compact
                  />
                ))}

                {/* View More Button */}
                {hasMoreReviews && (
                  <Button
                    variant="outlined"
                    colorScheme="primary"
                    fullWidth
                    onClick={() => navigate(`/rooms/${id}/reviews`)}
                    sx={{ mt: 1 }}
                  >
                    View All {reviews.length} Reviews
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
