import PageContainer from "@/components/PageContainer";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { Box, Stack } from "@mui/joy";
import { Home, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoHome = () => navigate("/");

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
              bgcolor: "danger.softBg",
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
          <ShieldX
            size={80}
            strokeWidth={1.5}
            style={{ opacity: 0.4, color: "#C41E3A" }}
          />
        </Box>

        {/* Error Code */}
        <Typography.Title size="md" color="error">
          403
        </Typography.Title>

        {/* Title */}
        <Typography.Header size="sm" bold>
          Access Denied
        </Typography.Header>

        {/* Message */}
        <Typography.Body size="sm" color="primary" align="center">
          You don't have permission to access this page. This area is restricted
          to authorized users with specific roles or permissions.
        </Typography.Body>
        {/* Actions */}
        <Button
          colorScheme="primary"
          startDecorator={<Home size={18} />}
          onClick={handleGoHome}
        >
          Go to Home
        </Button>
      </Stack>
    </PageContainer>
  );
};

export default Unauthorized;
