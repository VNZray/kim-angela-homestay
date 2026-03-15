import RoomList from "@/components/room-components/RoomList";
import SectionHeader from "@/components/SectionHeader";
import { getColors } from "@/utils/Colors";
import { Box, useColorScheme } from "@mui/joy";

export default function Rooms() {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: themeColors.odd,
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 10 },
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        <SectionHeader
          title="Our Rooms"
          subtitle="Explore our comfortable and well-appointed accommodations"
        />
        <RoomList showBookButton={true} />
      </Box>
    </Box>
  );
}
