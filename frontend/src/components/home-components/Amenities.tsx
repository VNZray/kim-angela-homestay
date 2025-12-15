import { Box, Chip } from "@mui/joy";
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
        bgcolor: "#ffffff",
      }}
    >
      <Container>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography.Header size="md" color="dark" sx={{ mb: 2 }}>
            Amenities & Services
          </Typography.Header>
          <Typography.Body
            size="md"
            color="default"
            sx={{ maxWidth: "600px", mx: "auto", opacity: 0.8 }}
          >
            Everything you need for a comfortable and memorable stay
          </Typography.Body>
        </Box>

        {/* Amenities Horizontal Scroll */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            px: { xs: 1, md: 0 },
            // Hide scrollbar but keep functionality
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "3px",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.3)",
              },
            },
          }}
        >
          {amenities.map((amenity, index) => (
            <Chip
              key={index}
              variant="soft"
              color="neutral"
              startDecorator={amenity.icon}
              sx={{
                minWidth: "fit-content",
                px: 3,
                py: 1.5,
                fontSize: "0.9rem",
                borderRadius: "full",
                bgcolor: "#fdfcfa",
                border: "1px solid",
                borderColor: "divider",
                color: "#1a1a1a",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#f6d33e",
                  borderColor: "#f6d33e",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(246, 211, 62, 0.3)",
                },
                "& .MuiChip-startDecorator": {
                  color: "#da5019",
                },
              }}
            >
              {amenity.label}
            </Chip>
          ))}
        </Box>

        {/* Additional Note */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography.Body size="xs" color="default" sx={{ opacity: 0.6 }}>
            Scroll horizontally to see all amenities
          </Typography.Body>
        </Box>
      </Container>
    </Box>
  );
};

export default Amenities;
