import { X } from "lucide-react";
import { Modal, Sheet } from "@mui/joy";
import LoginCard from "@/components/cards/LoginCard";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: "16px",
          p: 0,
          boxShadow: "lg",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            color: "var(--joy-palette-text-secondary)",
            zIndex: 1,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--joy-palette-neutral-100)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <X size={24} />
        </button>

        <LoginCard onSuccess={onClose} onLinkClick={onClose} />
      </Sheet>
    </Modal>
  );
};

export default LoginModal;
