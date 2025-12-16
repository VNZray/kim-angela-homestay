import { Box, Grid } from "@mui/joy";
import {
  Hotel,
  DirectionsBoat,
  Restaurant,
  ArrowForward,
} from "@mui/icons-material";
import Typography from "../ui/Typography";
import Container from "../Container";
import { colors } from "@/utils/Colors";
import SectionHeader from "../SectionHeader";
import Card from "../ui/Card";

/**
 * Value Proposition Section
 * Showcases the main benefits of staying at Kim Angela Homestay
 * with icons and descriptions in a grid layout
 */
const ValueProposition = () => {
  const values = [
    {
      icon: <Hotel sx={{ fontSize: { xs: 40, md: 48 } }} />,
      title: "Comfortable Rooms",
      description:
        "We offer a tantalizing variety of room types to cater to your unique preferences",
      iconBg: "rgba(218, 80, 25, 0.08)",
      iconColor: colors.primary,
    },
    {
      icon: <DirectionsBoat sx={{ fontSize: { xs: 40, md: 48 } }} />,
      title: "Island Hopping Tours",
      description:
        "We take pride in sourcing and offering the finest quality tours from around the world",
      iconBg: "rgba(218, 80, 25, 0.08)",
      iconColor: colors.primary,
    },
    {
      icon: <Restaurant sx={{ fontSize: { xs: 40, md: 48 } }} />,
      title: "Authentic Dining",
      description:
        "We offer a variety of dining options to satisfy your cravings",
      iconBg: "rgba(218, 80, 25, 0.08)",
      iconColor: colors.primary,
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: colors.primary,
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, md: 0 },
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(218, 80, 25, 0.03)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "-5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(218, 80, 25, 0.03)",
          filter: "blur(70px)",
        }}
      />

      <Container padding="0" align="center">
        <SectionHeader
          title="Why Stay With Us?"
          subtitle="Experience the perfect blend of comfort, adventure, and authentic Filipino hospitality"
        />
        {/* Value Grid */}
        <Grid
          container
          sm={12}
          md={10}
          lg={10}
          spacing={{ xs: 3, md: 4 }}
          sx={{
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {values.map((value, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Card elevation={6} variant="solid" ColorScheme="secondary">
                <Typography.Header>{value.title}</Typography.Header>
                <Typography.Body>{value.description}</Typography.Body>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ValueProposition;
