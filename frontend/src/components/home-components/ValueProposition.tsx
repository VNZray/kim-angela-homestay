import { Box, Grid } from "@mui/joy";
import { Hotel, DirectionsBoat, Restaurant } from "@mui/icons-material";
import Typography from "../ui/Typography";
import Container from "../Container";

/**
 * Value Proposition Section
 * Showcases the main benefits of staying at Kim Angela Homestay
 * with icons and descriptions in a grid layout
 */
const ValueProposition = () => {
  const values = [
    {
      icon: <Hotel sx={{ fontSize: { xs: 48, md: 64 } }} />,
      title: "Comfortable Rooms",
      description:
        "Spacious, clean, and cozy rooms designed for your ultimate relaxation and comfort",
    },
    {
      icon: <DirectionsBoat sx={{ fontSize: { xs: 48, md: 64 } }} />,
      title: "Island Hopping Tours",
      description:
        "Explore the breathtaking islands of El Nido with our exclusive tour packages",
    },
    {
      icon: <Restaurant sx={{ fontSize: { xs: 48, md: 64 } }} />,
      title: "Authentic Dining",
      description:
        "Savor delicious local and international cuisine prepared with fresh ingredients",
    },
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
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography.Header size="md" color="dark" sx={{ mb: 2 }}>
            Why Stay With Us?
          </Typography.Header>
          <Typography.Body
            size="md"
            color="default"
            sx={{ maxWidth: "600px", mx: "auto", opacity: 0.8 }}
          >
            Experience the perfect blend of comfort, adventure, and authentic
            Filipino hospitality
          </Typography.Body>
        </Box>

        {/* Value Grid */}
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{ justifyContent: "center" }}
        >
          {values.map((value, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  textAlign: "center",
                  px: { xs: 2, md: 3 },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    color: "#da5019",
                    mb: 3,
                    display: "flex",
                    justifyContent: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {value.icon}
                </Box>

                {/* Title */}
                <Typography.CardTitle size="md" color="dark" sx={{ mb: 2 }}>
                  {value.title}
                </Typography.CardTitle>

                {/* Description */}
                <Typography.Body
                  size="sm"
                  color="default"
                  sx={{ opacity: 0.8 }}
                >
                  {value.description}
                </Typography.Body>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ValueProposition;
