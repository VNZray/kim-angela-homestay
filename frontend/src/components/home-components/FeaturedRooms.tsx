import { Box, Grid, AspectRatio } from "@mui/joy";
import { People, Favorite } from "@mui/icons-material";
import Typography from "../ui/Typography";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Container from "../Container";

/**
 * Featured Rooms Section
 * Displays room options with hover effects and interactive cards
 * Mobile: Horizontal scroll, Desktop: Grid layout
 */
const FeaturedRooms = () => {
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
        bgcolor: "#ffffff",
      }}
    >
      <Container>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography.Header size="md" color="dark" sx={{ mb: 2 }}>
            Featured Rooms
          </Typography.Header>
          <Typography.Body
            size="md"
            color="default"
            sx={{ maxWidth: "600px", mx: "auto", opacity: 0.8 }}
          >
            Choose from our carefully designed rooms that suit your needs
          </Typography.Body>
        </Box>

        {/* Rooms Grid */}
        <Grid
          container
          spacing={{ xs: 3, md: 4 }}
          sx={{
            // Mobile: Enable horizontal scroll
            overflowX: { xs: "auto", md: "visible" },
            flexWrap: { xs: "nowrap", md: "wrap" },
          }}
        >
          {rooms.map((room, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Card
                variant="soft"
                ColorScheme="background"
                sx={{
                  height: "100%",
                  borderRadius: "lg",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {/* Room Image */}
                <AspectRatio
                  ratio="4/3"
                  sx={{
                    borderRadius: "md",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <img
                    src={room.image}
                    alt={room.title}
                    style={{ objectFit: "cover" }}
                  />
                </AspectRatio>

                {/* Room Info */}
                <Box sx={{ p: 2 }}>
                  {/* Title with Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Box sx={{ color: "#da5019" }}>{room.icon}</Box>
                    <Typography.CardTitle size="md" color="dark">
                      {room.title}
                    </Typography.CardTitle>
                  </Box>

                  {/* Description */}
                  <Typography.Body
                    size="sm"
                    color="default"
                    sx={{ mb: 2, opacity: 0.8 }}
                  >
                    {room.description}
                  </Typography.Body>

                  {/* Capacity */}
                  <Typography.Label
                    size="sm"
                    color="secondary"
                    sx={{ mb: 2, display: "block" }}
                  >
                    Capacity: {room.capacity}
                  </Typography.Label>

                  {/* Features */}
                  <Box sx={{ mb: 2 }}>
                    {room.features.map((feature, idx) => (
                      <Typography.Body
                        key={idx}
                        size="xs"
                        color="default"
                        sx={{ mb: 0.5, opacity: 0.7 }}
                      >
                        • {feature}
                      </Typography.Body>
                    ))}
                  </Box>

                  {/* Price and CTA */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 3,
                    }}
                  >
                    <Typography.CardTitle size="md" color="primary">
                      {room.price}
                    </Typography.CardTitle>
                    <Button variant="soft" colorScheme="primary">
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* View All Button */}
        <Box sx={{ textAlign: "center", mt: { xs: 6, md: 8 } }}>
          <Button variant="outlined" colorScheme="secondary" sx={{ px: 6 }}>
            View All Rooms
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedRooms;
