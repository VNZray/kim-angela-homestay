import { getColors } from "@/utils/Colors";
import {
  ArrowForward,
  DirectionsBoat,
  Hotel,
  Restaurant,
} from "@mui/icons-material";
import { Box, Grid, useColorScheme } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "../../../components/SectionHeader";
import Button from "../../../components/ui/Button";
import Typography from "../../../components/ui/Typography";

const ValueProposition = () => {
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

  const values = [
    {
      icon: (
        <Hotel
          sx={{ fontSize: { xs: 36, md: 42 }, color: themeColors.primary }}
        />
      ),
      title: "Comfortable Rooms",
      description:
        "We offer a tantalizing variety of room types to cater to your unique preferences and budget.",
      accent: themeColors.primary,
      number: "01",
    },
    {
      icon: (
        <DirectionsBoat
          sx={{ fontSize: { xs: 36, md: 42 }, color: themeColors.primary }}
        />
      ),
      title: "Island Hopping Tours",
      description:
        "Explore the stunning islands of Caramoan with our expertly guided tours and adventure packages.",
      accent: themeColors.primary,
      number: "02",
    },
    {
      icon: (
        <Restaurant
          sx={{ fontSize: { xs: 36, md: 42 }, color: themeColors.primary }}
        />
      ),
      title: "Food & Dining",
      description:
        "We offer delicious seafood and local Filipino cuisine prepared fresh to satisfy your taste buds.",
      accent: themeColors.primary,
      number: "03",
    },
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
      }}
    >
      {/* Decorative background blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "5%",
          left: "-8%",
          width: { xs: "200px", md: "350px" },
          height: { xs: "200px", md: "350px" },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${themeColors.primary}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          right: "-8%",
          width: { xs: "180px", md: "300px" },
          height: { xs: "180px", md: "300px" },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${themeColors.secondary}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{ maxWidth: "1400px", mx: "auto", position: "relative", zIndex: 1 }}
      >
        <SectionHeader
          title="Why Stay With Us?"
          subtitle="Experience the perfect blend of comfort and adventure in Caramoan"
        />

        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{ justifyContent: "center" }}
        >
          {values.map((value, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 4 },
                    borderRadius: "xl",
                    bgcolor: themeColors.light,
                    border: "1px solid",
                    borderColor:
                      mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow:
                      mode === "dark"
                        ? "0 4px 24px rgba(0,0,0,0.3)"
                        : "0 4px 24px rgba(0,0,0,0.06)",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: `${themeColors.primary}60`,
                      boxShadow:
                        mode === "dark"
                          ? `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${themeColors.primary}40`
                          : `0 16px 48px rgba(218,80,25,0.12), 0 0 0 1px ${themeColors.primary}30`,
                    },
                    /* Accent line on top */
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
                      borderRadius: "xl xl 0 0",
                    },
                  }}
                >
                  {/* Number watermark */}
                  <Typography.Body
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 20,
                      fontSize: "clamp(2.5rem, 5vw, 4rem)",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: themeColors.primary,
                      opacity: 0.07,
                      letterSpacing: "-2px",
                      userSelect: "none",
                    }}
                  >
                    {value.number}
                  </Typography.Body>

                  {/* Icon */}
                  <Box
                    sx={{
                      width: { xs: 56, md: 64 },
                      height: { xs: 56, md: 64 },
                      borderRadius: "16px",
                      bgcolor: `${themeColors.primary}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      border: `1.5px solid ${themeColors.primary}25`,
                    }}
                  >
                    {value.icon}
                  </Box>

                  {/* Title */}
                  <Typography.CardTitle size="md" color="dark">
                    {value.title}
                  </Typography.CardTitle>

                  {/* Description */}
                  <Typography.Body
                    size="sm"
                    sx={{ opacity: 0.75, lineHeight: 1.75, flexGrow: 1 }}
                  >
                    {value.description}
                  </Typography.Body>

                  {/* CTA */}
                  <Button
                    variant="soft"
                    colorScheme="primary"
                    endDecorator={<ArrowForward sx={{ fontSize: 16 }} />}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ValueProposition;
