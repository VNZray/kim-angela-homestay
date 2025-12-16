import PageContainer from "@/components/PageContainer";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";

import { useColorScheme } from "@mui/joy";
import { getColors } from "@/utils/Colors";
import Container from "@/components/Container";

export default function Rooms() {
  const { mode } = useColorScheme();
  const themeColor = getColors(mode);
  return (
    <PageContainer>
      <Container>
        <Typography.Body color="dark">
          This is the Rooms page. You can add content related to rooms here.
        </Typography.Body>
      </Container>
    </PageContainer>
  );
}
