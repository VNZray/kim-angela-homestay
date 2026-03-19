import {
  Avatar,
  Box,
  CircularProgress,
  Textarea,
  useColorScheme,
} from "@mui/joy";
import { Reply, Send, Star } from "@mui/icons-material";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { getColors } from "@/utils/Colors";
import Container from "../Container";

interface ExistingReply {
  id: string;
  message: string;
  created_at: string;
}

interface ReviewCardProps {
  rating: number;
  feedback: string | null;
  photos?: string[];
  reviewerName: string;
  createdAt: string;
  compact?: boolean;
  // reply props (only used in management view)
  existingReply?: ExistingReply | null;
  canReply?: boolean;
  isReplying?: boolean;
  replyDraft?: string;
  replySubmitting?: boolean;
  onReplyOpen?: () => void;
  onReplyCancel?: () => void;
  onReplyChange?: (value: string) => void;
  onReplySubmit?: () => void;
}

const ReviewCard = ({
  rating,
  feedback,
  photos,
  reviewerName,
  createdAt,
  compact = false,
  existingReply,
  canReply = false,
  isReplying = false,
  replyDraft = "",
  replySubmitting = false,
  onReplyOpen,
  onReplyCancel,
  onReplyChange,
  onReplySubmit,
}: ReviewCardProps) => {
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  const initials = reviewerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Container elevation={0} variant="outlined" background="light">
      {/* Header: Avatar + Name + Rating + Date */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            size={compact ? "sm" : "md"}
            sx={{
              bgcolor: `${colors.primary}20`,
              color: colors.primary,
              fontWeight: 700,
              fontSize: compact ? "0.75rem" : "0.85rem",
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography.Label size="sm" color="dark">
              {reviewerName}
            </Typography.Label>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  sx={{
                    fontSize: compact ? 14 : 16,
                    color: i < rating ? colors.secondary : `${colors.dark}20`,
                  }}
                />
              ))}
              <Typography.Body size="xs" color="default" sx={{ ml: 0.5 }}>
                {rating}/5
              </Typography.Body>
            </Box>
          </Box>
        </Box>
        <Typography.Body size="xs" color="default" sx={{ opacity: 0.6 }}>
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography.Body>
      </Box>

      {/* Feedback */}
      <Typography.Body
        size={compact ? "xs" : "sm"}
        color="dark"
        sx={{
          lineHeight: 1.6,
          ...(compact && {
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }),
        }}
      >
        {feedback || "No feedback provided."}
      </Typography.Body>

      {/* Photos */}
      {!compact && photos && photos.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
          {photos.map((photo, idx) => (
            <Box
              key={idx}
              sx={{
                width: 64,
                height: 64,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <img
                src={photo}
                alt={`Review photo ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Reply section — shown only in management view */}
      {!compact && (existingReply !== undefined || canReply) && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: `${colors.dark}14`,
          }}
        >
          {existingReply ? (
            /* Existing reply */
            <Box
              sx={{
                pl: 2,
                borderLeft: "3px solid",
                borderColor: colors.primary,
                bgcolor: `${colors.primary}0d`,
                borderRadius: "0 8px 8px 0",
                p: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mb: 0.5,
                }}
              >
                <Reply sx={{ fontSize: 14, color: colors.primary }} />
                <Typography.Label size="xs" color="primary">
                  Owner Response
                </Typography.Label>
                <Typography.Body
                  size="xs"
                  color="default"
                  sx={{ ml: "auto", opacity: 0.6 }}
                >
                  {new Date(existingReply.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </Typography.Body>
              </Box>
              <Typography.Body size="sm" color="dark">
                {existingReply.message}
              </Typography.Body>
            </Box>
          ) : canReply ? (
            /* Reply input or trigger button */
            isReplying ? (
              <Box
                sx={{
                  pl: 2,
                  borderLeft: "3px solid",
                  borderColor: colors.primary,
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <Textarea
                  minRows={2}
                  maxRows={5}
                  placeholder="Write your response..."
                  value={replyDraft}
                  onChange={(e) => onReplyChange?.(e.target.value)}
                  size="sm"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    colorScheme="primary"
                    size="sm"
                    disabled={!replyDraft.trim() || replySubmitting}
                    onClick={onReplySubmit}
                    sx={{ gap: 0.5 }}
                  >
                    {replySubmitting ? (
                      <CircularProgress size="sm" />
                    ) : (
                      <Send sx={{ fontSize: 14 }} />
                    )}
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    colorScheme="primary"
                    size="sm"
                    disabled={replySubmitting}
                    onClick={onReplyCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                colorScheme="primary"
                size="sm"
                onClick={onReplyOpen}
                sx={{ gap: 0.5 }}
              >
                <Reply sx={{ fontSize: 15 }} />
                Reply
              </Button>
            )
          ) : null}
        </Box>
      )}
    </Container>
  );
};

export default ReviewCard;
