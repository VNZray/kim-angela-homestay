import { Box, Grid, useColorScheme } from "@mui/joy";
import {
  Hotel,
  DirectionsBoat,
  Restaurant,
  ArrowForward,
} from "@mui/icons-material";
import Typography from "../ui/Typography";
import Container from "../Container";
import { getColors } from "@/utils/Colors";
import SectionHeader from "../SectionHeader";
import Card from "../ui/Card";
import Button from "../ui/Button";

/**
 * Value Proposition Section
 * Showcases the main benefits of staying at Kim Angela Homestay
 * with icons and descriptions in a grid layout
 */
const ValueProposition = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const values = [
    {
      icon: <Hotel sx={{ fontSize: { xs: 60, md: 60 } }} />,
      title: "Comfortable Rooms",
      description:
        "We offer a tantalizing variety of room types to cater to your unique preferences",
      iconBg: themeColors.info + "20",
      iconColor: themeColors.primary,
    },
    {
      icon: <DirectionsBoat sx={{ fontSize: { xs: 60, md: 60 } }} />,
      title: "Island Hopping Tours",
      description:
        "Explore the stunning islands of Caramoan with our guided tours",
      iconBg: themeColors.success + "20",
      iconColor: themeColors.primary,
    },
    {
      icon: <Restaurant sx={{ fontSize: { xs: 60, md: 60 } }} />,
      title: "Food & Dining",
      description:
        "We offer delicious sea food and local cuisine to satisfy your taste buds",
      iconBg: themeColors.warning + "20",
      iconColor: themeColors.primary,
    },
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
          subtitle="Experience the perfect blend of comfort and adventure in Caramoan"
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
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 2,
                  py: { xs: 4, md: 8 },
                  px: { xs: 2, md: 4 },
                  paddingBottom: { xs: 4, md: 4 },
                }}
                variant="plain"
                ColorScheme="primary"
              >
                <Container radius="50%" background={value.iconBg}>
                  {value.icon}
                </Container>

                <Typography.Header>{value.title}</Typography.Header>
                <Typography.Body size="md">{value.description}</Typography.Body>

                <Button variant="outlined">Learn More</Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ValueProposition;
