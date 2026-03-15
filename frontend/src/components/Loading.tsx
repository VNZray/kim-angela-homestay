import { Box, CircularProgress } from "@mui/joy";
import { useColorScheme } from "@mui/joy";
import Typography from "@/components/ui/Typography";
import { getColors } from "@/utils/Colors";

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

const Loading = ({ message, fullPage = false }: LoadingProps) => {
  const { mode } = useColorScheme();
  const colors = getColors(mode);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        minHeight: fullPage ? "100dvh" : "clamp(200px, 40vh, 400px)",
        width: "100%",
      }}
    >
      <CircularProgress
        size="md"
        sx={{
          "--CircularProgress-progressColor": colors.primary,
          "--CircularProgress-trackColor": colors.transparentWhite,
        }}
      />
      {message && (
        <Typography.Body color="default" size="sm">
          {message}
        </Typography.Body>
      )}
    </Box>
  );
};

export default Loading;
