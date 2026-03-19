import {
  Box,
  AspectRatio,
  Chip,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import { Edit, Delete, MoreVert } from "@mui/icons-material";
import { Users, Layers, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import IconButton from "@/components/ui/IconButton";
import type { Room } from "@/types/Room";
import type { Amenity } from "@/types/Amenity";

interface RoomManagementCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  amenities?: Amenity[];
}

const PLACEHOLDER_IMAGE =
  "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";

export default function RoomCard({
  room,
  onEdit,
  onDelete,
  amenities = [],
}: RoomManagementCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/business/rooms/${room.id}`);
  };

  return (
    <Card
      colorScheme="light"
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
        p: 0,
      }}
      onClick={handleCardClick}
    >
      {/* Room Image */}
      <Box sx={{ position: "relative" }}>
        <AspectRatio
          ratio="16/10"
          sx={{
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={room.room_profile || PLACEHOLDER_IMAGE}
            alt={`Room ${room.room_number}`}
            style={{ objectFit: "cover" }}
          />
        </AspectRatio>

        {/* Room Type Chip */}
        {room.room_type && (
          <Chip
            size="md"
            variant="soft"
            color="warning"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
            }}
          >
            {room.room_type}
          </Chip>
        )}

        {/* 3-dot Menu */}
        <Box
          sx={{ position: "absolute", top: 12, right: 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{
                root: {
                  variant: "solid" as const,
                  size: "sm" as const,
                  sx: {
                    bgcolor: "transparent",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    minWidth: 28,
                    minHeight: 28,
                  },
                },
              }}
            >
              <MoreVert sx={{ fontSize: 18 }} />
            </MenuButton>
            <Menu placement="bottom-end" size="sm">
              <MenuItem onClick={() => onEdit(room)}>
                <Edit sx={{ fontSize: 16, mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={() => onDelete(room)} color="danger">
                <Delete sx={{ fontSize: 16, mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>

        {/* Floor Badge */}
        {room.floor && (
          <Chip
            size="sm"
            variant="soft"
            color="neutral"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
            }}
          >
            Floor {room.floor}
          </Chip>
        )}
      </Box>

      {/* Card Content */}
      <Box sx={{ p: 2 }}>
        {/* Title Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box>
            <Typography.CardTitle size="sm" color="dark">
              {room.room_number || "TBA"}
            </Typography.CardTitle>
            <Typography.Body
              size="xs"
              color="default"
              sx={{ opacity: 0.7, mt: 0.25 }}
            >
              {room.description
                ? room.description.length > 60
                  ? room.description.slice(0, 60) + "..."
                  : room.description
                : "No description"}
            </Typography.Body>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            my: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Users size={14} opacity={0.6} />
            <Typography.Label size="xs" color="default">
              {room.capacity ?? "—"} pax
            </Typography.Label>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Maximize2 size={14} opacity={0.6} />
            <Typography.Label size="xs" color="default">
              {room.room_size ?? "—"}
            </Typography.Label>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Layers size={14} opacity={0.6} />
            <Typography.Label size="xs" color="default">
              Floor {room.floor ?? "—"}
            </Typography.Label>
          </Box>
        </Box>

        {/* Price */}
        <Box>
          <Typography.CardTitle size="sm" color="primary">
            ₱{room.room_price?.toLocaleString() ?? "—"}
            <Typography.Body size="xs" color="default">
              {" "}
              / night
            </Typography.Body>
          </Typography.CardTitle>
          {room.per_hour_rate && (
            <Typography.Label size="xs" color="default">
              ₱{room.per_hour_rate.toLocaleString()} / hour
            </Typography.Label>
          )}
        </Box>

        {/* Amenities */}
        {amenities.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
            {amenities.slice(0, 3).map((a) => (
              <Chip key={a.id} size="sm" variant="soft" color="neutral">
                {a.name}
              </Chip>
            ))}
            {amenities.length > 3 && (
              <Chip size="sm" variant="outlined" color="neutral">
                +{amenities.length - 3} more
              </Chip>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
}
