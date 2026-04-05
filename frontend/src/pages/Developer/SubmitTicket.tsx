import { useState } from "react";
import { Box, Option, Select } from "@mui/joy";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/context/AuthContext";
import { createTicket } from "@/services/ticket/TicketService";
import type { TicketType, TicketPriority } from "@/types/Ticket";

export default function SubmitTicket() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TicketType>("bug");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  const handleSubmit = async () => {
    if (!title.trim()) {
      setAlert({
        open: true,
        type: "error",
        title: "Validation",
        message: "Title is required.",
      });
      return;
    }

    if (!user) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "You must be logged in.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await createTicket({
        title: title.trim(),
        description: description.trim(),
        type,
        priority,
        status: "open",
        reported_by: user.uid,
        reporter_email: user.email,
        reporter_name: user.displayName ?? null,
      });

      setAlert({
        open: true,
        type: "success",
        title: "Submitted",
        message: "Your ticket has been submitted successfully.",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setType("bug");
      setPriority("medium");
    } catch {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to submit ticket.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography.Header>Submit a Report</Typography.Header>
        <Typography.Body color="default" size="sm" sx={{ mt: 0.5 }}>
          Report a bug, error, request a feature, or leave feedback for the
          development team.
        </Typography.Body>
      </Box>

      {/* Form */}
      <Box
        sx={{
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Type */}
        <Box>
          <Typography.Label bold size="sm" sx={{ mb: 0.5 }}>
            Type
          </Typography.Label>
          <Select
            value={type}
            onChange={(_, val) => val && setType(val as TicketType)}
            sx={{ width: "100%" }}
          >
            <Option value="bug">Bug Report</Option>
            <Option value="error">Error Report</Option>
            <Option value="feature">Feature Request</Option>
            <Option value="feedback">Feedback</Option>
          </Select>
        </Box>

        {/* Priority */}
        <Box>
          <Typography.Label bold size="sm" sx={{ mb: 0.5 }}>
            Priority
          </Typography.Label>
          <Select
            value={priority}
            onChange={(_, val) => val && setPriority(val as TicketPriority)}
            sx={{ width: "100%" }}
          >
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="critical">Critical</Option>
          </Select>
        </Box>

        {/* Title */}
        <Box>
          <Typography.Label bold size="sm" sx={{ mb: 0.5 }}>
            Title
          </Typography.Label>
          <Input
            name="title"
            placeholder="Brief summary of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        {/* Description */}
        <Box>
          <Typography.Label bold size="sm" sx={{ mb: 0.5 }}>
            Description
          </Typography.Label>
          <textarea
            placeholder="Describe the issue in detail. Include steps to reproduce if applicable."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
        </Box>

        {/* Submit */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="solid"
            colorScheme="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </Box>
      </Box>

      {/* Alert */}
      <Alert
        open={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
      />
    </PageContainer>
  );
}
