import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Services from "@/pages/Services";
import { Box, Typography } from "@mui/joy";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/BusinessLayout";
import Layout from "../layouts/Layout";
import About from "../pages/About";
import { AccommodationDashboard } from "../pages/Business/Dashboard";
import UserManagement from "../pages/Business/UserManagement";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import Rooms from "../pages/Rooms";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "@/components/Loading";

const PagePlaceholder = ({ title }: { title: string }) => (
  <Box sx={{ p: 2 }}>
    <Typography level="h2">{title}</Typography>
    <Typography level="body-md">Page content goes here.</Typography>
  </Box>
);

function RedirectNonTourist({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user && user.role !== "tourist") {
    return <Navigate to="/business/dashboard" replace />;
  }

  return children;
}

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
        <Route
          path="/"
          element={
            <RedirectNonTourist>
              <Layout />
            </RedirectNonTourist>
          }
        >
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route
          path="/auth"
          element={
            <RedirectNonTourist>
              <AuthLayout />
            </RedirectNonTourist>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />
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

          {/* User Management - Admin Only */}
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
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
