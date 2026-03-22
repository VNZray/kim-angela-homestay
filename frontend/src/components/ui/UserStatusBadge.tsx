import { Chip } from "@mui/joy";
import { Circle } from "@mui/icons-material";
import { formatUserStatus, getStatusColor } from "@/utils/formatUserStatus";

interface UserStatusBadgeProps {
  isOnline: boolean | null;
  lastActiveAt: string | null;
  size?: "sm" | "md" | "lg";
}

/** Displays user online status as a chip with a colored dot indicator */
export default function UserStatusBadge({
  isOnline,
  lastActiveAt,
  size = "sm",
}: UserStatusBadgeProps) {
  const statusText = formatUserStatus(isOnline, lastActiveAt);
  const color = getStatusColor(isOnline);

  return (
    <Chip
      size={size}
      variant="soft"
      color={color}
      startDecorator={
        <Circle sx={{ fontSize: 8, color: isOnline ? "#22c55e" : "#9ca3af" }} />
      }
    >
      {statusText}
    </Chip>
  );
}
