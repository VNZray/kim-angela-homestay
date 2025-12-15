import Button from "../components/ui/Button";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <Box
      gap={2}
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        mt: 4,
        justifyContent: "center",
      }}
    >
      <Button onClick={()=> {navigate("/tourism/dashboard")}}>Tourism</Button>
      <Button onClick={()=> {navigate("/business/dashboard")}}>Business</Button>
    </Box>
  );
}
