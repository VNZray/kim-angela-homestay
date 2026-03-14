import { Box, AspectRatio, Chip } from "@mui/joy";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { Users, Layers, Maximize2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import IconButton from "@/components/ui/IconButton";
import type { Room } from "@/types/Room";

interface RoomManagementCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onView: (room: Room) => void;
}

const PLACEHOLDER_IMAGE =
  "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";

export default function RoomManagementCard({
  room,
  onEdit,
  onDelete,
  onView,
}: RoomManagementCardProps) {
  return (
    <Card
      colorScheme="light"
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
        p: 0,
      }}
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
            size="sm"
            variant="solid"
            color="warning"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              fontWeight: 600,
            }}
          >
            {room.room_type}
          </Chip>
        )}

        {/* Floor Badge */}
        {room.floor && (
          <Chip
            size="sm"
            variant="soft"
            color="neutral"
            sx={{
              position: "absolute",
              top: 8,
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
        <Box sx={{ mb: 1.5 }}>
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

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 1.5,
          }}
        >
          <IconButton
            variant="soft"
            colorScheme="info"
            size="sm"
            onClick={() => onView(room)}
          >
            <Visibility sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            variant="soft"
            colorScheme="primary"
            size="sm"
            onClick={() => onEdit(room)}
          >
            <Edit sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            variant="soft"
            colorScheme="error"
            size="sm"
            onClick={() => onDelete(room)}
          >
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
