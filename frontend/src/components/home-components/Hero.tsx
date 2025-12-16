import { AspectRatio, Box, Grid, useColorScheme } from "@mui/joy";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import HeroImage from "@/assets/kim-angela-hero.jpg";
import Container from "../Container";
import { CalendarMonth, Phone, ArrowForward, Star } from "@mui/icons-material";
import { getColors } from "@/utils/Colors";

/**
 * Hero Section Component
 * Full-screen landing section with engaging text, CTAs, and hero image
 */
const Hero = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);

  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100vh" },
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 12, lg: 0 },
        overflow: "hidden",
        px: { xs: 2, lg: 4 },
        pb: { xs: 25, lg: 4 },
      }}
    >
      {/* Glowing Circle - Top Left */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "0%", md: "0%" },
          left: { xs: "0%", md: "0%" },
          width: { xs: "150px", md: "250px" },
          height: { xs: "150px", md: "250px" },
          borderRadius: "50%",
          background: themeColors.secondary,
          opacity: 0.2,
          animation: "pulse 4s ease-in-out infinite",
          zIndex: 0,
          "@keyframes pulse": {
            "0%, 100%": {
              transform: "scale(1)",
              opacity: 0.2,
            },
            "50%": {
              transform: "scale(1.2)",
              opacity: 0.4,
            },
          },
        }}
      />

      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        sx={{
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
        sm={12}
        md={10}
        lg={10}
      >
        {/* Left - Text Content */}
        <Grid xs={12} md={12} lg={6} xl={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
              pr: { xs: 0, md: 4 },
            }}
          >
            {/* Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "primary.softBg",
                px: 2,
                py: 0.5,
                borderRadius: "xl",
                width: "fit-content",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              <Typography.Body startDecorator={<Star color="action" />}>
                Your Perfect Island Getaway
              </Typography.Body>
            </Box>

            {/* Main Title */}
            <Typography.Title
              color="primary"
              size="lg"
              sx={{
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              Welcome to Kim Angela Homestay
            </Typography.Title>

            {/* Subtitle */}
            <Typography.Body
              color="default"
              size="md"
              sx={{
                opacity: 0.85,
                maxWidth: "540px",
                lineHeight: 1.7,
              }}
            >
              Discover comfort and tranquility in our beautiful homestay.
              Located in the heart of paradise, we offer cozy rooms, stunning
              views, and unforgettable experiences for your perfect island
              vacation.
            </Typography.Body>

            {/* CTA Buttons */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                colorScheme="primary"
                variant="solid"
                size="lg"
                startDecorator={<CalendarMonth />}
                endDecorator={<ArrowForward />}
              >
                Book Now
              </Button>

              <Button
                colorScheme="primary"
                variant="outlined"
                size="lg"
                startDecorator={<Phone />}
              >
                Contact Us
              </Button>
            </Box>

            {/* Trust Badge */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                mt: 3,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                alignItems: "center",
                justifyContent: {
                  xs: "center",
                  sm: "flex-start",
                  md: "flex-start",
                },
              }}
            >
              <Box>
                <Typography.CardTitle size="md" color="primary">
                  500+
                </Typography.CardTitle>
                <Typography.Body size="xs" sx={{ opacity: 0.7 }}>
                  Happy Guests
                </Typography.Body>
              </Box>
              <Box>
                <Typography.CardTitle size="md" color="primary">
                  4.9★
                </Typography.CardTitle>
                <Typography.Body size="xs" sx={{ opacity: 0.7 }}>
                  Guest Rating
                </Typography.Body>
              </Box>
              <Box>
                <Typography.CardTitle size="md" color="primary">
                  10+
                </Typography.CardTitle>
                <Typography.Body size="xs" sx={{ opacity: 0.7 }}>
                  Years Service
                </Typography.Body>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right - Image */}
        <Grid xs={12} md={12} lg={6} xl={6}>
          <Box
            sx={{
              position: "relative",
            }}
          >
            {/* Decorative blob background */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "-20px", md: "-80px" },
                right: { xs: "-20px", md: "-80px" },
                width: { xs: "500px", md: "900px" },
                height: { xs: "400px", md: "700px" },
                bgcolor: themeColors.primary,
                borderRadius: "50% 50% 30% 70% / 60% 40% 60% 40%",
                opacity: 0.15,
                zIndex: 0,
                animation: "blob 8s infinite",
                "@keyframes blob": {
                  "0%, 100%": {
                    borderRadius: "50% 50% 30% 70% / 60% 40% 60% 40%",
                  },
                  "50%": {
                    borderRadius: "30% 70% 70% 30% / 40% 60% 40% 60%",
                  },
                },
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <AspectRatio
                ratio="4/3"
                sx={{
                  borderRadius: "xl",
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 60px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(0, 0, 0, 0.15)",
                  maxWidth: { xs: "100%", md: "800px" },
                  mx: "auto",
                }}
              >
                <img
                  src={HeroImage}
                  alt="Kim Angela Homestay"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </AspectRatio>

              {/* Floating Badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  bgcolor: "background.surface",
                  px: 2.5,
                  py: 1.5,
                  borderRadius: "lg",
                  boxShadow: "lg",
                  backdropFilter: "blur(8px)",
                  animation: "float 3s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                  },
                }}
              >
                <Typography.Label size="xs" sx={{ opacity: 0.7 }}>
                  Special Offer
                </Typography.Label>
                <Typography.CardTitle size="sm" color="success">
                  20% Off This Month
                </Typography.CardTitle>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
