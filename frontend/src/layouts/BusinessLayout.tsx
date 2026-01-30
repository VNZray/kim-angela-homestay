import * as React from "react";
import { Outlet } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Sheet,
  Typography,
  useColorScheme,
} from "@mui/joy";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/Colors";

export default function DashboardLayout() {
  // Get user data from auth context
  const { user } = useAuth();

  // State for Mobile Drawer
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "danger";
      case "manager":
        return "warning";
      case "staff":
        return "primary";
      default:
        return "neutral";
    }
  };

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
            bgcolor: colors.transparent,
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

            {/* User Info Section */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                alignItems: "flex-end",
                mr: 1,
              }}
            >
              <Typography level="title-sm" sx={{ lineHeight: 1.2 }}>
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>

            {/* Role Badge */}
            <Chip
              size="sm"
              variant="soft"
              color={getRoleColor(user?.role || "tourist")}
              sx={{
                display: { xs: "none", md: "flex" },
                textTransform: "capitalize",
                fontWeight: "md",
              }}
            >
              {user?.role || "Tourist"}
            </Chip>

            {/* User Avatar */}
            <Avatar
              variant="solid"
              color={getRoleColor(user?.role || "tourist")}
              size="sm"
              src={user?.photoURL || undefined}
              alt={user?.displayName || user?.email || "User"}
            >
              {getUserInitials()}
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
