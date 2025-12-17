import { Box, Grid, AspectRatio, Chip, useColorScheme } from "@mui/joy";
import Typography from "../ui/Typography";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Container from "../Container";
import SectionHeader from "../SectionHeader";
import { getColors } from "@/utils/Colors";

/**
 * Dining & Packages Section
 * Showcases meal options and package deals
 * Uses soft primary color tint background to visually separate the section
 */
const DiningPackages = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const packages = [
    {
      title: "Breakfast Package",
      description: "Start your day with a hearty Filipino breakfast",
      price: "₱250/person",
      bestSeller: false,
      image:
        "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070",
      features: [
        "Traditional Filipino dishes",
        "Fresh tropical fruits",
        "Coffee/Tea",
      ],
    },
    {
      title: "Full Board Package",
      description: "All meals included - Breakfast, Lunch & Dinner",
      price: "₱800/person/day",
      bestSeller: true,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
      features: ["3 meals daily", "Snacks included", "Vegetarian options"],
    },
    {
      title: "Romantic Dinner",
      description: "Private beachside dinner for two under the stars",
      price: "₱2,500/couple",
      bestSeller: false,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070",
      features: ["Candlelight setting", "Fresh seafood", "Personalized menu"],
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
          title="Dining & Packages"
          subtitle="Savor authentic Filipino cuisine and fresh seafood prepared by our talented chefs"
        />

        {/* Packages Grid */}
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
          {packages.map((pkg, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Card
                colorScheme="light"
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
                {/* Best Seller Badge */}
                {pkg.bestSeller && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      zIndex: 2,
                    }}
                  >
                    <Chip
                      color="warning"
                      variant="solid"
                      size="sm"
                      sx={{
                        bgcolor: "#f6d33e",
                        color: "#1a1a1a",
                        fontWeight: 700,
                      }}
                    >
                      Best Seller
                    </Chip>
                  </Box>
                )}

                {/* Package Image */}
                <AspectRatio
                  ratio="16/9"
                  sx={{
                    borderRadius: "md",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    style={{ objectFit: "cover" }}
                  />
                </AspectRatio>

                {/* Package Info */}
                <Box sx={{ p: 2 }}>
                  {/* Title */}
                  <Typography.CardTitle size="md" color="dark" sx={{ mb: 1 }}>
                    {pkg.title}
                  </Typography.CardTitle>

                  {/* Description */}
                  <Typography.Body
                    size="sm"
                    color="default"
                    sx={{ mb: 3, opacity: 0.8 }}
                  >
                    {pkg.description}
                  </Typography.Body>

                  {/* Features */}
                  <Box sx={{ mb: 3 }}>
                    {pkg.features.map((feature, idx) => (
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
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography.CardTitle size="md" color="primary">
                      {pkg.price}
                    </Typography.CardTitle>
                    <Button variant="soft" colorScheme="secondary" size="sm">
                      Order Now
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info */}
        <Box sx={{ textAlign: "center", mt: { xs: 6, md: 8 } }}>
          <Typography.Body
            size="sm"
            color="default"
            sx={{ mb: 3, opacity: 0.7 }}
          >
            Custom packages available for groups and special events
          </Typography.Body>
          <Button variant="outlined" colorScheme="dark" sx={{ px: 6 }}>
            View Full Menu
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DiningPackages;
