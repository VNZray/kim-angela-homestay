import {
  AspectRatio,
  Avatar,
  Box,
  IconButton,
  Sheet,
  useColorScheme,
} from "@mui/joy";
import Typography from "./ui/Typography";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { DarkMode, LightMode } from "@mui/icons-material";
import Logo from "@/assets/km-anegla-logo.jpg";
import Container from "./Container";
function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;
  return (
    <IconButton
      variant="soft"
      color="neutral"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
    >
      {mode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}

const Header = () => {
  const location = window.location;
  return (
    <Sheet
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container padding="0" direction="row" justify="center" align="center">
        <IconButton sx={{ borderRadius: "50%", padding: 0 }}>
          <Avatar color="warning" variant="solid">
            <AspectRatio ratio={1} sx={{ width: 90 }}>
              <img src={Logo} alt="Logo" />
            </AspectRatio>
          </Avatar>
        </IconButton>

        <Typography.Body size="md">Kim Angela Homestay</Typography.Body>
      </Container>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {["Home", "Rooms", "Services", "About"].map((item) => {
          const to = item === "Home" ? "/" : `/${item.toLowerCase()}`;
          const isActive = location.pathname === to;
          return (
            <Link key={item} to={to} style={{ textDecoration: "none" }}>
              <Button
                variant={isActive ? "solid" : "plain"}
                colorScheme={isActive ? "secondary" : "secondary"}
              >
                {item}
              </Button>
            </Link>
          );
        })}
        <Button>Login</Button>
        <ModeToggle />
        <IconButton sx={{ borderRadius: "50%", padding: 0 }}>
          <Avatar color="warning" variant="solid">
            RC
          </Avatar>
        </IconButton>
      </Box>
    </Sheet>
  );
};

export default Header;
