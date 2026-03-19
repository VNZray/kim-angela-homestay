import { Box, LinearProgress, useColorScheme } from "@mui/joy";
import { Star } from "@mui/icons-material";
import Typography from "../ui/Typography";
import Card from "../ui/Card";
import { getColors } from "@/utils/Colors";

interface ReviewStatsProps {
  ratings: number[];
  totalReviews: number;
}

const ReviewStats = ({ ratings, totalReviews }: ReviewStatsProps) => {
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  const avgRating =
    totalReviews > 0
      ? (ratings.reduce((sum, r) => sum + r, 0) / totalReviews).toFixed(1)
      : "0.0";

  // Count reviews per star level
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r === star).length,
    percentage:
      totalReviews > 0
        ? (ratings.filter((r) => r === star).length / totalReviews) * 100
        : 0,
  }));

  return (
    <Card colorScheme="light" elevation={2} sx={{ p: 3 }}>
      <Typography.CardTitle size="sm" color="dark" sx={{ mb: 2 }}>
        Reviews Summary
      </Typography.CardTitle>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
        }}
      >
        {/* Average Rating */}
        <Box sx={{ textAlign: "center", minWidth: 120 }}>
          <Typography.Header color="dark" size="lg">
            {avgRating}
          </Typography.Header>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 0.5, my: 1 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                sx={{
                  fontSize: 20,
                  color:
                    i < Math.round(Number(avgRating))
                      ? colors.secondary
                      : `${colors.dark}20`,
                }}
              />
            ))}
          </Box>
          <Typography.Body size="xs" color="default">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </Typography.Body>
        </Box>

        {/* Star Breakdown */}
        <Box sx={{ flex: 1, width: "100%" }}>
          {starCounts.map(({ star, count, percentage }) => (
            <Box
              key={star}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.75,
              }}
            >
              <Typography.Body
                size="xs"
                color="default"
                sx={{ minWidth: 15, textAlign: "right" }}
              >
                {star}
              </Typography.Body>
              <Star sx={{ fontSize: 14, color: colors.secondary }} />
              <LinearProgress
                determinate
                value={percentage}
                sx={{
                  flex: 1,
                  "--LinearProgress-thickness": "8px",
                  "--LinearProgress-radius": "4px",
                  "--LinearProgress-progressColor": colors.secondary,
                  "--LinearProgress-trackColor": `${colors.dark}18`,
                }}
              />
              <Typography.Body
                size="xs"
                color="default"
                sx={{ minWidth: 24, textAlign: "right" }}
              >
                {count}
              </Typography.Body>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default ReviewStats;
