import { Box, Textarea, useColorScheme } from "@mui/joy";
import { Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/ui/Alert";
import BaseModal from "../../../components/ui/BaseModal";
import Typography from "../../../components/ui/Typography";
import { useAuth } from "../../../context/AuthContext";
import { getAllBusinesses } from "../../../services/business/BusinessService";
import { createBusinessReview } from "../../../services/reviews/BusinessReviewService";
import { getTouristsByUserId } from "../../../services/tourist/TouristService";
import supabase from "@/utils/supabase";
import { getColors } from "@/utils/Colors";

const RateUsButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mode } = useColorScheme();
  const colors = getColors(mode);

  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  const handleOpen = () => {
    if (!user) {
      setAlert({
        open: true,
        type: "info",
        title: "Login Required",
        message:
          "Please log in to your account first to leave a review. We'd love to hear from you!",
      });
      return;
    }
    if (user.role !== "tourist") {
      setAlert({
        open: true,
        type: "info",
        title: "Guests Only",
        message: "Only guests can submit reviews for the homestay.",
      });
      return;
    }
    setRating(0);
    setFeedback("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    setSubmitting(true);
    try {
      // Resolve supabase user id from firebase uid
      const { data: userRow } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (!userRow) throw new Error("User record not found");

      // Resolve tourist record — create one automatically if missing (e.g. Google login users)
      let tourists = await getTouristsByUserId(userRow.id);
      if (!tourists.length) {
        const nameParts = (user.displayName ?? "").trim().split(" ");
        const firstName = nameParts[0] || "Guest";
        const lastName = nameParts.slice(1).join(" ") || null;
        const { data: newTourist, error: createError } = await supabase
          .from("tourist")
          .insert({
            user_id: userRow.id,
            first_name: firstName,
            last_name: lastName,
          })
          .select("id")
          .single();
        if (createError || !newTourist)
          throw new Error("Failed to create tourist profile");
        tourists = [{ id: newTourist.id } as any];
      }
      const touristId = tourists[0].id;

      // Get business id
      const businesses = await getAllBusinesses();
      if (!businesses.length) throw new Error("No business found");
      const businessId = businesses[0].id;

      await createBusinessReview({
        tourist_id: touristId,
        business_id: businessId,
        rating,
        feedback: feedback.trim() || null,
        photos: [],
      });

      setModalOpen(false);
      setAlert({
        open: true,
        type: "success",
        title: "Thank You!",
        message:
          "Your review has been submitted successfully. We appreciate your feedback!",
      });
    } catch (err) {
      console.error("Failed to submit review:", err);
      setAlert({
        open: true,
        type: "error",
        title: "Submission Failed",
        message:
          "Something went wrong while submitting your review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
    // Redirect to login if not authenticated
    if (alert.type === "info" && !user) {
      navigate("/login");
    }
  };

  const starLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <>
      {/* Floating Rate Us Button */}
      <Box
        onClick={handleOpen}
        role="button"
        aria-label="Rate Us"
        sx={{
          position: "fixed",
          bottom: { xs: 24, md: 32 },
          right: { xs: 20, md: 32 },
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: { xs: 2, md: 2.5 },
          py: { xs: 1.2, md: 1.5 },
          borderRadius: "999px",
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}cc)`,
          color: "#fff",
          cursor: "pointer",
          boxShadow: `0 4px 20px ${colors.primary}66`,
          transition: "all 0.25s ease",
          userSelect: "none",
          "&:hover": {
            transform: "translateY(-3px) scale(1.04)",
            boxShadow: `0 8px 28px ${colors.primary}88`,
          },
          "&:active": {
            transform: "translateY(-1px) scale(0.98)",
          },
        }}
      >
        <Star size={18} fill="#fff" color="#fff" />
        <Typography.Label
          size="sm"
          sx={{ color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          Rate Us
        </Typography.Label>
      </Box>

      {/* Rating Modal */}
      <BaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Leave a Review"
        description="Share your experience at Kim Angela Homestay"
        size="sm"
        actions={[
          {
            label: "Cancel",
            onClick: () => setModalOpen(false),
            variant: "outlined",
            colorScheme: "secondary",
          },
          {
            label: submitting ? "Submitting..." : "Submit Review",
            onClick: handleSubmit,
            variant: "solid",
            colorScheme: "primary",
            disabled: rating === 0 || submitting,
          },
        ]}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
          {/* Star Selector */}
          <Box>
            <Typography.Label size="sm" sx={{ mb: 1, display: "block" }}>
              Your Rating <span style={{ color: colors.primary }}>*</span>
            </Typography.Label>
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Box
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.15s",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                >
                  <Star
                    size={32}
                    fill={
                      (hovered || rating) >= star
                        ? colors.primary
                        : "transparent"
                    }
                    color={
                      (hovered || rating) >= star ? colors.primary : "#9e9e9e"
                    }
                    strokeWidth={1.5}
                  />
                </Box>
              ))}
              {(hovered || rating) > 0 && (
                <Typography.Body
                  size="sm"
                  sx={{ ml: 1, color: colors.primary, fontWeight: 600 }}
                >
                  {starLabels[hovered || rating]}
                </Typography.Body>
              )}
            </Box>
          </Box>

          {/* Feedback */}
          <Box>
            <Typography.Label size="sm" sx={{ mb: 1, display: "block" }}>
              Your Feedback <span style={{ opacity: 0.5 }}>(optional)</span>
            </Typography.Label>
            <Textarea
              minRows={4}
              maxRows={6}
              placeholder="Tell us about your stay — what did you love, and what could we improve?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                borderRadius: "8px",
                resize: "vertical",
              }}
            />
          </Box>
        </Box>
      </BaseModal>

      {/* Alert */}
      <Alert
        open={alert.open}
        onClose={handleAlertClose}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
      />
    </>
  );
};

export default RateUsButton;
