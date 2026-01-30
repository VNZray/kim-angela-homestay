import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
  Sheet,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/joy";
import { useAuth } from "@/context/AuthContext";
// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ApprovalIcon from "@mui/icons-material/FactCheck";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import HotelIcon from "@mui/icons-material/Hotel";
import StoreIcon from "@mui/icons-material/Store";
import EventIcon from "@mui/icons-material/Event";
import TourIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Logout } from "@mui/icons-material";

// Newly added icons for the specific layouts
import AssessmentIcon from "@mui/icons-material/Assessment"; // Reports
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Transactions
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Bookings
import StorefrontIcon from "@mui/icons-material/Storefront"; // Business Profile
import CampaignIcon from "@mui/icons-material/Campaign"; // Promotions
import BedIcon from "@mui/icons-material/Bed"; // Manage Rooms
import CardMembershipIcon from "@mui/icons-material/CardMembership"; // Subscription
import StarIcon from "@mui/icons-material/Star"; // Reviews
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"; // Store (Parent)
import Inventory2Icon from "@mui/icons-material/Inventory2"; // Products
import CategoryIcon from "@mui/icons-material/Category"; // Categories
import BuildIcon from "@mui/icons-material/Build"; // Services (Store)
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Orders
import PercentIcon from "@mui/icons-material/Percent"; // Discount
import { colors } from "@/utils/Colors";

interface SidebarProps {
  isMobile: boolean;
  closeMobileSidebar: () => void;
}

type MenuItem = {
  title: string;
  icon: React.ReactElement;
  path?: string;
  children?: { title: string; path: string; icon: React.ReactElement }[];
  requiredRole?: "admin" | "manager" | "staff"; // Optional: restrict menu item to specific roles
};

// Define allowed roles for type safety
type Role = "admin" | "superadmin" | "owner" | "business";
// You can change this to "business" to see the other layouts
const CURRENT_ROLE: Role = "owner";
// If role is business, define type: "accommodation" or "shop"
const BUSINESS_TYPE = "accommodation";

const tourism = "/tourism";
const business = "/business";
const BUSINESS_NAME = "Kim Angela Homestay";

// --- 1. ADMIN (TOURISM) MENU STRUCTURE ---
const adminMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: `${tourism}/dashboard`,
  },
  { title: "Approval", icon: <ApprovalIcon />, path: `${tourism}/approval` },
  {
    title: "Services",
    icon: <RoomServiceIcon />,
    children: [
      {
        title: "Tourist Spot",
        path: `${tourism}/services/spots`,
        icon: <TourIcon />,
      },
      {
        title: "Event",
        path: `${tourism}/services/events`,
        icon: <EventIcon />,
      },
      {
        title: "Accommodation",
        path: `${tourism}/services/accommodations`,
        icon: <HotelIcon />,
      },
      {
        title: "Shop",
        path: `${tourism}/services/shops`,
        icon: <StoreIcon />,
      },
    ],
  },
  {
    title: "Reports",
    icon: <AssessmentIcon />,
    path: `${tourism}/reports`,
  },
  {
    title: "Manage Tourism Staff",
    icon: <GroupIcon />,
    path: `${tourism}/users/staffs`,
  },
  {
    title: "Profile",
    icon: <PersonIcon />,
    path: `${tourism}/profile`,
  },
  {
    title: "Settings",
    path: `${tourism}/settings`,
    icon: <SettingsIcon />,
  },
];

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
    title: "Business Profile",
    icon: <StorefrontIcon />,
    path: `${business}/profile`,
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

// --- 3. SHOP (BUSINESS) MENU STRUCTURE ---
const shopMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: `${business}/dashboard`,
  },
  {
    title: "Business Profile",
    icon: <StorefrontIcon />,
    path: `${business}/profile`,
  },
  {
    title: "Manage Promotions",
    icon: <CampaignIcon />,
    path: `${business}/promotions`,
  },
  {
    title: "Subscription",
    icon: <CardMembershipIcon />,
    path: `${business}/subscription`,
  },
  {
    title: "Store",
    icon: <ShoppingBagIcon />,
    children: [
      {
        title: "Products",
        path: `${business}/store/products`,
        icon: <Inventory2Icon />,
      },
      {
        title: "Categories",
        path: `${business}/store/categories`,
        icon: <CategoryIcon />,
      },
      {
        title: "Services",
        path: `${business}/store/services`,
        icon: <BuildIcon />,
      },
      {
        title: "Orders",
        path: `${business}/store/orders`,
        icon: <ShoppingCartIcon />,
      },
      {
        title: "Discount",
        path: `${business}/store/discount`,
        icon: <PercentIcon />,
      },
      {
        title: "Settings",
        path: `${business}/store/settings`,
        icon: <SettingsIcon />,
      },
    ],
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
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    Services: true,
    Store: true, // Open Store menu by default for Shop view
  });

  // Determine which menu to render based on Role and Business Type
  let menuToRender;
  if (CURRENT_ROLE !== "admin" && CURRENT_ROLE !== "superadmin") {
    if (BUSINESS_TYPE === "accommodation") {
      menuToRender = accommodationMenuItems;
    } else {
      menuToRender = shopMenuItems;
    }
  } else {
    menuToRender = adminMenuItems;
  }

  // Filter menu items based on user role
  const filteredMenu = menuToRender.filter((item) => {
    if (!item.requiredRole) return true; // No role requirement, show to everyone
    return user?.role === item.requiredRole; // Only show if user has required role
  });

  // Separate main navigation from settings so Settings can be placed in the footer
  const settingsItem = (menuToRender as MenuItem[]).find(
    (item) => item.title === "Settings",
  );

  const settingsPath =
    settingsItem?.path ??
    (CURRENT_ROLE === "admin" || CURRENT_ROLE === "superadmin"
      ? `${tourism}/settings`
      : `${business}/settings`);

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
