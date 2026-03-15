import Container from "@/components/Container";
import Typography from "@/components/ui/Typography";
import { colors } from "@/utils/Colors";
import { Box, useColorScheme } from "@mui/joy";

const StatCard = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  borderColor: string;
  cardBg: string;
}) => {
  const { mode } = useColorScheme();
  return (
    <Container
      background="light"
      align="center"
      direction="row"
      elevation={2}
      hover
      hoverBackground={mode === "dark" ? colors.dark : colors.light}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.softBg",
          color: "primary.plainColor",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography.Body size="xs" color="default">
          {label}
        </Typography.Body>
        <Typography.Header size="sm" bold>
          {value}
        </Typography.Header>
        {sub && (
          <Typography.Body size="xs" color="default">
            {sub}
          </Typography.Body>
        )}
      </Box>
    </Container>
  );
};

export default StatCard;
