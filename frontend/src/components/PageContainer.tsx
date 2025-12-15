import { Box } from "@mui/joy";

type Props = {
  children: React.ReactNode;
  sx?: object;
  gap?: number;
};

const PageContainer = ({ children, sx, gap = 2 }: Props) => {
  return (
    <Box
      gap={gap}
      minHeight={"100vh"}
      sx={{
        height: { xs: "auto", md: "auto" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
        paddingY: { xs: 1, md: 4 },
        ...sx,
      }}
    >
      {/* Reusable Background Component */}
      {children}
    </Box>
  );
};

export default PageContainer;
