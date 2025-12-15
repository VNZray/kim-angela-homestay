import { Box, AspectRatio } from "@mui/joy";
import { CheckCircle } from "@mui/icons-material";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Container from "../Container";

/**
 * Island Hopping Section
 * Split-screen layout showcasing island tours
 * Mobile: Stacked (image top, text bottom)
 * Desktop: Side-by-side (text left 50%, image right 50%)
 */
const IslandHopping = () => {
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
        bgcolor: "#fdfcfa",
      }}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          {/* Text Content - Left Side (50% on desktop) */}
          <Box
            sx={{
              flex: { xs: "1", md: "1 1 50%" },
              order: { xs: 2, md: 1 },
            }}
          >
            {/* Section Label */}
            <Typography.Label
              size="md"
              color="secondary"
              bold
              sx={{ mb: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              Adventure Awaits
            </Typography.Label>

            {/* Heading */}
            <Typography.Header size="md" color="dark" sx={{ mb: 3 }}>
              Island Hopping Tours
            </Typography.Header>

            {/* Description */}
            <Typography.Body
              size="md"
              color="default"
              sx={{ mb: 4, opacity: 0.8, lineHeight: 1.8 }}
            >
              Discover the stunning beauty of El Nido's islands and lagoons with
              our expertly curated island hopping tours. Experience pristine
              beaches, vibrant marine life, and breathtaking landscapes.
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
                      color: "#da5019",
                      fontSize: 24,
                    }}
                  />
                  <Typography.Body size="sm" color="default">
                    {highlight}
                  </Typography.Body>
                </Box>
              ))}
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button variant="solid" colorScheme="primary" sx={{ px: 4 }}>
                Book a Tour
              </Button>
              <Button variant="outlined" colorScheme="secondary" sx={{ px: 4 }}>
                View Packages
              </Button>
            </Box>
          </Box>

          {/* Image - Right Side (50% on desktop) */}
          <Box
            sx={{
              flex: { xs: "1", md: "1 1 50%" },
              order: { xs: 1, md: 2 },
              width: "100%",
            }}
          >
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default IslandHopping;
