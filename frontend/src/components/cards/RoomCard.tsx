import { AspectRatio, Box } from "@mui/joy";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import Button from "../ui/Button";

type RoomCardProps = {
  title: string;
  icon?: React.ReactNode;
  description: string;
  capacity: string;
  features: string[];
  price: string;
  image: string;
  buttonText?: string;
  onClick?: () => void;
};

const RoomCard = ({
  title,
  icon,
  description,
  capacity,
  features,
  price,
  image,
  buttonText,
  onClick,
}: RoomCardProps) => {
  return (
    <Card
      colorScheme="light"
      sx={{
        height: "100%",
        borderRadius: "lg",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      {/* Room Image */}
      <AspectRatio
        ratio="4/3"
        sx={{
          borderRadius: "md",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <img src={image} alt={title} style={{ objectFit: "cover" }} />
      </AspectRatio>

      {/* Room Info */}
      <Box sx={{ p: 2 }}>
        {/* Title with Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          {icon && <Box sx={{ fontSize: 24 }}>{icon}</Box>}
          <Typography.CardTitle size="md" color="dark">
            {title}
          </Typography.CardTitle>
        </Box>

        {/* Description */}
        <Typography.Body size="sm" color="default" sx={{ mb: 2, opacity: 0.8 }}>
          {description}
        </Typography.Body>

        {/* Capacity */}
        <Typography.Label
          size="sm"
          color="primary"
          sx={{ mb: 2, display: "block" }}
        >
          Capacity: {capacity}
        </Typography.Label>

        {/* Features */}
        <Box sx={{ mb: 2 }}>
          {features.map((feature, idx) => (
            <Typography.Body
              key={idx}
              size="xs"
              color="default"
              sx={{ mb: 0.5, opacity: 0.7 }}
            >
              • {feature}
            </Typography.Body>
          ))}
        </Box>

        {/* Price and CTA */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Typography.CardTitle size="md" color="primary">
            {price}
          </Typography.CardTitle>
          <Button variant="soft" colorScheme="primary" onClick={onClick}>
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default RoomCard;
