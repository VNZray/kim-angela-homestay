import { useState, useEffect, useCallback } from "react";
import { Box, useColorScheme, Select, Option } from "@mui/joy";
import { RateReview } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import {
  getBusinessReviewRepliesByReviewId,
  createBusinessReviewReply,
} from "@/services/reviews/BusinessReviewReplyService";
import {
  getRoomReviewRepliesByReviewId,
  createRoomReviewReply,
} from "@/services/reviews/RoomReviewReplyService";
import supabase from "@/utils/supabase";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Loading from "@/components/Loading";
import ReviewCard from "@/components/cards/ReviewCard";
import RatingsSummary from "./components/RatingsSummary";
import Button from "@/components/ui/Button";
import { getAllBusinessReviews } from "@/services/reviews/BusinessReviewService";
import { getRoomReviewsByRoomId } from "@/services/reviews/RoomReviewService";
import { getAllRooms } from "@/services/room/RoomService";
import { getTouristById } from "@/services/tourist/TouristService";
import type { BusinessReview } from "@/types/BusinessReview";
import type { RoomReview } from "@/types/RoomReview";
import type { Room } from "@/types/Room";

type ReviewType = "business" | "room";

interface CombinedReview {
  id: string;
  rating: number;
  feedback: string | null;
  photos: string[];
  tourist_id: string;
  created_at: string;
  type: ReviewType;
  roomName?: string;
}

export default function ManageReviews() {
  const { mode } = useColorScheme();
  const { user } = useAuth();

  const [businessReviews, setBusinessReviews] = useState<BusinessReview[]>([]);
  const [roomReviews, setRoomReviews] = useState<
    (RoomReview & { roomName: string })[]
  >([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviewerNames, setReviewerNames] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  // Replies state
  const [replies, setReplies] = useState<
    Record<string, { id: string; message: string; created_at: string } | null>
  >({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<ReviewType | "all">("all");
  const [filterRoom, setFilterRoom] = useState<string | "all">("all");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all business reviews and rooms in parallel
      const [bizReviews, allRooms] = await Promise.all([
        getAllBusinessReviews(),
        getAllRooms(),
      ]);

      setBusinessReviews(bizReviews);
      setRooms(allRooms);

      // Fetch room reviews for all rooms
      const allRoomReviews: (RoomReview & { roomName: string })[] = [];
      await Promise.all(
        allRooms.map(async (room) => {
          const reviews = await getRoomReviewsByRoomId(room.id);
          reviews.forEach((r) => {
            allRoomReviews.push({
              ...r,
              roomName: room.room_type
                ? `${room.room_type}${room.room_number ? ` #${room.room_number}` : ""}`
                : `Room ${room.room_number || "N/A"}`,
            });
          });
        }),
      );
      setRoomReviews(allRoomReviews);

      // Fetch all reviewer names
      const allTouristIds = [
        ...new Set([
          ...bizReviews.map((r) => r.tourist_id),
          ...allRoomReviews.map((r) => r.tourist_id),
        ]),
      ];
      const names: Record<string, string> = {};
      await Promise.all(
        allTouristIds.map(async (touristId) => {
          try {
            const tourist = await getTouristById(touristId);
            if (tourist) {
              names[touristId] =
                `${tourist.first_name ?? ""} ${tourist.last_name ?? ""}`.trim() ||
                "Guest";
            }
          } catch {
            names[touristId] = "Guest";
          }
        }),
      );
      setReviewerNames(names);

      // Fetch existing replies for all reviews
      const allCombined = [
        ...bizReviews.map((r) => ({
          id: r.id,
          type: "business" as ReviewType,
        })),
        ...allRoomReviews.map((r) => ({
          id: r.id,
          type: "room" as ReviewType,
        })),
      ];
      const fetchedReplies: Record<
        string,
        { id: string; message: string; created_at: string } | null
      > = {};
      await Promise.all(
        allCombined.map(async ({ id, type }) => {
          try {
            const replyList =
              type === "business"
                ? await getBusinessReviewRepliesByReviewId(id)
                : await getRoomReviewRepliesByReviewId(id);
            fetchedReplies[id] =
              replyList.length > 0
                ? {
                    id: replyList[0].id,
                    message: replyList[0].message,
                    created_at: replyList[0].created_at,
                  }
                : null;
          } catch {
            fetchedReplies[id] = null;
          }
        }),
      );
      setReplies(fetchedReplies);
    } catch {
      console.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Resolve supabase user ID from firebase UID
  useEffect(() => {
    if (!user?.uid) {
      setSupabaseUserId(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", user.uid)
        .single();
      setSupabaseUserId(data?.id ?? null);
    })();
  }, [user?.uid]);

  const handleReply = useCallback(
    async (review: CombinedReview) => {
      if (!replyDraft.trim() || !supabaseUserId) return;
      setReplySubmitting(true);
      try {
        const payload = {
          review_id: review.id,
          responder_user_id: supabaseUserId,
          message: replyDraft.trim(),
        };
        const created =
          review.type === "business"
            ? await createBusinessReviewReply(payload)
            : await createRoomReviewReply(payload);
        setReplies((prev) => ({
          ...prev,
          [review.id]: {
            id: created.id,
            message: created.message,
            created_at: created.created_at,
          },
        }));
        setReplyingTo(null);
        setReplyDraft("");
      } catch {
        // silently ignore — could add alert here
      } finally {
        setReplySubmitting(false);
      }
    },
    [replyDraft, supabaseUserId],
  );

  // Combine all reviews for display
  const allReviews: CombinedReview[] = [
    ...businessReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      feedback: r.feedback,
      photos: r.photos,
      tourist_id: r.tourist_id,
      created_at: r.created_at,
      type: "business" as ReviewType,
    })),
    ...roomReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      feedback: r.feedback,
      photos: r.photos,
      tourist_id: r.tourist_id,
      created_at: r.created_at,
      type: "room" as ReviewType,
      roomName: r.roomName,
    })),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Apply filters
  const filteredReviews = allReviews.filter((r) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterRoom !== "all" && r.type === "room" && r.roomName !== filterRoom)
      return false;
    if (filterRating !== null && r.rating !== filterRating) return false;
    return true;
  });

  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <RateReview
          sx={{ fontSize: 28, color: mode === "dark" ? "#ff6b3d" : "#da5019" }}
        />
        <Box>
          <Typography.Header color="dark" size="sm">
            Reviews & Ratings
          </Typography.Header>
          <Typography.Body size="xs" color="default">
            {allReviews.length} total reviews ({businessReviews.length}{" "}
            business, {roomReviews.length} room)
          </Typography.Body>
        </Box>
      </Box>

      {/* 2-column layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* ── Left: Reviews list ── */}
        <Box>
          {/* Filters */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            {/* Type Filter */}
            <Box>
              <Typography.Label
                size="xs"
                color="default"
                sx={{ mb: 0.5, display: "block" }}
              >
                Review Type
              </Typography.Label>
              <Select
                value={filterType}
                onChange={(_, val) => {
                  setFilterType(val as ReviewType | "all");
                  if (val !== "room") setFilterRoom("all");
                }}
                size="sm"
                sx={{ minWidth: 160 }}
              >
                <Option value="all">All Reviews</Option>
                <Option value="business">Business Reviews</Option>
                <Option value="room">Room Reviews</Option>
              </Select>
            </Box>

            {/* Room Filter */}
            {(filterType === "room" || filterType === "all") &&
              rooms.length > 0 && (
                <Box>
                  <Typography.Label
                    size="xs"
                    color="default"
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    Room
                  </Typography.Label>
                  <Select
                    value={filterRoom}
                    onChange={(_, val) => setFilterRoom(val as string)}
                    size="sm"
                    sx={{ minWidth: 180 }}
                  >
                    <Option value="all">All Rooms</Option>
                    {rooms.map((room) => {
                      const label = room.room_type
                        ? `${room.room_type}${room.room_number ? ` #${room.room_number}` : ""}`
                        : `Room ${room.room_number || room.id.slice(0, 8)}`;
                      return (
                        <Option key={room.id} value={label}>
                          {label}
                        </Option>
                      );
                    })}
                  </Select>
                </Box>
              )}

            {/* Rating Filter */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <Button
                variant={filterRating === null ? "solid" : "outlined"}
                colorScheme="primary"
                size="sm"
                onClick={() => setFilterRating(null)}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((star) => (
                <Button
                  key={star}
                  variant={filterRating === star ? "solid" : "outlined"}
                  colorScheme="primary"
                  size="sm"
                  onClick={() => setFilterRating(star)}
                >
                  {star}★
                </Button>
              ))}
            </Box>
          </Box>

          {/* Reviews */}
          {filteredReviews.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography.Body color="default" size="sm">
                No reviews matching your filters.
              </Typography.Body>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredReviews.map((review) => (
                <Box key={review.id}>
                  <ReviewCard
                    rating={review.rating}
                    feedback={review.feedback}
                    photos={review.photos}
                    reviewerName={reviewerNames[review.tourist_id] || "Guest"}
                    createdAt={review.created_at}
                    existingReply={replies[review.id]}
                    canReply={user?.role !== "tourist" && !replies[review.id]}
                    isReplying={replyingTo === review.id}
                    replyDraft={replyDraft}
                    replySubmitting={replySubmitting}
                    onReplyOpen={() => {
                      setReplyingTo(review.id);
                      setReplyDraft("");
                    }}
                    onReplyCancel={() => {
                      setReplyingTo(null);
                      setReplyDraft("");
                    }}
                    onReplyChange={setReplyDraft}
                    onReplySubmit={() => handleReply(review)}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ── Right: Summary (sticky) ── */}
        {allReviews.length > 0 && (
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
            <RatingsSummary
              ratings={allReviews.map((r) => r.rating)}
              totalReviews={allReviews.length}
              businessCount={businessReviews.length}
              roomCount={roomReviews.length}
            />
          </Box>
        )}
      </Box>
    </PageContainer>
  );
}
