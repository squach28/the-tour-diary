import { Link as RouterLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link,
  Button,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  ListItem,
  Divider,
} from "@mui/material";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link
            component={RouterLink}
            to="/"
            sx={{ color: "white", textDecoration: "none" }}
          >
            <Typography variant="h6" component="div">
              the tour diary
            </Typography>
          </Link>
          {isAuthenticated && user ? (
            <Button onClick={toggleDrawer} sx={{ color: "white", ml: "auto" }}>
              <Typography variant="h6">{user.id.slice(0, 5)}</Typography>
            </Button>
          ) : (
            <Link component={RouterLink} to="/auth/login">
              Log in
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer} anchor="right">
        <SideNavBar toggleDrawer={toggleDrawer} />
      </Drawer>
    </Box>
  );
};

const SideNavBar = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };
  return (
    <Box role="presentation" onClick={toggleDrawer} sx={{ width: 250 }}>
      <List>
        <ListItem>
          <ListItemText>
            {user ? `Hi, ${user.id.slice(0, 5)}!` : null}
          </ListItemText>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemButton component={RouterLink} to="/profile">
            Profile
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              fontWeight: "bold",
              color: "red",
              borderRadius: "5px",
            }}
          >
            <ListItemText>Log out</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Navbar;
