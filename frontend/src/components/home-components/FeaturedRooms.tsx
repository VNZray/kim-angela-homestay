import { Box, Grid, AspectRatio, useColorScheme } from "@mui/joy";
import { People, Favorite } from "@mui/icons-material";
import Typography from "../ui/Typography";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Container from "../Container";
import SectionHeader from "../SectionHeader";
import { getColors } from "@/utils/Colors";
import RoomCard from "../cards/RoomCard";

/**
 * Featured Rooms Section
 * Displays room options with hover effects and interactive cards
 * Mobile: Horizontal scroll, Desktop: Grid layout
 */
const FeaturedRooms = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const rooms = [
    {
      title: "Family Room",
      icon: <People />,
      description: "Spacious room perfect for families with children",
      capacity: "4-6 persons",
      features: [
        "Queen bed + Single beds",
        "Private bathroom",
        "Air conditioning",
      ],
      price: "₱2,500/night",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
    },
    {
      title: "Couple's Room",
      icon: <Favorite />,
      description: "Intimate and romantic setting for two",
      capacity: "2 persons",
      features: ["Queen bed", "Private bathroom", "Balcony with view"],
      price: "₱1,800/night",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
    },
    {
      title: "Deluxe Room",
      icon: <People />,
      description: "Premium comfort with modern amenities",
      capacity: "2-4 persons",
      features: ["King bed", "Mini fridge", "Mountain view"],
      price: "₱3,200/night",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
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
        bgcolor: themeColors.odd,
      }}
    >
      <Container padding="0" align="center">
        <SectionHeader
          title="Featured Rooms"
          subtitle="Choose from our carefully designed rooms that suit your needs"
        />

        {/* Rooms Grid */}
        <Grid
          sm={12}
          md={10}
          lg={10}
          spacing={{ xs: 3, md: 4 }}
          container
          sx={{
            justifyContent: "center",
            position: "relative",
          }}
        >
          {rooms.map((room, index) => (
            <Grid key={index} xs={12} sm={12} md={6} lg={6} xl={4}>
              <RoomCard
                title={room.title}
                description={room.description}
                capacity={room.capacity}
                features={room.features}
                price={room.price}
                image={room.image}
                buttonText="Book Now"
              />
            </Grid>
          ))}
        </Grid>

        {/* View All Button */}
        <Box sx={{ textAlign: "center", mt: { xs: 6, md: 8 } }}>
          <Button variant="outlined" colorScheme="primary" sx={{ px: 6 }}>
            View All Rooms
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedRooms;
