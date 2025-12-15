import Container from "@/components/Container";
import PageContainer from "@/components/PageContainer";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { colors } from "@/utils/Colors";
import { useColorScheme } from "@mui/joy";

export const AccommodationDashboard = () => {
  const { mode } = useColorScheme();
  return (
    <PageContainer>
      <Typography.Title>Accommodation Business Dashboard</Typography.Title>
      <Card ColorScheme="transparent" elevation={6}>
        <Typography.Header>
          Accommodation Business Dashboard
        </Typography.Header>
      </Card>
      <Typography.CardTitle>
        Accommodation Business Dashboard
      </Typography.CardTitle>
      <Typography.CardSubTitle>
        Accommodation Business Dashboard
      </Typography.CardSubTitle>
      <Typography.Label>Accommodation Business Dashboard</Typography.Label>
      <Typography.Body>Accommodation Business Dashboard</Typography.Body>
    </PageContainer>
  );
};
