import { getColors } from "@/utils/Colors";
import {
  Email,
  Facebook,
  Instagram,
  LocationOn,
  Phone,
} from "@mui/icons-material";
import { Box, Divider, Grid, useColorScheme } from "@mui/joy";
import { Link } from "react-router-dom";
import IconButton from "./ui/IconButton";
import Typography from "./ui/Typography";

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
          height: { xs: "60px", sm: "80px", md: "120px" },
          overflow: "hidden",
          bgcolor: "transparent",
        }}
      >
        {/* Wave Layer 1 - Back */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "-5%",
            width: "210%",
            height: "100%",
            animation: "waveBack 18s ease-in-out infinite",
            "@keyframes waveBack": {
              "0%": { transform: "translateX(0)" },
              "50%": { transform: "translateX(-25%)" },
              "100%": { transform: "translateX(0)" },
            },
          }}
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <path
              d="M0,80 C120,95 240,40 360,60 C480,80 600,100 720,80 C840,60 960,30 1080,50 C1200,70 1320,90 1440,75 L1440,120 L0,120 Z"
              fill={themeColors.primary}
              opacity="0.25"
            />
          </svg>
        </Box>

        {/* Wave Layer 2 - Mid */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "-5%",
            width: "210%",
            height: "100%",
            animation: "waveMid 12s ease-in-out infinite reverse",
            "@keyframes waveMid": {
              "0%": { transform: "translateX(0)" },
              "50%": { transform: "translateX(-20%)" },
              "100%": { transform: "translateX(0)" },
            },
          }}
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <path
              d="M0,60 C180,90 360,30 540,55 C720,80 900,95 1080,65 C1200,45 1320,70 1440,55 L1440,120 L0,120 Z"
              fill={themeColors.primary}
              opacity="0.5"
            />
          </svg>
        </Box>

        {/* Wave Layer 3 - Front */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "-5%",
            width: "210%",
            height: "100%",
            animation: "waveFront 15s ease-in-out infinite",
            "@keyframes waveFront": {
              "0%": { transform: "translateX(0)" },
              "50%": { transform: "translateX(-22%)" },
              "100%": { transform: "translateX(0)" },
            },
          }}
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <path
              d="M0,70 C200,100 400,40 600,65 C800,90 1000,50 1200,70 C1320,80 1400,60 1440,65 L1440,120 L0,120 Z"
              fill={themeColors.primary}
              opacity="1"
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
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          pt: { xs: 4, md: 6 },
          pb: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
          <Grid
            container
            spacing={{ xs: 3, sm: 3, md: 4 }}
            sx={{ mb: { xs: 3, md: 5 } }}
          >
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
                Your home away from home in the beautiful island paradise of
                Caramoan.
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
                    Barangay Paniman, Caramoan, Camarines Sur, Philippines
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
                    +63 921 041 7303
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
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography.Body size="sm" color="white" sx={{ opacity: 0.6 }}>
              © {currentYear} Kim Angela Homestay. All rights reserved.
            </Typography.Body>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
