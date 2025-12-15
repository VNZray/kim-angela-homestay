import Header from "@/components/Header";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import { Box, IconButton, Sheet, Typography, useColorScheme } from "@mui/joy";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

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
      <Header />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
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
