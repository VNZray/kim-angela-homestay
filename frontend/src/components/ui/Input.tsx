import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  error?: boolean;
  errorMessage?: string;
}

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconClick,
  error = false,
  errorMessage,
  type = "text",
  ...props
}: InputProps) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {leftIcon && (
          <div
            style={{
              position: "absolute",
              left: "1rem",
              display: "flex",
              alignItems: "center",
              color: "var(--joy-palette-neutral-500)",
              pointerEvents: "none",
            }}
          >
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: leftIcon
              ? rightIcon
                ? "0.875rem 3rem 0.875rem 3rem"
                : "0.875rem 1rem 0.875rem 3rem"
              : rightIcon
                ? "0.875rem 3rem 0.875rem 1rem"
                : "0.875rem 1rem",
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            border: error
              ? "1px solid var(--joy-palette-danger-500)"
              : "1px solid var(--joy-palette-neutral-700)",
            borderRadius: "8px",
            outline: "none",
            transition: "all 0.2s ease",
            backgroundColor: "var(--joy-palette-background-surface)",
            color: "var(--joy-palette-text-primary)",
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = "var(--joy-palette-primary-500)";
              e.target.style.boxShadow = "0 0 0 3px rgba(218, 80, 25, 0.1)";
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = "var(--joy-palette-neutral-700)";
              e.target.style.boxShadow = "none";
            }
          }}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            style={{
              position: "absolute",
              right: "1rem",
              background: "none",
              border: "none",
              cursor: onRightIconClick ? "pointer" : "default",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              color: "var(--joy-palette-neutral-500)",
            }}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && errorMessage && (
        <div
          style={{
            marginTop: "0.25rem",
            fontSize: "0.875rem",
            color: "var(--joy-palette-danger-500)",
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Input;
