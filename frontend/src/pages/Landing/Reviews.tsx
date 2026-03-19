import { useState, useEffect } from "react";
import { Box, useColorScheme } from "@mui/joy";
import SectionHeader from "@/components/SectionHeader";
import Loading from "@/components/Loading";
import ReviewCard from "@/components/cards/ReviewCard";
import ReviewStats from "@/components/cards/ReviewStats";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { getAllBusinessReviews } from "@/services/reviews/BusinessReviewService";
import { getTouristById } from "@/services/tourist/TouristService";
import type { BusinessReview } from "@/types/BusinessReview";

export default function Reviews() {
  useColorScheme();

  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [reviewerNames, setReviewerNames] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllBusinessReviews();
        const sorted = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setReviews(sorted);

        // Fetch reviewer names
        const uniqueIds = [...new Set(sorted.map((r) => r.tourist_id))];
        const names: Record<string, string> = {};
        await Promise.all(
          uniqueIds.map(async (touristId) => {
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
        console.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
        <SectionHeader
          title="Guest Reviews"
          subtitle="See what our guests have to say about their stay at Kim Angela Homestay"
        />

        {/* Stats */}
        {reviews.length > 0 && (
          <Box sx={{ mb: 4 }}>
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
                : "No reviews yet. Be the first to leave a review!"}
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
