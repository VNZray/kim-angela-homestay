import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, useColorScheme } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Loading from "@/components/Loading";
import ReviewCard from "@/components/cards/ReviewCard";
import ReviewStats from "@/components/cards/ReviewStats";
import { getRoomById } from "@/services/room/RoomService";
import { getRoomReviewsByRoomId } from "@/services/reviews/RoomReviewService";
import { getTouristById } from "@/services/tourist/TouristService";
import type { Room } from "@/types/Room";
import type { RoomReview } from "@/types/RoomReview";

export default function RoomReviews() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useColorScheme();

  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [reviewerNames, setReviewerNames] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [roomData, reviewData] = await Promise.all([
        getRoomById(id),
        getRoomReviewsByRoomId(id),
      ]);
      setRoom(roomData);
      setReviews(reviewData);

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
      console.error("Failed to load room reviews");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

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
        }}
      >
        <Typography.Header color="dark" size="sm">
          Room Not Found
        </Typography.Header>
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
      <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
        {/* Back + Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <IconButton
            variant="outlined"
            colorScheme="dark"
            size="sm"
            onClick={() => navigate(`/rooms/${id}`)}
          >
            <ArrowBack sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography.Header color="dark" size="sm">
              Reviews — {room.room_type || "Room"}{" "}
              {room.room_number ? `#${room.room_number}` : ""}
            </Typography.Header>
            <Typography.Body size="xs" color="default">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </Typography.Body>
          </Box>
        </Box>

        {/* Stats */}
        {reviews.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <ReviewStats
              ratings={reviews.map((r) => r.rating)}
              totalReviews={reviews.length}
            />
          </Box>
        )}

        {/* Rating Filter */}
        {reviews.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
            <Button
              variant={filterRating === null ? "solid" : "outlined"}
              colorScheme="primary"
              size="sm"
              onClick={() => setFilterRating(null)}
            >
              All ({reviews.length})
            </Button>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              if (count === 0) return null;
              return (
                <Button
                  key={star}
                  variant={filterRating === star ? "solid" : "outlined"}
                  colorScheme="primary"
                  size="sm"
                  onClick={() => setFilterRating(star)}
                >
                  {star} Star ({count})
                </Button>
              );
            })}
          </Box>
        )}

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography.Body color="default" size="sm">
              {filterRating
                ? `No ${filterRating}-star reviews found.`
                : "No reviews yet for this room."}
            </Typography.Body>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                rating={review.rating}
                feedback={review.feedback}
                photos={review.photos}
                reviewerName={reviewerNames[review.tourist_id] || "Guest"}
                createdAt={review.created_at}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
