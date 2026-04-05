import * as React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Tooltip,
  Typography as JoyTypography,
  useColorScheme,
} from "@mui/joy";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { DarkMode, LightMode, Logout } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BugReportIcon from "@mui/icons-material/BugReport";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/Colors";

const PORTAL_NAME = "Developer Portal";

const developerMenuItems = [
  { title: "All Tickets", icon: <DashboardIcon />, path: "/developer/tickets" },
  { title: "Bugs & Errors", icon: <BugReportIcon />, path: "/developer/bugs" },
  {
    title: "Submit Ticket",
    icon: <AddCircleOutlineIcon />,
    path: "/developer/submit",
  },
];

export default function DeveloperLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "D";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar */}
      <Sheet
        variant="solid"
        invertedColors
        sx={{
          position: { xs: "fixed", md: "sticky" },
          transform: {
            xs: isMobileSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            md: "none",
          },
          transition: "transform 0.4s",
          zIndex: 1000,
          height: "100dvh",
          width: "260px",
          top: 0,
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "#1a1a2e",
        }}
      >
        {/* Header */}
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "center", minHeight: 56 }}
        >
          <Avatar variant="solid" color="primary" size="sm">
            {getUserInitials()}
          </Avatar>
          <Box sx={{ ml: 1, overflow: "hidden" }}>
            <JoyTypography level="title-md" sx={{ whiteSpace: "nowrap" }}>
              {PORTAL_NAME}
            </JoyTypography>
            <JoyTypography
              level="body-xs"
              sx={{
                color: "text.tertiary",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {user?.email ?? "Developer"}
            </JoyTypography>
          </Box>
          <IconButton
            variant="plain"
            sx={{ ml: "auto", display: { xs: "flex", md: "none" } }}
            onClick={() => setMobileSidebarOpen(false)}
          >
            <MenuOpenIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Nav Items */}
        <List
          size="sm"
          sx={{ "--ListItem-radius": "8px", "--List-gap": "8px" }}
        >
          {developerMenuItems.map((item) => (
            <ListItem key={item.title}>
              <Tooltip title="" placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={
                    location.pathname === item.path ||
                    (item.path === "/developer/tickets" &&
                      location.pathname === "/developer")
                  }
                  sx={{
                    "&.Mui-selected": { bgcolor: colors.transparentBlack },
                    "&.Mui-selected:hover": {
                      bgcolor: colors.transparentBlack,
                    },
                  }}
                >
                  {item.icon}
                  <ListItemContent sx={{ ml: 1.5 }}>
                    <JoyTypography level="title-md">{item.title}</JoyTypography>
                  </ListItemContent>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <List
            size="sm"
            sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}
          >
            <ListItem>
              <ListItemButton component="button" onClick={handleLogout}>
                <Logout />
                <ListItemContent sx={{ ml: 1.5 }}>
                  <JoyTypography level="title-md">Logout</JoyTypography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Sheet>

      {/* Mobile Overlay */}
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          height: "100dvh",
        }}
      >
        {/* Top Bar */}
        <Sheet
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 900,
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{ display: { sx: "flex", md: "none" } }}
              onClick={() => setMobileSidebarOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ModeToggle />
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                alignItems: "flex-end",
                mr: 1,
              }}
            >
              <JoyTypography level="title-sm" sx={{ lineHeight: 1.2 }}>
                {user?.displayName || user?.email?.split("@")[0] || "Developer"}
              </JoyTypography>
              <JoyTypography level="body-xs" sx={{ color: "text.tertiary" }}>
                {user?.email}
              </JoyTypography>
            </Box>
            <Chip
              size="sm"
              variant="soft"
              color="success"
              sx={{
                display: { xs: "none", md: "flex" },
                textTransform: "capitalize",
                fontWeight: "md",
              }}
            >
              Developer
            </Chip>
            <Avatar
              variant="solid"
              color="success"
              size="sm"
              src={user?.photoURL || undefined}
            >
              {getUserInitials()}
            </Avatar>
          </Box>
        </Sheet>

        <Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
