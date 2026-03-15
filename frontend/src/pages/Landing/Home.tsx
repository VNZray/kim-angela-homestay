import { Box } from "@mui/joy";
import Hero from "./home/Hero";
import ValueProposition from "./home/ValueProposition";
import FeaturedRooms from "./home/FeaturedRooms";
import IslandHopping from "./home/IslandHopping";
import DiningPackages from "./home/DiningPackages";
import Amenities from "./home/Amenities";

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
      <FeaturedRooms />
      <IslandHopping />
      <DiningPackages />
      <Amenities />
    </Box>
  );
}
