import { Box } from "@mui/joy";
import Typography from "./ui/Typography";

type props = {
  title: string;
  subtitle: string;
};

const SectionHeader = ({ title, subtitle }: props) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: { xs: 4, md: 6 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Typography.Header align="center" size="md" sx={{ mb: 2 }}>
        {title}
      </Typography.Header>
      <Typography.Body
        align="center"
        size="md"
        sx={{ maxWidth: "600px", mx: "auto", opacity: 0.8 }}
      >
        {subtitle}
      </Typography.Body>
    </Box>
  );
};

export default SectionHeader;
