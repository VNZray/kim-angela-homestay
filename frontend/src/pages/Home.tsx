import { Box } from "@mui/joy";
import Hero from "../components/home-components/Hero";
import ValueProposition from "../components/home-components/ValueProposition";
import FeaturedRooms from "../components/home-components/FeaturedRooms";
import IslandHopping from "../components/home-components/IslandHopping";
import DiningPackages from "../components/home-components/DiningPackages";
import Amenities from "../components/home-components/Amenities";
import Footer from "../components/Footer";

/**
 * Home Page Component
 * Main landing page composing all sections for Kim Angela Homestay
 * Follows Island Minimalist design philosophy with mobile-first approach
 */
export default function Home() {
  return (
    <Box>
      <Hero />
      <ValueProposition />
    </Box>
  );
}
