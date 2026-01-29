import {
  AspectRatio,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Sheet,
  useColorScheme,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  ListDivider,
} from "@mui/joy";
import Typography from "./ui/Typography";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Close,
  Logout,
  Person,
  Settings,
} from "@mui/icons-material";
import Logo from "@/assets/km-anegla-logo.jpg";
import Container from "./Container";
import { useState } from "react";
import LoginModal from "./auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
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
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ["Home", "Rooms", "Services", "About"];
  const [isOpen, setIsOpen] = useState(false);

  const openLoginModal = () => {
    setIsOpen(true);
  };

  const closeLoginModal = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

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
                  variant={isActive ? "plain" : "plain"}
                  colorScheme={isActive ? "primary" : "primary"}
                >
                  {item}
                </Button>
              </Link>
            );
          })}

          {/* Show Login button or User Profile */}
          {!loading &&
            (user ? (
              <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{ root: { variant: "plain", color: "neutral" } }}
                  sx={{ borderRadius: "50%", padding: 0 }}
                >
                  <Avatar
                    src={user.photoURL || undefined}
                    color="primary"
                    variant="solid"
                  >
                    {getInitials(user.displayName, user.email)}
                  </Avatar>
                </MenuButton>
                <Menu
                  placement="bottom-end"
                  sx={{ minWidth: 200, zIndex: 1300 }}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography.Body size="sm" bold>
                        {user.displayName || "User"}
                      </Typography.Body>
                      <Typography.Body size="xs" color="primary">
                        {user.email}
                      </Typography.Body>
                    </Box>
                  </MenuItem>
                  <ListDivider />
                  <MenuItem onClick={() => navigate("/profile")}>
                    <Person sx={{ mr: 1 }} />
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/bookings")}>
                    <Settings sx={{ mr: 1 }} />
                    My Bookings
                  </MenuItem>
                  <ListDivider />
                  <MenuItem onClick={handleLogout} color="danger">
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Dropdown>
            ) : (
              <Button onClick={openLoginModal}>Login</Button>
            ))}

          <ModeToggle />
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
            <MenuIcon />
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
                    variant={isActive ? "plain" : "plain"}
                    colorScheme={isActive ? "primary" : "primary"}
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
            {!loading &&
              (user ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                      p: 1,
                      borderRadius: "sm",
                      bgcolor: "background.level1",
                    }}
                  >
                    <Avatar
                      src={user.photoURL || undefined}
                      color="primary"
                      variant="solid"
                    >
                      {getInitials(user.displayName, user.email)}
                    </Avatar>
                    <Box>
                      <Typography.Body size="sm" bold>
                        {user.displayName || "User"}
                      </Typography.Body>
                      <Typography.Body size="xs" color="primary">
                        {user.email}
                      </Typography.Body>
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                    sx={{ mb: 1 }}
                  >
                    <Person sx={{ mr: 1 }} />
                    My Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      navigate("/bookings");
                      setMobileMenuOpen(false);
                    }}
                    sx={{ mb: 1 }}
                  >
                    <Settings sx={{ mr: 1 }} />
                    My Bookings
                  </Button>
                  <Button
                    fullWidth
                    colorScheme="error"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  fullWidth
                  onClick={() => {
                    openLoginModal();
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              ))}
          </Box>
        </Box>
      </Drawer>

      <LoginModal open={isOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
