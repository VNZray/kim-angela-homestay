/**
 * Formats a user's online status into a human-readable string.
 *
 * Returns "Online" if currently online, otherwise a relative time like:
 * "Active 1 min ago", "Active 30 mins ago", "Active 2 hours ago",
 * "Active yesterday", "Active 3 days ago", etc.
 */
export function formatUserStatus(
    isOnline: boolean | null,
    lastActiveAt: string | null,
): string {
    if (isOnline) return "Online";
    if (!lastActiveAt) return "Offline";

    const now = new Date();
    const lastActive = new Date(lastActiveAt);
    const diffMs = now.getTime() - lastActive.getTime();

    if (diffMs < 0) return "Online";

    const diffMinutes = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMinutes < 1) return "Active just now";
    if (diffMinutes === 1) return "Active 1 min ago";
    if (diffMinutes < 60) return `Active ${diffMinutes} mins ago`;
    if (diffHours === 1) return "Active 1 hour ago";
    if (diffHours < 24) return `Active ${diffHours} hours ago`;
    if (diffDays === 1) return "Active yesterday";
    if (diffDays < 30) return `Active ${diffDays} days ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "Active 1 month ago";
    if (diffMonths < 12) return `Active ${diffMonths} months ago`;

    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) return "Active 1 year ago";
    return `Active ${diffYears} years ago`;
}

/** Returns the appropriate color for a MUI Joy Chip based on online status */
export function getStatusColor(
    isOnline: boolean | null,
): "success" | "neutral" | "warning" {
    if (isOnline) return "success";
    return "neutral";
}
