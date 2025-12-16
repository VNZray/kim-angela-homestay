export const getColors = (mode?: "light" | "dark" | 'system' | undefined) => ({
    primary: mode === "dark" ? "#ff6b3d" : "#da5019",
    secondary: mode === "dark" ? "#ffe066" : "#f6d33e",
    background: mode === "dark" ? "#121212" : "#fdfcfa",
    white: mode === "dark" ? "#1a1a1a" : "#ffffff",
    error: mode === "dark" ? "#ff4757" : "#c70030",
    success: mode === "dark" ? "#2ecc71" : "#28a745",
    warning: mode === "dark" ? "#ff6b6b" : "#ff4545",
    dark: mode === "dark" ? "#f5f5f5" : "#1a1a1a",
    info: mode === "dark" ? "#74d4f5" : "#5bc0de",
    odd: mode === "dark" ? "#2a2a2a" : "#F3F4F6",
    undefined: undefined,
    transparentWhite: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)",
    transparentBlack: mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(40, 40, 40, 0.5)",
    transparent: "transparent",
});

// Default light mode colors for backward compatibility
export const colors = getColors("light");