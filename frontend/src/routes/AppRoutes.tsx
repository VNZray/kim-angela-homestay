import { AuthProvider } from "@/context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import Layout from "../layouts/Layout";
import About from "../pages/About";
import { TourismDashboard } from "../pages/Admin/Dashboard";
import { AccommodationDashboard } from "../pages/Business/accommodation/Dashboard";
import { ShopDashboard } from "../pages/Business/shop/Dashboard";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Projects from "../pages/Projects";
import { Box, Typography } from "@mui/joy";
import { Routes, Route, Outlet } from "react-router-dom";

const PagePlaceholder = ({ title }: { title: string }) => (
  <Box sx={{ p: 2 }}>
    <Typography level="h2">{title}</Typography>
    <Typography level="body-md">Page content goes here.</Typography>
  </Box>
);

export default function AppRoutes() {
  // Hardcoded for now, but usually comes from Auth Context
  const business_type = "Accommodation";

  return (
    <Routes>
      <Route
        element={
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        }
      >
        {/* 1. PUBLIC ROUTES */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* 2. TOURISM ROUTES */}
        <Route path="/tourism" element={<DashboardLayout />}>
          <Route index element={<TourismDashboard />} />
          <Route path="dashboard" element={<TourismDashboard />} />
          <Route
            path="approval"
            element={<PagePlaceholder title="Approval" />}
          />

          {/* Services */}
          <Route path="services">
            <Route
              path="spots"
              element={<PagePlaceholder title="Tourist Spots" />}
            />
            <Route path="events" element={<PagePlaceholder title="Events" />} />
            <Route
              path="accommodations"
              element={<PagePlaceholder title="Accommodations List" />}
            />
            <Route
              path="shops"
              element={<PagePlaceholder title="Shops List" />}
            />
          </Route>

          <Route path="reports" element={<PagePlaceholder title="Reports" />} />

          {/* User Management */}
          <Route
            path="users/staffs"
            element={<PagePlaceholder title="Manage Tourism Staff" />}
          />
          <Route
            path="users/create"
            element={<PagePlaceholder title="Create Staff" />}
          />
          <Route
            path="users/roles"
            element={<PagePlaceholder title="Create Role" />}
          />

          <Route
            path="profile"
            element={<PagePlaceholder title="Admin Profile" />}
          />
          <Route
            path="settings"
            element={<PagePlaceholder title="Admin Settings" />}
          />
        </Route>

        {/* 3. BUSINESS ROUTES */}
        <Route path="/business" element={<DashboardLayout />}>
          {/* We conditionally render children based on type, but the PARENT route (/business) always exists */}
          {business_type === "Accommodation" ? (
            <>
              <Route index element={<AccommodationDashboard />} />
              <Route path="dashboard" element={<AccommodationDashboard />} />
              <Route
                path="transactions"
                element={<PagePlaceholder title="Transactions" />}
              />
              <Route
                path="bookings"
                element={<PagePlaceholder title="Bookings" />}
              />
              <Route
                path="rooms"
                element={<PagePlaceholder title="Manage Rooms" />}
              />
              <Route
                path="promotions"
                element={<PagePlaceholder title="Manage Promotions" />}
              />
              <Route
                path="staff"
                element={<PagePlaceholder title="Manage Staff" />}
              />
            </>
          ) : (
            <>
              <Route index element={<ShopDashboard />} />
              <Route path="dashboard" element={<ShopDashboard />} />
              <Route
                path="orders"
                element={<PagePlaceholder title="Shop Orders" />}
              />
              {/* Add other Shop specific routes here */}
            </>
          )}
          {/* Shared Business Routes (Settings, etc.) can go here if they apply to both */}
          <Route
            path="profile"
            element={<PagePlaceholder title="Business Profile" />}
          />
          <Route
            path="subscription"
            element={<PagePlaceholder title="Manage Subscription" />}
          />

          <Route
            path="reviews"
            element={<PagePlaceholder title="Manage Reviews" />}
          />
          <Route
            path="settings"
            element={<PagePlaceholder title="Business Settings" />}
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
