import { Box, AspectRatio, Grid, useColorScheme } from "@mui/joy";
import { CheckCircle } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import SectionHeader from "../../../components/SectionHeader";
import { getColors } from "@/utils/Colors";

const IslandHopping = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
      ref={sectionRef}
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        bgcolor: themeColors.odd,
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        <SectionHeader
          title="Island Hopping Tours"
          subtitle="Discover the stunning beauty of El Nido's islands and lagoons with our expertly curated tours"
        />

        <Grid
          spacing={{ xs: 3, md: 6 }}
          container
          sx={{
            justifyContent: "center",
            position: "relative",
            alignItems: "center",
          }}
        >
          {/* Text Content */}
          <Grid xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-40px)",
                transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              <Typography.Body
                size="md"
                color="default"
                sx={{ mb: 3, opacity: 0.8, lineHeight: 1.8 }}
              >
                Experience pristine beaches, vibrant marine life, and
                breathtaking landscapes.
              </Typography.Body>

              <Box sx={{ mb: 3 }}>
                {tourHighlights.map((highlight, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1.5,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible
                        ? "translateX(0)"
                        : "translateX(-20px)",
                      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.08}s`,
                    }}
                  >
                    <CheckCircle
                      sx={{ color: themeColors.success, fontSize: 24 }}
                    />
                    <Typography.Body color="default">
                      {highlight}
                    </Typography.Body>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="solid"
                  colorScheme="primary"
                  sx={{ px: 4, width: { xs: "100%", sm: "auto" } }}
                >
                  Book a Tour
                </Button>
                <Button
                  variant="outlined"
                  colorScheme="primary"
                  sx={{ px: 4, width: { xs: "100%", sm: "auto" } }}
                >
                  View Packages
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Image */}
          <Grid xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(0) scale(1)"
                  : "translateX(40px) scale(0.95)",
                transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              <AspectRatio
                ratio="4/3"
                sx={{
                  borderRadius: "lg",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070"
                  alt="Island Hopping in El Nido"
                  style={{ objectFit: "cover" }}
                />
              </AspectRatio>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default IslandHopping;
