import Container from "@/components/Container";
import Typography from "@/components/ui/Typography";
import { getColors } from "@/utils/Colors";
import { Star } from "@mui/icons-material";
import { Box, LinearProgress, useColorScheme } from "@mui/joy";

interface RatingsSummaryProps {
  ratings: number[];
  totalReviews: number;
  businessCount: number;
  roomCount: number;
}

const RatingsSummary = ({ ratings, totalReviews }: RatingsSummaryProps) => {
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  const starCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((r) => r === star).length;
    return {
      star,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    };
  });

  return (
    <Container variant="outlined" elevation={0} background="light">
      <Typography.CardTitle size="sm" color="dark" sx={{ mb: 2 }}>
        Reviews Summary
      </Typography.CardTitle>

      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          flexDirection: "column",
        }}
      >
        {/* ── Left: Ratings breakdown ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography.Label
            size="xs"
            color="default"
            sx={{
              mb: 1.5,
              display: "block",
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Ratings
          </Typography.Label>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {starCounts.map(({ star, count, percentage }) => (
              <Box
                key={star}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography.Body
                  size="xs"
                  color="default"
                  sx={{ minWidth: 10, textAlign: "right", fontWeight: 600 }}
                >
                  {star}
                </Typography.Body>
                <Star
                  sx={{ fontSize: 12, color: colors.secondary, flexShrink: 0 }}
                />
                <LinearProgress
                  determinate
                  value={percentage}
                  sx={{
                    flex: 1,
                    "--LinearProgress-thickness": "7px",
                    "--LinearProgress-radius": "4px",
                    "--LinearProgress-progressColor": colors.secondary,
                    "--LinearProgress-trackColor": `${colors.dark}18`,
                  }}
                />
                <Typography.Body
                  size="xs"
                  color="default"
                  sx={{ minWidth: 20, textAlign: "right", opacity: 0.65 }}
                >
                  {count}
                </Typography.Body>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RatingsSummary;
