import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/Container";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";
import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
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

    // Password validation
    if (formData.password.length < 8) {
      setAlert({
        open: true,
        type: "error",
        title: "Weak Password",
        message: "Password must be at least 8 characters long.",
      });
      setLoading(false);
      return;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        open: true,
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match.",
      });
      setLoading(false);
      return;
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      setAlert({
        open: true,
        type: "warning",
        title: "Terms Required",
        message: "Please agree to the terms and conditions.",
      });
      setLoading(false);
      return;
    }

    try {
      // Registration through AuthContext: Firebase + Supabase users + guest profile
      const newUser = await register(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });

      setAlert({
        open: true,
        type: "success",
        title: "Success!",
        message: "Account created successfully! Redirecting...",
      });

      // Redirect based on role: tourists go to home, business roles to dashboard
      setTimeout(() => {
        const isBusinessUser = ["admin", "staff", "manager"].includes(
          newUser.role,
        );
        navigate(isBusinessUser ? "/business/dashboard" : "/");
      }, 1500);
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific Firebase error codes
      let errorMessage = "An error occurred. Please try again.";
      if (error.message.includes("email-already-in-use")) {
        errorMessage =
          "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("weak-password")) {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.message.includes("invalid-email")) {
        errorMessage = "Invalid email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        open: true,
        type: "error",
        title: "Registration Failed",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      // Firebase Google authentication through AuthContext
      await loginWithGoogle();

      setAlert({
        open: true,
        type: "success",
        title: "Success!",
        message: "Google sign-up successful! Redirecting to dashboard...",
      });

      // Navigate to dashboard after successful sign-up
      setTimeout(() => {
        navigate("/business/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Google sign-up error:", error);

      let errorMessage = "Unable to sign up with Google. Please try again.";
      if (error.message.includes("popup-closed-by-user")) {
        errorMessage = "Sign-up cancelled. Please try again.";
      } else if (error.message.includes("popup-blocked")) {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (
        error.message.includes("account-exists-with-different-credential")
      ) {
        errorMessage =
          "An account already exists with this email using a different sign-in method.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        open: true,
        type: "error",
        title: "Google Sign-Up Failed",
        message: errorMessage,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card
        elevation={6}
        variant="outlined"
        sx={{
          p: 0,
          width: {
            xs: "100%",
            sm: "550px",
            md: "550px",
            lg: "550px",
            xl: "550px",
          },
        }}
      >
        <div style={{ padding: "clamp(1.5rem, 4vw, 2rem)" }}>
          {/* Header Section */}
          <div
            style={{
              marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            <Typography.Header align="center" size="sm" bold>
              Create Account
            </Typography.Header>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <Container
              padding="0"
              direction="row"
              style={{ marginBottom: "1.25rem" }}
            >
              {/* First Name */}
              <div>
                <Typography.Label
                  size="sm"
                  bold
                  style={{ marginBottom: "0.5rem", display: "block" }}
                >
                  First Name *
                </Typography.Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  leftIcon={<User size={20} />}
                />
              </div>

              {/* Last Name */}
              <div>
                <Typography.Label
                  size="sm"
                  bold
                  style={{ marginBottom: "0.5rem", display: "block" }}
                >
                  Last Name *
                </Typography.Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  leftIcon={<User size={20} />}
                />
              </div>
            </Container>

            {/* Email Field */}
            <div style={{ marginBottom: "1.25rem" }}>
              <Typography.Label
                size="normal"
                bold
                style={{ marginBottom: "0.5rem", display: "block" }}
              >
                Email Address *
              </Typography.Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                leftIcon={<Mail size={20} />}
              />
            </div>

            {/* Phone Field */}
            <div style={{ marginBottom: "1.25rem" }}>
              <Typography.Label
                size="normal"
                bold
                style={{ marginBottom: "0.5rem", display: "block" }}
              >
                Phone Number (Optional)
              </Typography.Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+63 912 345 6789"
                leftIcon={<Phone size={20} />}
              />
            </div>

            {/* Password Fields */}
            <Container
              padding="0"
              style={{
                gap: "1.25rem",
                marginBottom: "1.6rem",
              }}
            >
              {/* Password */}
              <div>
                <Typography.Label
                  size="sm"
                  bold
                  style={{ marginBottom: "0.5rem", display: "block" }}
                >
                  Password *
                </Typography.Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 8 characters"
                  leftIcon={<Lock size={20} />}
                  rightIcon={
                    showPassword ? <EyeOff size={20} /> : <Eye size={20} />
                  }
                  onRightIconClick={() => setShowPassword(!showPassword)}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Typography.Label
                  size="sm"
                  bold
                  style={{ marginBottom: "0.5rem", display: "block" }}
                >
                  Confirm Password *
                </Typography.Label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  leftIcon={<Lock size={20} />}
                  rightIcon={
                    showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )
                  }
                  onRightIconClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              </div>
            </Container>

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="primary"
              loading={loading}
              fullWidth
              sx={{
                padding: "0.875rem 1.5rem",
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div
            style={{
              margin: "2rem 0",
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
            <Typography.Body size="sm" color="secondary">
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

          {/* Google Sign-Up Button */}
          <Button
            type="button"
            variant="outlined"
            fullWidth
            size="lg"
            onClick={handleGoogleSignUp}
            loading={googleLoading}
            sx={{
              marginBottom: "1.5rem",
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
              {googleLoading ? "Signing up..." : "Continue with Google"}
            </span>
          </Button>

          {/* Login Link */}
          <Typography.Body size="normal" align="center">
            Already have an account?{" "}
            <Link to="/auth/login" style={{ textDecoration: "none" }}>
              <Typography.Body
                size="normal"
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
                Sign In
              </Typography.Body>
            </Link>
          </Typography.Body>
        </div>
      </Card>

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
    </PageContainer>
  );
};

export default Register;
