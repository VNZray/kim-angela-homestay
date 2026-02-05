import { useAuth } from "@/context/AuthContext";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Tooltip,
  Typography,
} from "@mui/joy";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Icons
import { Logout } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

// Newly added icons for the specific layouts
import { colors } from "@/utils/Colors";
import BedIcon from "@mui/icons-material/Bed"; // Manage Rooms
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Bookings
import CampaignIcon from "@mui/icons-material/Campaign"; // Promotions
import CardMembershipIcon from "@mui/icons-material/CardMembership"; // Subscription
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Transactions
import StarIcon from "@mui/icons-material/Star"; // Reviews

interface SidebarProps {
  isMobile: boolean;
  closeMobileSidebar: () => void;
}

type MenuItem = {
  title: string;
  icon: React.ReactElement;
  path?: string;
  children?: { title: string; path: string; icon: React.ReactElement }[];
  requiredRole?: "admin" | "owner" | "business"; // Optional: restrict menu item to specific roles
};

const business = "/business";
const BUSINESS_NAME = "Kim Angela Homestay";

// --- 2. ACCOMMODATION (BUSINESS) MENU STRUCTURE ---
const accommodationMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: `${business}/dashboard`,
  },
  {
    title: "Transactions",
    icon: <ReceiptLongIcon />,
    path: `${business}/transactions`,
  },
  {
    title: "Bookings",
    icon: <CalendarMonthIcon />,
    path: `${business}/bookings`,
  },
  {
    title: "Manage Promotions",
    icon: <CampaignIcon />,
    path: `${business}/promotions`,
  },
  {
    title: "Manage Rooms",
    icon: <BedIcon />,
    path: `${business}/rooms`,
  },
  {
    title: "Subscription",
    icon: <CardMembershipIcon />,
    path: `${business}/subscription`,
  },
  {
    title: "Reviews & Ratings",
    icon: <StarIcon />,
    path: `${business}/reviews`,
  },
  {
    title: "Manage Staff",
    icon: <GroupIcon />,
    path: `${business}/staff`,
  },
  {
    title: "User Management",
    icon: <PersonIcon />,
    path: `${business}/users`,
    requiredRole: "admin", // Only admins can see this
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    path: `${business}/settings`,
  },
];

export default function Sidebar({
  isMobile,
  closeMobileSidebar,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  // Use actual user role from auth context (defaults to accommodation menu)
  const menuToRender = accommodationMenuItems;

  // Filter menu items based on user role
  const filteredMenu = menuToRender.filter((item) => {
    if (!item.requiredRole) return true; // No role requirement, show to everyone
    return user?.role === item.requiredRole; // Only show if user has required role
  });

  // Separate main navigation from settings so Settings can be placed in the footer
  const settingsItem = menuToRender.find((item) => item.title === "Settings");
  const settingsPath = settingsItem?.path ?? `${business}/settings`;

  const mainMenuItems = filteredMenu.filter(
    (item) => item.title !== "Settings",
  );

  const handleGroupClick = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      const first = parts[0]?.[0];
      const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
      return `${first ?? ""}${last ?? ""}`.toUpperCase();
    }

    if (email && email.length > 0) {
      return email[0]?.toUpperCase();
    }

    return "KH"; // Default initials for Kim Angela Homestay
  };

  const userInitials = getInitials(user?.displayName, user?.email ?? undefined);
  const userSubtitle = user?.email ?? "Business dashboard";
  const isCollapsedUI = false; // Collapse behavior removed; sidebar is always expanded

  return (
    <Sheet
      className="Sidebar"
      variant="solid"
      invertedColors
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: isMobile ? "translateX(0)" : "translateX(-100%)",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 1000,
        height: "100vh",
        width: "260px",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: colors.primary,
      }}
    >
      {/* 1. Header */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          minHeight: 56,
        }}
      >
        <Avatar variant="solid" color="primary" size="sm">
          {userInitials}
        </Avatar>
        {!isCollapsedUI && (
          <Box sx={{ ml: 1, overflow: "hidden" }}>
            <Typography level="title-md" sx={{ whiteSpace: "nowrap" }}>
              {BUSINESS_NAME}
            </Typography>
            <Typography
              level="body-xs"
              sx={{
                color: "text.tertiary",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {userSubtitle}
            </Typography>
          </Box>
        )}
        <IconButton
          variant="plain"
          sx={{
            ml: "auto",
            display: { xs: "flex", md: "none" },
          }}
          onClick={closeMobileSidebar}
        >
          <MenuOpenIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 2. Navigation Items */}
      <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "8px" }}>
        {/* DYNAMICALLY RENDER THE FILTERED MENU */}
        {mainMenuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem>
              {item.children ? (
                <ListItemButton
                  onClick={() => handleGroupClick(item.title)}
                  selected={openMenus[item.title]}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: colors.secondary,
                      color: "primary.plainColor",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: colors.secondary,
                    },
                    position: "relative",
                  }}
                >
                  {item.icon}
                  <ListItemContent
                    sx={{
                      ml: 1.5,
                      opacity: isCollapsedUI ? 0 : 1,
                      display: isCollapsedUI ? "none" : "block",
                    }}
                  >
                    <Typography level="title-md">{item.title}</Typography>
                  </ListItemContent>
                  {!isCollapsedUI && (
                    <KeyboardArrowDown
                      sx={{
                        transform: openMenus[item.title]
                          ? "rotate(180deg)"
                          : "none",
                      }}
                    />
                  )}
                </ListItemButton>
              ) : (
                <Tooltip
                  title={isCollapsedUI ? item.title : ""}
                  placement="right"
                >
                  <ListItemButton
                    component={Link}
                    to={item.path!}
                    selected={location.pathname === item.path}
                    sx={{
                      "&.Mui-selected": {
                        bgcolor: colors.transparentBlack,
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: colors.transparentBlack,
                      },
                      position: "relative",
                    }}
                  >
                    {item.icon}
                    <ListItemContent
                      sx={{
                        ml: 1.5,
                        opacity: isCollapsedUI ? 0 : 1,
                        display: isCollapsedUI ? "none" : "block",
                      }}
                    >
                      <Typography level="title-md">{item.title}</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </Tooltip>
              )}
            </ListItem>

            {item.children && openMenus[item.title] && (
              <List sx={{ ml: 3, gap: 0.5, maxHeight: 260, overflowY: "auto" }}>
                {item.children.map((child) => (
                  <ListItem key={child.title}>
                    <ListItemButton
                      component={Link}
                      to={child.path}
                      selected={location.pathname === child.path}
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: colors.transparentBlack,
                          color: "inherit",
                        },
                      }}
                    >
                      {child.icon}
                      <ListItemContent sx={{ ml: 1.5 }}>
                        <Typography level="body-sm">{child.title}</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* 3. Settings & Logout */}
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
            <Tooltip title={isCollapsedUI ? "Settings" : ""} placement="right">
              <ListItemButton
                component={Link}
                to={settingsPath}
                selected={location.pathname === settingsPath}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: colors.transparentBlack,
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: colors.transparentBlack,
                  },
                }}
              >
                <SettingsIcon />
                <ListItemContent
                  sx={{
                    ml: 1.5,
                    opacity: isCollapsedUI ? 0 : 1,
                    display: isCollapsedUI ? "none" : "block",
                  }}
                >
                  <Typography level="title-md">Settings</Typography>
                </ListItemContent>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem>
            <Tooltip title={isCollapsedUI ? "Logout" : ""} placement="right">
              <ListItemButton
                component="button"
                onClick={handleLogout}
                sx={{
                  justifyContent: isCollapsedUI ? "center" : "flex-start",
                }}
              >
                <Logout />
                <ListItemContent
                  sx={{
                    ml: 1.5,
                    opacity: isCollapsedUI ? 0 : 1,
                    display: isCollapsedUI ? "none" : "block",
                  }}
                >
                  <Typography level="title-md">Logout</Typography>
                </ListItemContent>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Sheet>
  );
}
