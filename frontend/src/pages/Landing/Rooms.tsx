import RoomList from "@/components/room-components/RoomList";
import SectionHeader from "@/components/SectionHeader";
import { Box } from "@mui/joy";

export default function Rooms() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
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
