import { Box, Grid, Divider, useColorScheme } from "@mui/joy";
import {
  Facebook,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import Typography from "./ui/Typography";
import { Link } from "react-router-dom";
import Container from "./Container";
import { getColors } from "@/utils/Colors";
import IconButton from "./ui/IconButton";

/**
 * Footer Component
 * Minimalist footer with contact info, quick links, and social media
 * Responsive: 4 columns on desktop, single column on mobile
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Rooms", path: "/rooms" },
    { label: "Services", path: "/services" },
    { label: "About", path: "/about" },
    { label: "Login", path: "/login" },
  ];

  const socialLinks = [
    {
      icon: <Facebook />,
      url: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <Instagram />,
      url: "https://instagram.com",
      label: "Instagram",
    },
  ];

  return (
    <>
      {/* Wave Shape at Top of Footer */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "80px", md: "120px" },
          overflow: "hidden",
        }}
      >
        {/* Animated Wave Layers */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "200%",
            height: "100%",
            animation: "wave 15s linear infinite",
            "@keyframes wave": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <path
              d="M0,60 C200,90 400,30 600,60 C800,90 1000,30 1200,60 L1200,120 L0,120 Z"
              fill={themeColors.primary}
              opacity="1"
            />
          </svg>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "200%",
            height: "100%",
            animation: "wave 12s linear infinite reverse",
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <path
              d="M0,40 C200,70 400,10 600,40 C800,70 1000,10 1200,40 L1200,120 L0,120 Z"
              fill={themeColors.primary}
              opacity="0.3"
            />
          </svg>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "200%",
            height: "100%",
            animation: "wave 18s linear infinite",
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <path
              d="M0,50 C200,80 400,20 600,50 C800,80 1000,20 1200,50 L1200,120 L0,120 Z"
              fill={themeColors.primary}
              opacity="0.2"
            />
          </svg>
        </Box>
      </Box>

      {/* Footer Content */}
      <Box
        component="footer"
        sx={{
          bgcolor: themeColors.primary,
          color: "#ffffff",
          p: { xs: 2, md: 2 },
          pt: { xs: 4, md: 6 },
        }}
      >
        <Container padding="0">
          <Grid container sx={{ mb: { xs: 4, md: 6 } }}>
            {/* Column 1: About */}
            <Grid xs={12} sm={6} md={3}>
              <Typography.CardTitle size="md" color="white" sx={{ mb: 2 }}>
                Kim Angela Homestay
              </Typography.CardTitle>
              <Typography.Body
                size="sm"
                color="white"
                sx={{ opacity: 0.8, lineHeight: 1.8 }}
              >
                Your home away from home in the beautiful island paradise of El
                Nido, Palawan.
              </Typography.Body>
            </Grid>

            {/* Column 2: Quick Links */}
            <Grid xs={12} sm={6} md={3}>
              <Typography.CardTitle size="md" color="white" sx={{ mb: 2 }}>
                Quick Links
              </Typography.CardTitle>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <Typography.Body
                      size="sm"
                      color="white"
                      sx={{
                        opacity: 0.8,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          opacity: 1,
                          color: "#f6d33e",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      {link.label}
                    </Typography.Body>
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Column 3: Contact */}
            <Grid xs={12} sm={6} md={3}>
              <Typography.CardTitle size="md" color="white" sx={{ mb: 2 }}>
                Contact Us
              </Typography.CardTitle>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Address */}
                <Box
                  sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                >
                  <LocationOn sx={{ fontSize: 20, color: themeColors.white }} />
                  <Typography.Body
                    size="sm"
                    color="white"
                    sx={{ opacity: 0.8, lineHeight: 1.6 }}
                  >
                    Barangay Corong-Corong, El Nido, Palawan, Philippines 5313
                  </Typography.Body>
                </Box>

                {/* Phone */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Phone sx={{ fontSize: 20, color: themeColors.white }} />
                  <Typography.Body
                    size="sm"
                    color="white"
                    sx={{ opacity: 0.8 }}
                  >
                    +63 917 123 4567
                  </Typography.Body>
                </Box>

                {/* Email */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Email sx={{ fontSize: 20, color: themeColors.white }} />
                  <Typography.Body
                    size="sm"
                    color="white"
                    sx={{ opacity: 0.8 }}
                  >
                    info@kimangelahomestay.com
                  </Typography.Body>
                </Box>
              </Box>
            </Grid>

            {/* Column 4: Follow Us */}
            <Grid xs={12} sm={6} md={3}>
              <Typography.CardTitle size="md" color="white" sx={{ mb: 2 }}>
                Follow Us
              </Typography.CardTitle>
              <Typography.Body
                size="sm"
                color="white"
                sx={{ mb: 2, opacity: 0.8 }}
              >
                Stay connected for updates and special offers
              </Typography.Body>
              <Box sx={{ display: "flex", gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        bgcolor: themeColors.primary,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

          {/* Copyright */}
          <Box sx={{ textAlign: "center" }}>
            <Typography.Body size="sm" color="white" sx={{ opacity: 0.6 }}>
              © {currentYear} Kim Angela Homestay. All rights reserved.
            </Typography.Body>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
