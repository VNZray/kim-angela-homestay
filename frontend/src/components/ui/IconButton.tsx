import { IconButton as JoyIconButton, useColorScheme } from "@mui/joy";
import type { IconButtonProps as JoyIconButtonProps } from "@mui/joy";
import type { CSSProperties } from "react";
import { getColors } from "@/utils/Colors";
import { getColorStyles } from "@/utils/buttonColorStyles";

type ColorScheme = keyof ReturnType<typeof getColors>;

interface CustomIconButtonProps
  extends Omit<JoyIconButtonProps, "color" | "variant"> {
  variant?: "solid" | "outlined" | "soft" | "plain";
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

const IconButton = ({
  variant = "solid",
  colorScheme = "primary",
  children,
  sx,
  ...props
}: CustomIconButtonProps) => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const buttonStyles = getColorStyles(colorScheme, variant, themeColors);

  return (
    <JoyIconButton
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
          ...sx,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </JoyIconButton>
  );
};

export default IconButton;
