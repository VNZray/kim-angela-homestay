import { AspectRatio, Box } from "@mui/joy";
import Typography from "../ui/Typography";
import Button from "../ui/Button";

/**
 * Hero Section Component
 * Full-screen landing section with background image, gradient overlay,
 * and call-to-action button
 */
const Hero = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box height="100%" width="100%" position={"absolute"}>
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080"
          alt="Kim Angela Homestay"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      {/* Content Container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: { xs: 3, md: 6 },
          maxWidth: "900px",
        }}
      >
        {/* Main Heading */}
        <Typography.Title
          size="lg"
          color="light"
          sx={{
            mb: 2,
            fontSize: {
              xs: "clamp(2rem, 8vw, 3rem)",
              md: "clamp(3rem, 6vw, 4.5rem)",
            },
            textShadow: "2px 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          Welcome to Kim Angela Homestay
        </Typography.Title>

        {/* Subtitle */}
        <Typography.Body
          size="md"
          color="light"
          sx={{
            mb: 4,
            fontSize: { xs: "1rem", md: "1.25rem" },
            textShadow: "1px 2px 4px rgba(0, 0, 0, 0.3)",
            opacity: 0.95,
          }}
        >
          Your Island Paradise Awaits - Experience authentic Filipino
          hospitality in the heart of El Nido
        </Typography.Body>

        {/* CTA Button */}
        <Button
          variant="solid"
          colorScheme="primary"
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 2 },
            fontSize: { xs: "1rem", md: "1.125rem" },
            borderRadius: "lg",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 24px rgba(246, 211, 62, 0.4)",
            },
          }}
        >
          Book Your Stay Now
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
