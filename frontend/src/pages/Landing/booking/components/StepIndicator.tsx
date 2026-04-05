import { Box, useColorScheme } from "@mui/joy";
import Typography from "@/components/ui/Typography";
import { getColors } from "@/utils/Colors";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  const { mode } = useColorScheme();
  const colors = getColors(mode as "light" | "dark");

  // Build grid items so connectors and steps align perfectly
  const items: any[] = [];
  steps.forEach((step, idx) => {
    const isCompleted = idx < currentStep;
    const isActive = idx === currentStep;

    items.push(
      <Box
        key={`step-${idx}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 0.5, sm: 0.75 },
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: isCompleted
              ? colors.success
              : isActive
                ? colors.primary
                : "transparent",
            border: `2px solid ${isCompleted ? colors.success : isActive ? colors.primary : mode === "dark" ? "#555" : "#ccc"}`,
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        >
          {isCompleted ? (
            <Check size={16} color="#fff" />
          ) : (
            <Typography.Label
              size="xs"
              bold
              color={isActive ? "white" : "default"}
            >
              {idx + 1}
            </Typography.Label>
          )}
        </Box>

        <Typography.Label
          size="xs"
          bold={isActive}
          color={isActive ? "primary" : "default"}
          sx={{ textAlign: "center", whiteSpace: "nowrap" }}
        >
          {step}
        </Typography.Label>
      </Box>,
    );

    if (idx < steps.length - 1) {
      const connCompleted = idx < currentStep;
      items.push(
        <Box
          key={`conn-${idx}`}
          sx={{
            height: 2,
            alignSelf: "center",
            bgcolor: connCompleted
              ? colors.success
              : mode === "dark"
                ? "#555"
                : "#ddd",
            transition: "all 0.3s ease",
            width: "100%",
          }}
        />,
      );
    }
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${steps.length * 2 - 1}, 1fr)`,
        alignItems: "center",
        width: "100%",
        mb: 4,
        px: 0,
        gap: 0,
      }}
    >
      {items}
    </Box>
  );
}
