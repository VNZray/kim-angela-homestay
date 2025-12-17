import {
  AspectRatio,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Sheet,
  useColorScheme,
} from "@mui/joy";
import Typography from "./ui/Typography";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { DarkMode, LightMode, Menu, Close } from "@mui/icons-material";
import Logo from "@/assets/km-anegla-logo.jpg";
import Container from "./Container";
import { useState } from "react";
function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;
  return (
    <IconButton
      variant="soft"
      color="neutral"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
    >
      {mode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}

const Header = () => {
  const location = window.location;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ["Home", "Rooms", "Services", "About"];

  return (
    <>
      <Sheet
        component="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backdropFilter: "blur(8px)",
        }}
      >
        <Container padding="0" direction="row" justify="center" align="center">
          <IconButton sx={{ borderRadius: "50%", padding: 0 }}>
            <Avatar color="warning" variant="solid">
              <AspectRatio ratio={1} sx={{ width: 90 }}>
                <img src={Logo} alt="Logo" />
              </AspectRatio>
            </Avatar>
          </IconButton>

          <Typography.Body size="md">Kim Angela Homestay</Typography.Body>
        </Container>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          {navItems.map((item) => {
            const to = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = location.pathname === to;
            return (
              <Link key={item} to={to} style={{ textDecoration: "none" }}>
                <Button
                  variant={isActive ? "soft" : "plain"}
                  colorScheme={isActive ? "primary" : "primary"}
                >
                  {item}
                </Button>
              </Link>
            );
          })}
          <Button>Login</Button>
          <ModeToggle />
          <IconButton sx={{ borderRadius: "50%", padding: 0 }}>
            <Avatar color="warning" variant="solid">
              RC
            </Avatar>
          </IconButton>
        </Box>

        {/* Mobile Menu Button */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            gap: 1,
            alignItems: "center",
          }}
        >
          <ModeToggle />
          <IconButton
            variant="outlined"
            color="neutral"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu />
          </IconButton>
        </Box>
      </Sheet>

      {/* Mobile Drawer */}
      <Drawer
        size="sm"
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography.CardTitle>Menu</Typography.CardTitle>
            <IconButton
              variant="plain"
              color="neutral"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Close />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {navItems.map((item) => {
              const to = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const isActive = location.pathname === to;
              return (
                <Link
                  key={item}
                  to={to}
                  style={{ textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "solid" : "plain"}
                    colorScheme={isActive ? "secondary" : "secondary"}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {item}
                  </Button>
                </Link>
              );
            })}
          </Box>

          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button fullWidth>Login</Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <IconButton sx={{ borderRadius: "50%", padding: 0 }}>
              <Avatar color="warning" variant="solid">
                RC
              </Avatar>
            </IconButton>
            <Typography.Body size="sm">Profile</Typography.Body>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
