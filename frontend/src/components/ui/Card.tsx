import { Card as JoyUICard } from "@mui/joy";
import { useColorScheme, type CardProps as JoyCardProps } from "@mui/joy";
import type { CSSProperties } from "react";
import { colors } from "@/utils/Colors";
import { getColorStyles } from "@/utils/buttonColorStyles";

type Color = keyof typeof colors;
type ElevationLevel = 1 | 2 | 3 | 4 | 5 | 6;

// ☀️ Light Mode Shadows (Black/Dark shadows)
const lightElevationShadows: Record<ElevationLevel, string> = {
  1: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  2: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  3: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  4: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  5: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  6: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};

// 🌙 Dark Mode Shadows (White/Glow shadows)
// I kept the alpha channels similar to create a "glow" effect against dark backgrounds
const darkElevationShadows: Record<ElevationLevel, string> = {
  1: "0 1px 2px 0 rgba(255, 255, 255, 0.1)",
  2: "0 1px 3px 0 rgba(255, 255, 255, 0.15), 0 1px 2px 0 rgba(255, 255, 255, 0.1)",
  3: "0 4px 6px -1px rgba(255, 255, 255, 0.15), 0 2px 4px -1px rgba(255, 255, 255, 0.1)",
  4: "0 10px 15px -3px rgba(255, 255, 255, 0.15), 0 4px 6px -2px rgba(255, 255, 255, 0.08)",
  5: "0 20px 25px -5px rgba(255, 255, 255, 0.15), 0 10px 10px -5px rgba(255, 255, 255, 0.06)",
  6: "0 25px 50px -12px rgba(255, 255, 255, 0.30)",
};

interface CustomCardProps extends Omit<JoyCardProps, "color" | "variant"> {
  variant?: "solid" | "outlined" | "soft" | "plain";
  ColorScheme?: Color;
  elevation?: ElevationLevel;
  children: React.ReactNode;
}

const Card = ({
  variant = "solid",
  ColorScheme = "undefined",
  elevation,
  children,
  sx,
  ...props
}: CustomCardProps) => {
  const { mode } = useColorScheme();
  const buttonStyles = getColorStyles(ColorScheme, variant);

  // Select shadow set based on current mode
  // Default to light shadows if mode is undefined (server-side) or 'light'
  const shadows = mode === "dark" ? darkElevationShadows : lightElevationShadows;

  const shadowStyle = elevation ? { boxShadow: shadows[elevation] } : {};

  return (
    <JoyUICard
      variant={
        variant === "solid"
          ? "solid"
          : variant === "outlined"
          ? "outlined"
          : variant === "soft"
          ? "soft"
          : "plain"
      }
      sx={
        {
          ...buttonStyles,
          ...shadowStyle,
          ...sx,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </JoyUICard>
  );
};

export default Card;