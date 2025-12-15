import { Typography as JoyTypography, useColorScheme } from "@mui/joy";
import type { TypographyProps } from "@mui/joy";
import type { CSSProperties, ReactNode } from "react";
import { colors } from "@/utils/Colors";

// Type Definitions
type TypographyVariant =
  | "title"
  | "header"
  | "label"
  | "cardTitle"
  | "cardSubTitle"
  | "body";

type TypographySize = "xs" | "sm" | "normal" | "md" | "lg";
type TypographyAlign = "left" | "center" | "right";
type TypographyColor =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "default"
  | "light"
  | "dark";

interface CustomTypographyProps
  extends Omit<
    TypographyProps,
    "color" | "variant" | "fontWeight" | "fontStyle"
  > {
  children: ReactNode;
  variant?: TypographyVariant;
  size?: TypographySize;
  align?: TypographyAlign;
  color?: TypographyColor;
  className?: string;
  // New Boolean Props
  bold?: boolean;
  underline?: boolean;
  crossed?: boolean;
  italicized?: boolean;
}

// Responsive font size mapping
// Note: Removed fontWeight from here so the 'bold' prop controls it exclusively
const getFontSize = (
  variant: TypographyVariant,
  size: TypographySize
): CSSProperties => {
  const sizeMap = {
    title: {
      xs: { fontSize: "clamp(1.5rem, 4vw, 2rem)" }, // 24px - 32px
      sm: { fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)" }, // 28px - 40px
      normal: { fontSize: "clamp(2rem, 5vw, 3rem)" }, // 32px - 48px
      md: { fontSize: "clamp(2.5rem, 6vw, 3.5rem)" }, // 40px - 56px
      lg: { fontSize: "clamp(3rem, 7vw, 4.5rem)" }, // 48px - 72px
    },
    header: {
      xs: { fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }, // 18px - 24px
      sm: { fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }, // 20px - 28px
      normal: { fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }, // 24px - 32px
      md: { fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }, // 28px - 36px
      lg: { fontSize: "clamp(2rem, 4.5vw, 2.75rem)" }, // 32px - 44px
    },
    label: {
      xs: { fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)" }, // 10px - 12px
      sm: { fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }, // 12px - 14px
      normal: { fontSize: "clamp(0.875rem, 2.25vw, 1rem)" }, // 14px - 16px
      md: { fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }, // 16px - 18px
      lg: { fontSize: "clamp(1.125rem, 3vw, 1.25rem)" }, // 18px - 20px
    },
    cardTitle: {
      xs: { fontSize: "clamp(0.875rem, 2vw, 1rem)" }, // 14px - 16px
      sm: { fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }, // 16px - 20px
      normal: { fontSize: "clamp(1.125rem, 3vw, 1.5rem)" }, // 18px - 24px
      md: { fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)" }, // 20px - 28px
      lg: { fontSize: "clamp(1.5rem, 4vw, 2rem)" }, // 24px - 32px
    },
    cardSubTitle: {
      xs: { fontSize: "clamp(0.75rem, 1.75vw, 0.875rem)" }, // 12px - 14px
      sm: { fontSize: "clamp(0.8125rem, 2vw, 1rem)" }, // 13px - 16px
      normal: { fontSize: "clamp(0.875rem, 2.25vw, 1.125rem)" }, // 14px - 18px
      md: { fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }, // 16px - 20px
      lg: { fontSize: "clamp(1.125rem, 3vw, 1.5rem)" }, // 18px - 24px
    },
    body: {
      xs: { fontSize: "clamp(0.75rem, 2vw, 0.75rem)" }, // 12px
      sm: { fontSize: "clamp(0.875rem, 2.25vw, 0.875rem)" }, // 14px
      normal: { fontSize: "clamp(1rem, 2.5vw, 1rem)" }, // 16px
      md: { fontSize: "clamp(1.125rem, 3vw, 1.125rem)" }, // 18px
      lg: { fontSize: "clamp(1.25rem, 3.5vw, 1.25rem)" }, // 20px
    },
  };

  return sizeMap[variant][size];
};

// Helper to generate styles based on boolean props
const getCombinedStyles = (
  bold?: boolean,
  italicized?: boolean,
  underline?: boolean,
  crossed?: boolean
): CSSProperties => {
  const styles: CSSProperties = {};

  // Handle Weight
  if (bold) {
    styles.fontWeight = 700; // or 600 if you prefer semi-bold
  } else {
    styles.fontWeight = 400;
  }

  // Handle Italic
  if (italicized) {
    styles.fontStyle = "italic";
  }

  // Handle Text Decoration (combining underline and line-through)
  const decorations: string[] = [];
  if (underline) decorations.push("underline");
  if (crossed) decorations.push("line-through");

  if (decorations.length > 0) {
    styles.textDecoration = decorations.join(" ");
  }

  return styles;
};

// Color mapping with dark mode support
const getColor = (color: TypographyColor): string => {
  const { mode } = useColorScheme();

  const colorMap = {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    success: colors.success,
    default: mode === "dark" ? colors.white : colors.dark,
    light: colors.white,
    dark: colors.dark,
  };
  return colorMap[color];
};

// Base Typography Component
const BaseTypography = ({
  children,
  variant = "body",
  size = "sm",
  align = "left",
  color = "default",
  bold,
  italicized,
  underline,
  crossed,
  className,
  sx,
  ...props
}: CustomTypographyProps) => {
  const customStyles: CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    textAlign: align,
    color: getColor(color),
    lineHeight: variant === "title" ? 1.2 : variant === "header" ? 1.3 : 1.5,
    ...getFontSize(variant, size),
    ...getCombinedStyles(bold, italicized, underline, crossed),
  };

  // Map variant to Joy UI level
  const getLevelFromVariant = (variant: TypographyVariant) => {
    const levelMap = {
      title: "h1",
      header: "h2",
      cardTitle: "h3",
      cardSubTitle: "h4",
      label: "body-sm",
      body: "body-sm",
    };
    return levelMap[variant] as TypographyProps["level"];
  };

  return (
    <JoyTypography
      level={getLevelFromVariant(variant)}
      className={className}
      sx={{
        ...customStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </JoyTypography>
  );
};

// Individual Component Variants
// Note: We pass `bold` implicitly for titles/headers to maintain hierarchy,
// but this can be overridden by passing `bold={false}` if needed.

const Title = (props: Omit<CustomTypographyProps, "variant">) => (
  <BaseTypography variant="title" bold {...props} />
);

const Header = (props: Omit<CustomTypographyProps, "variant">) => (
  <BaseTypography variant="header" bold {...props} />
);

const CardTitle = (props: Omit<CustomTypographyProps, "variant">) => (
  <BaseTypography variant="cardTitle" bold {...props} />
);

const CardSubTitle = (props: Omit<CustomTypographyProps, "variant">) => (
  <BaseTypography variant="cardSubTitle" {...props} />
);

const Label = (props: Omit<CustomTypographyProps, "variant">) => (
  <BaseTypography variant="label" bold {...props} />
);

const Body = (props: Omit<CustomTypographyProps, "variant">) => (
  <BaseTypography variant="body" {...props} />
);

export default {
  Title,
  Header,
  CardTitle,
  CardSubTitle,
  Label,
  Body,
  Base: BaseTypography,
};

export type {
  CustomTypographyProps,
  TypographyVariant,
  TypographySize,
  TypographyAlign,
  TypographyColor,
};