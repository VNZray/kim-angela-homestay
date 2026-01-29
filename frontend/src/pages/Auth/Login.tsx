import Card from "@/components/ui/Card";
import PageContainer from "@/components/PageContainer";
import LoginCard from "@/components/cards/LoginCard";

const Login = () => {
  return (
    <PageContainer>
      <Card
        elevation={6}
        variant="outlined"
        sx={{
          p: 0,
          width: {
            xs: "100%",
            sm: "500px",
            md: "500px",
            lg: "500px",
            xl: "500px",
          },
        }}
      >
        <LoginCard />
      </Card>
    </PageContainer>
  );
};

export default Login;
