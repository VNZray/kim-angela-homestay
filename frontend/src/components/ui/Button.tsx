import { Button as JoyButton, useColorScheme } from "@mui/joy";
import type { ButtonProps as JoyButtonProps } from "@mui/joy";
import type { CSSProperties } from "react";
import { getColors } from "@/utils/Colors";
import { getColorStyles } from "@/utils/buttonColorStyles";

type ColorScheme = keyof ReturnType<typeof getColors>;

interface CustomButtonProps extends Omit<JoyButtonProps, "color" | "variant"> {
  variant?: "solid" | "outlined" | "soft" | "plain";
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

const Button = ({
  variant = "solid",
  colorScheme = "primary",
  children,
  sx,
  ...props
}: CustomButtonProps) => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const buttonStyles = getColorStyles(colorScheme, variant, themeColors);

  return (
    <JoyButton
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
    </JoyButton>
  );
};

export default Button;
