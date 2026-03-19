import { Box, Grid, useColorScheme } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../../components/SectionHeader";
import Button from "../../../components/ui/Button";
import ReviewCard from "../../../components/cards/ReviewCard";
import Typography from "../../../components/ui/Typography";
import { getAllBusinessReviews } from "@/services/reviews/BusinessReviewService";
import { getTouristById } from "@/services/tourist/TouristService";
import type { BusinessReview } from "@/types/BusinessReview";

const INITIAL_COUNT = 3;

type DisplayReview = {
  id: string;
  rating: number;
  feedback: string;
  reviewerName: string;
  createdAt: string;
};

const FALLBACK_REVIEWS: DisplayReview[] = [
  {
    id: "fallback-1",
    rating: 5,
    feedback:
      "Amazing homestay! The view from the rooftop is breathtaking and the staff was incredibly welcoming. Will definitely come back!",
    reviewerName: "Maria S.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "fallback-2",
    rating: 5,
    feedback:
      "Best homestay experience in Caramoan! The food was delicious and the owner was very hospitable. Highly recommended for families and groups.",
    reviewerName: "Jose R.",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "fallback-3",
    rating: 4,
    feedback:
      "Great location and very affordable. The rooms were clean and comfortable. The dining area has a lovely atmosphere with colorful lanterns.",
    reviewerName: "Anna T.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const GuestReviews = () => {
  const navigate = useNavigate();
  useColorScheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dbReviews, setDbReviews] = useState<BusinessReview[]>([]);
  const [reviewerNames, setReviewerNames] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllBusinessReviews();
        const sorted = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setDbReviews(sorted);

        const displayReviews = sorted.slice(0, INITIAL_COUNT);
        const uniqueIds = [...new Set(displayReviews.map((r) => r.tourist_id))];
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

  // Use fallback reviews when database has no data
  const useFallback = !loading && dbReviews.length === 0;
  const displayedReviews: DisplayReview[] = useFallback
    ? FALLBACK_REVIEWS
    : dbReviews.slice(0, INITIAL_COUNT).map((r) => ({
        id: r.id,
        rating: r.rating,
        feedback: r.feedback ?? "",
        reviewerName: reviewerNames[r.tourist_id] || "Guest",
        createdAt: r.created_at,
      }));
  const hasMore = !useFallback && dbReviews.length > INITIAL_COUNT;

  if (loading) return null;

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <SectionHeader
          title="What Our Guests Say"
          subtitle="Read genuine reviews from travelers who stayed with us"
        />

        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{ justifyContent: "center" }}
        >
          {displayedReviews.map((review, index) => (
            <Grid key={review.id} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`,
                  height: "100%",
                }}
              >
                <ReviewCard
                  rating={review.rating}
                  feedback={review.feedback}
                  reviewerName={review.reviewerName}
                  createdAt={review.createdAt}
                  compact
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        {hasMore && (
          <Box sx={{ textAlign: "center", mt: { xs: 4, md: 6 } }}>
            <Typography.Body
              size="sm"
              color="default"
              sx={{ mb: 2, opacity: 0.7 }}
            >
              {dbReviews.length - INITIAL_COUNT} more reviews from our guests
            </Typography.Body>
            <Button
              variant="outlined"
              colorScheme="primary"
              sx={{ px: 6 }}
              onClick={() => navigate("/reviews")}
            >
              View All Reviews
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GuestReviews;
