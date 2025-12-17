import { Box, Grid } from "@mui/joy";
import {
  Wifi,
  AcUnit,
  LocalParking,
  Restaurant,
  Pool,
  FitnessCenter,
  Spa,
  LocalLaundryService,
} from "@mui/icons-material";
import Typography from "../ui/Typography";
import Container from "../Container";
import SectionHeader from "../SectionHeader";
import Card from "../ui/Card";

/**
 * Amenities Section
 * Displays homestay amenities in a horizontal scrolling list of chips/pills
 */
const Amenities = () => {
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
          title="Amenities & Services"
          subtitle="Everything you need for a comfortable and memorable stay"
        />

        {/* Amenities Grid */}
        <Grid
          sm={12}
          md={10}
          lg={10}
          spacing={{ xs: 2, md: 3 }}
          container
          sx={{
            justifyContent: "center",
            position: "relative",
          }}
        >
          {amenities.map((amenity, index) => (
            <Grid key={index} xs={6} sm={4} md={3}>
              <Container
                hover
                hoverEffect="lift"
                padding="clamp(1.25rem, 2.5vw + 0.5rem, 1.75rem)"
                radius="12px"
                background="light"
                elevation={1}
                align="center"
                gap="clamp(0.75rem, 1.5vw + 0.25rem, 1rem)"
                cursor="pointer"
                animation="fade-in"
                animationDelay={index * 50}
              >
                {/* Icon Container */}
                <Box
                  sx={{
                    width: { xs: "48px", md: "56px" },
                    height: { xs: "48px", md: "56px" },
                    borderRadius: "12px",
                    bgcolor: "rgba(218, 80, 25, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    "& svg": {
                      fontSize: { xs: "1.75rem", md: "2rem" },
                      color: "#da5019",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  {amenity.icon}
                </Box>

                {/* Label */}
                <Typography.Body
                  size="sm"
                  color="dark"
                  align="center"
                  bold
                  sx={{
                    lineHeight: 1.4,
                    transition: "all 0.3s ease",
                  }}
                >
                  {amenity.label}
                </Typography.Body>
              </Container>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Amenities;
