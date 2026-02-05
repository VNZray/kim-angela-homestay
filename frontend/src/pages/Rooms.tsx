import PageContainer from "@/components/PageContainer";
import RoomList from "@/components/room-components/RoomList";
import { Box, useColorScheme } from "@mui/joy";
import SectionHeader from "@/components/SectionHeader";
import { getColors } from "@/utils/Colors";

/**
 * Rooms Page
 * Public page displaying all available rooms for guests to browse
 */
export default function Rooms() {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);

  return (
    <PageContainer sx={{ bgcolor: themeColors.odd }}>
      <Box sx={{ mt: 10 }}>
        <SectionHeader
          title="Our Rooms"
          subtitle="Explore our comfortable and well-appointed accommodations"
        />
      </Box>
      <RoomList showBookButton={true} />
    </PageContainer>
  );
}
