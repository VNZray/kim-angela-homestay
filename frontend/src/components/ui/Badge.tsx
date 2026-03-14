import type { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  label: string;
  color?: string;
}

export default function Badge({ icon, label, color = "#C5A059" }: BadgeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 16px",
        borderRadius: "99px",
        backgroundColor: `${color}14`,
        color: color,
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: "12px",
      }}
    >
      {icon}
      {label}
    </div>
  );
}
