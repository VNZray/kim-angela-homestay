import { Box, Grid, IconButton, Divider } from "@mui/joy";
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

/**
 * Footer Component
 * Minimalist footer with contact info, quick links, and social media
 * Responsive: 4 columns on desktop, single column on mobile
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a1a",
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
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <LocationOn sx={{ fontSize: 20, color: "#da5019" }} />
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
                <Phone sx={{ fontSize: 20, color: "#da5019" }} />
                <Typography.Body size="sm" color="white" sx={{ opacity: 0.8 }}>
                  +63 917 123 4567
                </Typography.Body>
              </Box>

              {/* Email */}
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Email sx={{ fontSize: 20, color: "#da5019" }} />
                <Typography.Body size="sm" color="white" sx={{ opacity: 0.8 }}>
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
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "#f6d33e",
                      color: "#1a1a1a",
                      transform: "translateY(-3px)",
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
  );
};

export default Footer;
