import * as React from "react";
import { Outlet } from "react-router-dom";
import {
  Avatar,
  Box,
  IconButton,
  Sheet,
  useColorScheme,
} from "@mui/joy";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function DashboardLayout() {
  // State for Desktop Collapse
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // State for Mobile Drawer
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  function ModeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
      <IconButton
        variant="plain"
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      >
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Component */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        isMobile={isMobileSidebarOpen}
        closeMobileSidebar={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile Overlay (Darkens background when sidebar is open on mobile) */}
      {isMobileSidebarOpen && (
        <Box
          onClick={() => setMobileSidebarOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: { xs: "block", md: "none" },
          }}
        />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Mobile Header (Only visible on small screens) */}
        <Sheet
          sx={{
            display: { xs: "flex", md: "flex" },
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor:  {xs: "#0A1B47", md: "background.surface"},
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <IconButton
              sx={{ display: { sx: "flex", md: "none" } }}
              onClick={() => setMobileSidebarOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
              gap: 1.5,
            }}
          >
            <ModeToggle />
            <Avatar variant="solid" color="danger" size="sm">
              CV
            </Avatar>
          </Box>
        </Sheet>

        {/* Page Content */}
        <Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
