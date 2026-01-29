import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Box, Sheet } from "@mui/joy";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>
    </Sheet>
  );
}
