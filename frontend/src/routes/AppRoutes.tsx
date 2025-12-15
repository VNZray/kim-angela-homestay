import { AuthProvider } from "@/context/AuthContext";
import { Box, Typography } from "@mui/joy";
import { Outlet, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/BusinessLayout";
import Layout from "../layouts/Layout";
import About from "../pages/About";
import { AccommodationDashboard } from "../pages/Business/Dashboard";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Rooms from "../pages/Rooms";
import Services from "@/pages/Services";

const PagePlaceholder = ({ title }: { title: string }) => (
  <Box sx={{ p: 2 }}>
    <Typography level="h2">{title}</Typography>
    <Typography level="body-md">Page content goes here.</Typography>
  </Box>
);

export default function AppRoutes() {
  // Hardcoded for now, but usually comes from Auth Context
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
          <Route path="rooms" element={<Rooms />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* 3. BUSINESS ROUTES */}
        <Route path="/business" element={<DashboardLayout />}>
          {/* We conditionally render children based on type, but the PARENT route (/business) always exists */}

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
