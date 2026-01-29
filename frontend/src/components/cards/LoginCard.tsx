import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

interface LoginCardProps {
  onSuccess?: () => void;
  onLinkClick?: () => void;
}

const LoginCard = ({ onSuccess, onLinkClick }: LoginCardProps) => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setAlert({
        open: true,
        type: "warning",
        title: "Validation Error",
        message: "Please fill in all required fields.",
      });
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlert({
        open: true,
        type: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
      });
      setLoading(false);
      return;
    }

    try {
      // Firebase authentication through AuthContext
      const loggedInUser = await login(
        formData.email,
        formData.password,
        formData.rememberMe,
      );

      setAlert({
        open: true,
        type: "success",
        title: "Success!",
        message: "Login successful! Redirecting...",
      });

      // Redirect based on user role
      const isBusinessUser = ["admin", "staff", "manager"].includes(
        loggedInUser.role,
      );

      // Call onSuccess callback or navigate after successful login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(isBusinessUser ? "/business/dashboard" : "/");
        }
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific Firebase error codes
      let errorMessage = "Invalid credentials. Please try again.";
      if (error.message.includes("invalid-credential")) {
        errorMessage = "Invalid email or password.";
      } else if (error.message.includes("user-not-found")) {
        errorMessage = "No account found with this email.";
      } else if (error.message.includes("wrong-password")) {
        errorMessage = "Incorrect password.";
      } else if (error.message.includes("too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        open: true,
        type: "error",
        title: "Login Failed",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Firebase Google authentication through AuthContext
      const loggedInUser = await loginWithGoogle();

      setAlert({
        open: true,
        type: "success",
        title: "Success!",
        message: "Google sign-in successful! Redirecting...",
      });

      // Redirect based on user role
      const isBusinessUser = ["admin", "staff", "manager"].includes(
        loggedInUser.role,
      );

      // Call onSuccess callback or navigate after successful login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(isBusinessUser ? "/business/dashboard" : "/");
        }
      }, 1500);
    } catch (error: any) {
      console.error("Google login error:", error);

      let errorMessage = "Unable to sign in with Google. Please try again.";
      if (error.message.includes("popup-closed-by-user")) {
        errorMessage = "Sign-in cancelled. Please try again.";
      } else if (error.message.includes("popup-blocked")) {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        open: true,
        type: "error",
        title: "Google Sign-In Failed",
        message: errorMessage,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "clamp(1.5rem, 4vw, 2rem)" }}>
        {/* Header Section */}
        <div
          style={{
            marginBottom: "clamp(1.5rem, 4vw, 2rem)",
          }}
        >
          <Typography.CardTitle align="center" size="md" bold>
            Welcome Back
          </Typography.CardTitle>
          <Typography.Body
            align="center"
            size="normal"
            color="default"
            style={{ marginTop: "0.5rem" }}
          >
            Sign in to continue to Kim Angela Homestay
          </Typography.Body>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: "1.25rem" }}>
            <Typography.Label
              size="sm"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Email Address
            </Typography.Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              leftIcon={<Mail size={20} />}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "1rem" }}>
            <Typography.Label
              size="sm"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Password
            </Typography.Label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              leftIcon={<Lock size={20} />}
              rightIcon={
                showPassword ? <EyeOff size={20} /> : <Eye size={20} />
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                style={{
                  width: "1.125rem",
                  height: "1.125rem",
                  cursor: "pointer",
                  accentColor: "var(--joy-palette-primary-500)",
                }}
              />
              <Typography.Body size="sm">Remember me</Typography.Body>
            </label>
            <Link
              to="/forgot-password"
              style={{ textDecoration: "none" }}
              onClick={onLinkClick}
            >
              <Typography.Body
                size="sm"
                color="primary"
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Forgot Password?
              </Typography.Body>
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="primary"
            loading={loading}
            fullWidth
            size="lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div
          style={{
            margin: "1.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "var(--joy-palette-neutral-300)",
            }}
          />
          <Typography.Body size="sm" color="primary">
            or
          </Typography.Body>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "var(--joy-palette-neutral-300)",
            }}
          />
        </div>

        {/* Google Sign-In Button */}
        <Button
          type="button"
          variant="outlined"
          colorScheme="undefined"
          fullWidth
          size="lg"
          onClick={handleGoogleLogin}
          loading={googleLoading}
          sx={{
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </Button>

        {/* Register Link */}
        <div>
          <Typography.Body align="center" size="sm">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              style={{ textDecoration: "none" }}
              onClick={onLinkClick}
            >
              <Typography.Body
                size="sm"
                color="primary"
                bold
                style={{
                  display: "inline",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign Up
              </Typography.Body>
            </Link>
          </Typography.Body>
        </div>
      </div>

      {/* Alert Component */}
      <Alert
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
      />
    </>
  );
};

export default LoginCard;
