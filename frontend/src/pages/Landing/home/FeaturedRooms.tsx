import { Box } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomList from "../../../components/room-components/RoomList";
import SectionHeader from "../../../components/SectionHeader";
import Button from "../../../components/ui/Button";

const FeaturedRooms = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
      }}
    >
      <Box
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <SectionHeader
          title="Featured Rooms"
          subtitle="Choose from our carefully designed rooms that suit your needs"
        />
        <RoomList limit={3} showBookButton={true} showDateFilter={false} />
        <Box sx={{ textAlign: "center", mt: { xs: 4, md: 6 } }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            sx={{ px: 6 }}
            onClick={() => navigate("/rooms")}
          >
            View All Rooms
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedRooms;
