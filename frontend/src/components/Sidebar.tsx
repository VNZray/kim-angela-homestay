import * as React from "react";
import { Link, useLocation } from "react-router-dom";
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

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  closeMobileSidebar: () => void;
}

type MenuItem = {
  title: string;
  icon: React.ReactElement;
  path?: string;
  children?: { title: string; path: string; icon: React.ReactElement }[];
};

// Define allowed roles for type safety
type Role = "admin" | "superadmin" | "owner" | "business";
// You can change this to "business" to see the other layouts
const CURRENT_ROLE: Role = "owner";
// If role is business, define type: "accommodation" or "shop"
const BUSINESS_TYPE = "accommodation";

const tourism = "/tourism";
const business = "/business";

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
  isCollapsed,
  toggleSidebar,
  isMobile,
  closeMobileSidebar,
}: SidebarProps) {
  const location = useLocation();
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

  const handleGroupClick = (title: string) => {
    if (isCollapsed && !isMobile) {
      toggleSidebar();
    }
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

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
        width: isCollapsed ? "60px" : "260px",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "#0A1B47",
      }}
    >
      {/* 1. Header */}
      <Box
        sx={{ display: "flex", gap: 1, alignItems: "center", minHeight: 40 }}
      >
        <Avatar variant="solid" color="danger" size="sm">
          CV
        </Avatar>
        <Typography
          level="title-lg"
          sx={{
            whiteSpace: "nowrap",
            opacity: isCollapsed ? 0 : 1,
            transition: "opacity 0.2s",
            display: isCollapsed ? "none" : "block",
          }}
        >
          City Ventures
        </Typography>
        <IconButton
          onClick={closeMobileSidebar}
          variant="plain"
          sx={{
            ml: "auto",
            display: { xs: "flex", md: "none" },
          }}
        >
          <MenuOpenIcon />
        </IconButton>
      </Box>

      {/* 2. Navigation Items */}
      <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
        {/* DYNAMICALLY RENDER THE SELECTED MENU */}
        {menuToRender.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem>
              {item.children ? (
                <ListItemButton
                  onClick={() => handleGroupClick(item.title)}
                  selected={openMenus[item.title]}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "var(--ListItemButton-hoverBackground)",
                      color: "inherit",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "var(--ListItemButton-hoverBackground)",
                    },
                  }}
                >
                  {item.icon}
                  <ListItemContent
                    sx={{
                      ml: 1.5,
                      opacity: isCollapsed ? 0 : 1,
                      display: isCollapsed ? "none" : "block",
                    }}
                  >
                    <Typography level="title-sm">{item.title}</Typography>
                  </ListItemContent>
                  {!isCollapsed && (
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
                  title={isCollapsed ? item.title : ""}
                  placement="right"
                >
                  <ListItemButton
                    component={Link}
                    to={item.path!}
                    selected={location.pathname === item.path}
                    sx={{
                      "&.Mui-selected": {
                        bgcolor: "var(--ListItemButton-hoverBackground)",
                        color: "inherit",
                        fontWeight: "bold",
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: "var(--ListItemButton-hoverBackground)",
                      },
                    }}
                  >
                    {item.icon}
                    <ListItemContent
                      sx={{
                        ml: 1.5,
                        opacity: isCollapsed ? 0 : 1,
                        display: isCollapsed ? "none" : "block",
                      }}
                    >
                      <Typography level="title-sm">{item.title}</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </Tooltip>
              )}
            </ListItem>

            {item.children && openMenus[item.title] && !isCollapsed && (
              <List sx={{ ml: 3, gap: 0.5, maxHeight: 260, overflowY: "auto" }}>
                {item.children.map((child) => (
                  <ListItem key={child.title}>
                    <ListItemButton
                      component={Link}
                      to={child.path}
                      selected={location.pathname === child.path}
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: "var(--ListItemButton-hoverBackground)",
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

      {/* 3. Logout */}
      <Box sx={{ mt: "auto" }}>
        <List size="sm" sx={{ "--ListItem-radius": "8px" }}>
          <ListItem>
            <Tooltip title={isCollapsed ? "Logout" : ""} placement="right">
              <ListItemButton
                component={Link}
                to="/"
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "var(--ListItemButton-hoverBackground)",
                  },
                }}
              >
                <Logout />
                <ListItemContent
                  sx={{
                    ml: 1.5,
                    opacity: isCollapsed ? 0 : 1,
                    display: isCollapsed ? "none" : "block",
                  }}
                >
                  <Typography level="title-sm">Logout</Typography>
                </ListItemContent>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Sheet>
  );
}
