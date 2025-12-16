import { getColors } from './Colors';

type ColorScheme = keyof ReturnType<typeof getColors>;
type Variant = 'solid' | 'outlined' | 'soft' | 'plain';

/**
 * Generates hover color based on the base color
 * Darkens the color for solid variants and lightens for others
 *
 * @param baseColor - The base color in hex format (e.g., '#f6d33e')
 * @param variant - The button variant type
 * @returns A new color in hex format for the hover state
 */
const generateHoverColor = (baseColor: string, variant: Variant): string => {
  // Step 1: Remove the '#' symbol from hex color (e.g., '#f6d33e' → 'f6d33e')
  const hex = baseColor.replace('#', '');

  // Step 2: Convert hex to RGB components
  // Each color component is 2 characters in hex (00-FF = 0-255 in decimal)
  const r = parseInt(hex.substring(0, 2), 16); // Red component (first 2 chars)
  const g = parseInt(hex.substring(2, 4), 16); // Green component (middle 2 chars)
  const b = parseInt(hex.substring(4, 6), 16); // Blue component (last 2 chars)

  // Step 3: Initialize new RGB values
  let newR = r;
  let newG = g;
  let newB = b;

  // Step 4: Apply color transformation based on variant
  if (variant === 'solid') {
    // For solid buttons: Darken by multiplying by 0.8 (20% darker)
    // Math.max ensures the value doesn't go below 0
    newR = Math.max(0, Math.floor(r * 0.8));
    newG = Math.max(0, Math.floor(g * 0.8));
    newB = Math.max(0, Math.floor(b * 0.8));
  } else {
    // For other variants: Lighten by adding 30% of the remaining distance to white (255)
    // Formula: current + (255 - current) * 0.3
    // Math.min ensures the value doesn't exceed 255
    newR = Math.min(255, Math.floor(r + (255 - r) * 0.3));
    newG = Math.min(255, Math.floor(g + (255 - g) * 0.3));
    newB = Math.min(255, Math.floor(b + (255 - b) * 0.3));
  }

  // Step 5: Convert RGB back to hex format
  // Convert each number to hex string and pad with '0' if needed (e.g., 5 → '05')
  const toHex = (num: number) => Math.round(num).toString(16).padStart(2, '0');

  // Step 6: Combine all components with '#' prefix and return
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

/**
 * Generates background color for soft variants
 * Creates a subtle background that adapts to light/dark themes
 * Lightens the color significantly for light mode, darkens for dark mode
 *
 * @param baseColor - The base color in hex format
 * @param isDarkMode - Whether to generate color for dark mode (default: false)
 * @returns A new color in hex format suitable for soft/subtle backgrounds
 */
const generateSoftBackground = (baseColor: string, isDarkMode: boolean = false): string => {
  // Step 1: Remove '#' and convert hex to RGB components
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16); // Red: 0-255
  const g = parseInt(hex.substring(2, 4), 16); // Green: 0-255
  const b = parseInt(hex.substring(4, 6), 16); // Blue: 0-255

  // Step 2: Declare variables for new RGB values
  let newR, newG, newB;

  // Step 3: Apply transformation based on theme mode
  if (isDarkMode) {
    // DARK MODE: Darken by multiplying by 0.3 (keep only 30% of original brightness)
    // This creates a subtle, dark background that's not too bright
    // Example: bright yellow (#f6d33e) → dark brownish (#4a3f12)
    newR = Math.max(0, Math.floor(r * 0.3));
    newG = Math.max(0, Math.floor(g * 0.3));
    newB = Math.max(0, Math.floor(b * 0.3));
  } else {
    // LIGHT MODE: Lighten by adding 80% of the distance to white (255)
    // This creates a very light, pastel-like background
    // Example: orange (#da5019) → light peach (#f8d5c8)
    newR = Math.min(255, Math.floor(r + (255 - r) * 0.8));
    newG = Math.min(255, Math.floor(g + (255 - g) * 0.8));
    newB = Math.min(255, Math.floor(b + (255 - b) * 0.8));
  }

  // Step 4: Convert RGB back to hex format and return
  const toHex = (num: number) => Math.round(num).toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

/**
 * Gets the appropriate text color (white or dark) based on luminance
 * Ensures text is readable against the background color
 * Uses the relative luminance formula from WCAG guidelines
 *
 * @param baseColor - The background color in hex format
 * @returns Either black (#000000) or white (#ffffff) for optimal contrast
 */
const getTextColor = (baseColor: string): string => {
  // Step 1: Convert hex to RGB components
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Step 2: Calculate relative luminance using WCAG formula
  // The human eye perceives green more than red, and red more than blue
  // Formula weights: Red=29.9%, Green=58.7%, Blue=11.4%
  // Divide by 255 to normalize to 0-1 range
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Step 3: Return appropriate text color based on luminance
  // If luminance > 0.5 (bright background) → use black text
  // If luminance ≤ 0.5 (dark background) → use white text
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Dynamically generates color styles for a given color scheme and variant
 * Returns theme-aware styles that respond to both light and dark modes
 * This is the main function that Button component uses to get all styling
 *
 * @param colorScheme - The color scheme from Colors.ts (e.g., 'primary', 'secondary')
 * @param variant - The button variant ('solid', 'outlined', 'soft', 'plain')
 * @param colors - The theme colors object (optional, defaults to light mode)
 * @returns An object containing all CSS styles for the button
 */
export const getColorStyles = (
  colorScheme: ColorScheme,
  variant: Variant,
  colors: ReturnType<typeof getColors> = getColors("light")
) => {
  // Step 1: Get the base color from the color palette
  const baseColor = colors[colorScheme];

  // Step 2: Validate that the color exists
  if (!baseColor) {
    console.warn(`Color scheme "${colorScheme}" not found in colors palette`);
    return {}; // Return empty object if color not found
  }

  // Step 3: Pre-generate all color variations we might need
  const hoverColor = generateHoverColor(baseColor, variant);        // Hover state color
  const softBg = generateSoftBackground(baseColor, false);          // Light mode soft background
  const softBgDark = generateSoftBackground(baseColor, true);       // Dark mode soft background
  const textColor = getTextColor(baseColor);                        // Contrasting text color

  // Step 4: Return styles based on variant type
  switch (variant) {
    // SOLID VARIANT: Full background color with contrasting text
    // Used for primary actions (e.g., "Login", "Submit")
    case 'solid':
      return {
        backgroundColor: baseColor,          // Full color background
        color: textColor,                    // Black or white text for contrast
        '&:hover': {                         // Hover state
          backgroundColor: hoverColor,       // Slightly darker version of base color
        },
      };

    // OUTLINED VARIANT: Border with transparent background
    // Used for secondary actions that need less emphasis
    case 'outlined':
      return {
        borderColor: baseColor,                // Border uses the base color
        color: baseColor,                      // Text also uses the base color
        border: `1px solid ${baseColor}`,      // Define border style
        '&:hover': {                           // Hover state
          backgroundColor: {                   // Responsive soft background on hover
            xs: softBg,                        // Light soft background for small screens
            md: softBg,                        // Same for medium+ screens
          },
          // Dark mode hover: use darker soft background
          // Note: [data-joy-color-scheme="dark"] is Joy UI's way of detecting theme
          '[data-joy-color-scheme="dark"] &': {
            backgroundColor: softBgDark,       // Darker soft background in dark mode
          },
        },
        // Dark mode base styles: keep same border and text colors
        '[data-joy-color-scheme="dark"] &': {
          borderColor: baseColor,              // Border stays same color in dark mode
          color: baseColor,                    // Text stays same color in dark mode
        },
      };

    // SOFT VARIANT: Subtle background color with colored text
    // Used for tertiary actions or active states (e.g., active nav button)
    case 'soft':
      return {
        backgroundColor: softBg,                 // Very light background in light mode
        color: baseColor,                        // Text uses full base color
        // Dark mode base styles
        '[data-joy-color-scheme="dark"] &': {
          backgroundColor: softBgDark,           // Dark subtle background in dark mode
          color: baseColor,                      // Text keeps base color
        },
        '&:hover': {                             // Hover state
          // Lighten the soft background even more on hover (light mode)
          backgroundColor: generateHoverColor(softBg, 'soft'),
          // Dark mode hover: lighten the dark soft background
          '[data-joy-color-scheme="dark"] &': {
            backgroundColor: generateHoverColor(softBgDark, 'soft'),
          },
        },
      };

    // PLAIN VARIANT: No background or border, just colored text
    // Used for minimal actions or links (e.g., navigation items)
    case 'plain':
      return {
        color: baseColor,                        // Only colored text
        backgroundColor: 'transparent',          // No background
        // Dark mode: text color stays the same
        '[data-joy-color-scheme="dark"] &': {
          color: baseColor,                      // Keep base color in dark mode
        },
        '&:hover': {                             // Hover state
          backgroundColor: softBg,               // Add soft background on hover (light mode)
          // Dark mode hover: use dark soft background
          '[data-joy-color-scheme="dark"] &': {
            backgroundColor: softBgDark,         // Dark soft background in dark mode
          },
        },
      };

    // DEFAULT: Return empty object if variant doesn't match
    default:
      return {};
  }
};

/*const colors = getColors("light");
  *
 * Gets all available color schemes from the colors palette
 * Filters out non-color properties and returns only valid color hex values
 */
export const getAvailableColorSchemes = (): ColorScheme[] => {
  return Object.entries(colors)
    .filter(([, value]) => typeof value === 'string' && value.startsWith('#'))
    .map(([key]) => key as ColorScheme);
};
