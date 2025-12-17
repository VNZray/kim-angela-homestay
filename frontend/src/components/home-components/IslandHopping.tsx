import { Box, AspectRatio, Grid, useColorScheme } from "@mui/joy";
import { CheckCircle } from "@mui/icons-material";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Container from "../Container";
import SectionHeader from "../SectionHeader";
import { getColors } from "@/utils/Colors";

/**
 * Island Hopping Section
 * Split-screen layout showcasing island tours
 * Mobile: Stacked (image top, text bottom)
 * Desktop: Side-by-side (text left 50%, image right 50%)
 */
const IslandHopping = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);

  const tourHighlights = [
    "Visit the famous Big Lagoon and Small Lagoon",
    "Snorkeling in crystal-clear waters",
    "Secret beaches and hidden lagoons",
    "Delicious lunch included",
    "Professional tour guides",
    "All equipment provided",
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, md: 0 },
      }}
    >
      <Container padding="0" align="center">
        <SectionHeader
          title="Island Hopping Tours"
          subtitle="Discover the stunning beauty of El Nido's islands and lagoons with our expertly curated tours"
        />

        <Grid
          sm={12}
          md={10}
          lg={10}
          spacing={{ xs: 4, md: 6 }}
          container
          sx={{
            justifyContent: "center",
            position: "relative",
            alignItems: "center",
          }}
        >
          {/* Text Content - Left Side (50% on desktop) */}
          <Grid xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            {/* Description */}
            <Typography.Body
              size="md"
              color="default"
              sx={{ mb: 4, opacity: 0.8, lineHeight: 1.8 }}
            >
              Experience pristine beaches, vibrant marine life, and breathtaking
              landscapes.
            </Typography.Body>

            {/* Tour Highlights */}
            <Box sx={{ mb: 4 }}>
              {tourHighlights.map((highlight, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <CheckCircle
                    sx={{
                      color: themeColors.success,
                      fontSize: 28,
                    }}
                  />
                  <Typography.Body color="default">{highlight}</Typography.Body>
                </Box>
              ))}
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button variant="solid" colorScheme="primary" sx={{ px: 4 }}>
                Book a Tour
              </Button>
              <Button variant="outlined" colorScheme="primary" sx={{ px: 4 }}>
                View Packages
              </Button>
            </Box>
          </Grid>

          {/* Image - Right Side (50% on desktop) */}
          <Grid xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <AspectRatio
              ratio="4/3"
              sx={{
                borderRadius: "lg",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070"
                alt="Island Hopping in El Nido"
                style={{ objectFit: "cover" }}
              />
            </AspectRatio>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default IslandHopping;
