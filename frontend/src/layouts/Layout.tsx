import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Sheet,
  Typography,
  useColorScheme,
  Button,
  Box,
  IconButton,
  Avatar,
} from "@mui/joy";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";

// Mode Toggle Component
function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

export default function Layout() {
  const location = useLocation();

  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.body",
      }}
    >
      {/* Navigation Bar */}
      <Sheet
        component="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: "background.surface",
        }}
      >
        <Typography
          level="h4"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "text.primary" }}
        >
          RC
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {["Home", "Projects", "About"].map((item) => (
            <Button
              key={item}
              component={Link}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              variant={
                location.pathname ===
                (item === "Home" ? "/" : `/${item.toLowerCase()}`)
                  ? "soft"
                  : "plain"
              }
              color="neutral"
            >
              {item}
            </Button>
          ))}
          <Button>Login</Button>
          <ModeToggle />
          <IconButton sx={{ borderRadius: "50%", padding: 0 }}>
            <Avatar color="warning" variant="solid">
              RC
            </Avatar>
          </IconButton>
        </Box>
      </Sheet>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Sheet
        component="footer"
        sx={{
          p: 2,
          textAlign: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography level="body-sm">
          © {new Date().getFullYear()} Rayven Clores. Built with React & MUI Joy
          UI.
        </Typography>
      </Sheet>
    </Sheet>
  );
}
