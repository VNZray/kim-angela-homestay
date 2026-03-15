import HeroImage from "@/assets/home/Banner.jpg";

import { getColors } from "@/utils/Colors";
import { ArrowForward, CalendarMonth, Phone, Star } from "@mui/icons-material";
import { AspectRatio, Box, Grid, useColorScheme } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import Typography from "../../../components/ui/Typography";

const Hero = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      ref={heroRef}
      sx={{
        minHeight: { xs: "auto", md: "100dvh" },
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: 12, md: 0 },
        pb: { xs: 16, md: 0 },
        overflow: "hidden",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
      }}
    >
      {/* Parallax Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "0%", md: "0%" },
          left: { xs: "0%", md: "0%" },
          width: { xs: "120px", md: "250px" },
          height: { xs: "120px", md: "250px" },
          borderRadius: "50%",
          background: themeColors.secondary,
          opacity: 0.15,
          transform: `translateY(${scrollY * 0.15}px)`,
          transition: "transform 0.1s linear",
          zIndex: 0,
          animation: "pulse 4s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": {
              transform: `translateY(${scrollY * 0.15}px) scale(1)`,
              opacity: 0.15,
            },
            "50%": {
              transform: `translateY(${scrollY * 0.15}px) scale(1.2)`,
              opacity: 0.3,
            },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: { xs: "80px", md: "180px" },
          height: { xs: "80px", md: "180px" },
          borderRadius: "50%",
          background: themeColors.primary,
          opacity: 0.08,
          transform: `translateY(${scrollY * -0.1}px)`,
          transition: "transform 0.1s linear",
          zIndex: 0,
        }}
      />

      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        sx={{
          maxWidth: "1400px",
          width: "100%",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left - Text Content */}
        <Grid xs={12} md={12} lg={6} xl={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 2.5 },
              pr: { xs: 0, lg: 4 },
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
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
                py: 0.75,
                borderRadius: "xl",
                width: "fit-content",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              <Typography.Body
                size="sm"
                startDecorator={<Star sx={{ color: themeColors.secondary }} />}
              >
                Your Perfect Island Getaway
              </Typography.Body>
            </Box>

            {/* Main Title */}
            <Typography.Title
              color="default"
              size="lg"
              sx={{
                lineHeight: 1.1,
                mb: 0,
              }}
            >
              Welcome to{" "}
              <Typography.Title
                color="primary"
                size="lg"
                sx={{
                  lineHeight: 1.1,
                }}
              >
                Kim Angela Homestay
              </Typography.Title>
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
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 1,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            >
              <Button
                colorScheme="primary"
                variant="solid"
                size="lg"
                startDecorator={<CalendarMonth />}
                endDecorator={<ArrowForward />}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Book Now
              </Button>

              <Button
                colorScheme="primary"
                variant="outlined"
                size="lg"
                startDecorator={<Phone />}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Contact Us
              </Button>
            </Box>

            {/* Trust Badge */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 2, sm: 3 },
                mt: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                alignItems: "center",
                justifyContent: {
                  xs: "center",
                  sm: "flex-start",
                },
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.6s ease 0.6s",
              }}
            >
              {[
                { value: "500+", label: "Happy Guests" },
                { value: "4.9★", label: "Guest Rating" },
                { value: "10+", label: "Years Service" },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{ textAlign: { xs: "center", sm: "left" } }}
                >
                  <Typography.CardTitle size="md" color="primary">
                    {stat.value}
                  </Typography.CardTitle>
                  <Typography.Body size="xs" sx={{ opacity: 0.7 }}>
                    {stat.label}
                  </Typography.Body>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right - Image with Parallax */}
        <Grid xs={12} md={12} lg={6} xl={6}>
          <Box
            sx={{
              position: "relative",
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? `translateY(${scrollY * -0.05}px)`
                : "translateY(40px) scale(0.95)",
              transition: isVisible
                ? "transform 0.1s linear, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s"
                : "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            {/* Decorative blob background */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "-20px", md: "-60px" },
                right: { xs: "-20px", md: "-60px" },
                width: { xs: "400px", md: "700px" },
                height: { xs: "300px", md: "550px" },
                bgcolor: themeColors.primary,
                borderRadius: "50% 50% 30% 70% / 60% 40% 60% 40%",
                opacity: 0.1,
                zIndex: 0,
                animation: "blob 8s infinite",
                "@keyframes blob": {
                  "0%, 100%": {
                    borderRadius: "50% 50% 30% 70% / 60% 40% 60% 40%",
                  },
                  "50%": { borderRadius: "30% 70% 70% 30% / 40% 60% 40% 60%" },
                },
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <AspectRatio
                ratio="4/3"
                sx={{
                  borderRadius: "xl",
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 60px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.12)",
                  maxWidth: { xs: "100%", md: "800px" },
                  mx: "auto",
                }}
              >
                <img
                  src={HeroImage}
                  alt="Kim Angela Homestay"
                  style={{ objectFit: "cover" }}
                />
              </AspectRatio>

              {/* Floating Badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: 12, md: 20 },
                  left: { xs: 12, md: 20 },
                  bgcolor: "background.surface",
                  px: 2,
                  py: 1.5,
                  borderRadius: "lg",
                  boxShadow: "lg",
                  backdropFilter: "blur(12px)",
                  animation: "float 3s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-8px)" },
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
