import { getColors } from "@/utils/Colors";
import { Box, useColorScheme } from "@mui/joy";
import Container from "../Container";
import SectionHeader from "../SectionHeader";
import Button from "../ui/Button";
import RoomList from "../room-components/RoomList";
import { useNavigate } from "react-router-dom";

/**
 * Featured Rooms Section
 * Displays featured room options with hover effects and interactive cards
 * Mobile: Horizontal scroll, Desktop: Grid layout
 * Now uses real data from the database
 */
const FeaturedRooms = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, md: 0 },
        bgcolor: themeColors.odd,
      }}
    >
      <Container padding="0" align="center">
        <SectionHeader
          title="Featured Rooms"
          subtitle="Choose from our carefully designed rooms that suit your needs"
        />

        {/* Display up to 3 featured rooms */}
        <RoomList limit={3} showBookButton={true} />

        {/* View All Button */}
        <Box sx={{ textAlign: "center", mt: { xs: 6, md: 8 } }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            sx={{ px: 6 }}
            onClick={() => navigate("/rooms")}
          >
            View All Rooms
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedRooms;
