import PageContainer from "@/components/PageContainer";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { Box, Stack } from "@mui/joy";
import { MapPinOff, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Stack
        spacing={3}
        alignItems="center"
        sx={{ maxWidth: 500, textAlign: "center" }}
      >
        {/* Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            borderRadius: "50%",
            bgcolor: "background.level1",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              bgcolor: "warning.softBg",
              opacity: 0.15,
              animation: "pulse 2s ease-in-out infinite",
            },
            "@keyframes pulse": {
              "0%, 100%": {
                transform: "scale(1)",
                opacity: 0.1,
              },
              "50%": {
                transform: "scale(1.1)",
                opacity: 0.2,
              },
            },
          }}
        >
          <MapPinOff
            size={80}
            strokeWidth={1.5}
            style={{ opacity: 0.4, color: "#E59400" }}
          />
        </Box>

        {/* Error Code */}
        <Typography.Title size="md" color="warning">
          404
        </Typography.Title>

        {/* Title */}
        <Typography.Header size="sm" bold>
          Page Not Found
        </Typography.Header>

        {/* Message */}
        <Typography.Body size="sm" color="primary" align="center">
          The page you're looking for doesn't exist or may have been moved.
          Please check the URL or navigate back to a known page.
        </Typography.Body>

        {/* Actions */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            colorScheme="secondary"
            startDecorator={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            colorScheme="primary"
            startDecorator={<Home size={18} />}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
};

export default NotFound;
