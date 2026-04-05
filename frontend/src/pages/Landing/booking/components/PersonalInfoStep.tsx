import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";
import { Box } from "@mui/joy";
import { Mail, Phone, User } from "lucide-react";

interface PersonalInfoStepProps {
  fullName: string;
  email: string;
  phone: string;
  onChange: (field: "fullName" | "email" | "phone", value: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
}

export default function PersonalInfoStep({
  fullName,
  email,
  phone,
  onChange,
  errors,
  onNext,
}: PersonalInfoStepProps) {
  return (
    <Container variant="outlined" padding="30px">
      <Typography.CardTitle size="sm" color="dark" sx={{ mb: 3 }}>
        Personal & Contact Information
      </Typography.CardTitle>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
            Full Name *
          </Typography.Label>
          <Input
            name="fullName"
            value={fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            leftIcon={<User size={18} />}
            error={!!errors.fullName}
            errorMessage={errors.fullName}
          />
        </Box>

        <Box>
          <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
            Email Address *
          </Typography.Label>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Enter your email"
            leftIcon={<Mail size={18} />}
            error={!!errors.email}
            errorMessage={errors.email}
          />
        </Box>

        <Box>
          <Typography.Label size="sm" color="dark" sx={{ mb: 0.5 }}>
            Contact Number *
          </Typography.Label>
          <Input
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="e.g. 09171234567"
            leftIcon={<Phone size={18} />}
            error={!!errors.phone}
            errorMessage={errors.phone}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="solid" colorScheme="primary" onClick={onNext}>
          Next: Guest Details
        </Button>
      </Box>
    </Container>
  );
}
