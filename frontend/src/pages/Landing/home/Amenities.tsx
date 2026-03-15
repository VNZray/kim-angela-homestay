import {
  AcUnit,
  FitnessCenter,
  LocalLaundryService,
  LocalParking,
  Pool,
  Restaurant,
  Spa,
  Wifi,
} from "@mui/icons-material";
import { Box, Grid } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import Container from "../../../components/Container";
import SectionHeader from "../../../components/SectionHeader";
import Typography from "../../../components/ui/Typography";

const Amenities = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const amenities = [
    { icon: <Wifi />, label: "Free WiFi" },
    { icon: <AcUnit />, label: "Air Conditioning" },
    { icon: <LocalParking />, label: "Free Parking" },
    { icon: <Restaurant />, label: "On-site Dining" },
    { icon: <Pool />, label: "Swimming Pool" },
    { icon: <FitnessCenter />, label: "Fitness Area" },
    { icon: <Spa />, label: "Massage Services" },
    { icon: <LocalLaundryService />, label: "Laundry Service" },
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
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        <SectionHeader
          title="Amenities & Services"
          subtitle="Everything you need for a comfortable and memorable stay"
        />

        <Grid
          spacing={{ xs: 1.5, sm: 2, md: 3 }}
          container
          sx={{
            justifyContent: "center",
            position: "relative",
          }}
        >
          {amenities.map((amenity, index) => (
            <Grid key={index} xs={6} sm={4} md={3}>
              <Box
                sx={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0) scale(1)"
                    : "translateY(30px) scale(0.9)",
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.07}s`,
                }}
              >
                <Container
                  hover
                  hoverEffect="lift"
                  padding="clamp(1rem, 2vw + 0.5rem, 1.5rem)"
                  radius="12px"
                  background="light"
                  elevation={1}
                  align="center"
                  gap="clamp(0.5rem, 1vw + 0.25rem, 0.75rem)"
                  cursor="pointer"
                >
                  <Box
                    sx={{
                      width: { xs: "44px", md: "52px" },
                      height: { xs: "44px", md: "52px" },
                      borderRadius: "12px",
                      bgcolor: "rgba(218, 80, 25, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      "& svg": {
                        fontSize: { xs: "1.5rem", md: "1.75rem" },
                        color: "#da5019",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    {amenity.icon}
                  </Box>
                  <Typography.Body
                    size="sm"
                    color="dark"
                    align="center"
                    bold
                    sx={{ lineHeight: 1.4 }}
                  >
                    {amenity.label}
                  </Typography.Body>
                </Container>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Amenities;
