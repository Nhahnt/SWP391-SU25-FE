import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("role") || ""
  );

  const role = localStorage.getItem("role");

  const [anchorELement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorELement);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleCloseMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    localStorage.removeItem("memberId");
    localStorage.removeItem("coachId");
    localStorage.removeItem("userID");
    localStorage.removeItem("isVip");
    setIsLoggedIn(false);
    setUserRole("");

    navigate("/");
  };

  const navButtonStyles = {
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      textDecoration: "underline",
      textDecorationColor: "#FFD700",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        background: "#c2410c",
        height: "10vh",
        justifyContent: "center",
        display: "block",
      }}
    >
      <Toolbar className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
        {/* Logo + Title */}
        <Box className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Smoke-Free Journey Logo"
            className="max-w-[85px] h-auto"
          />
          <Typography
            variant="h6"
            className="text-white font-semibold text-[1.5rem] m-0"
          >
            Smoke-Free Journey
          </Typography>
        </Box>

        {/* Navigation */}
        <Box className="flex gap-4 items-center">
          <Button component={Link} to="/" sx={navButtonStyles}>
            Home
          </Button>

          <Button component={Link} to="/blogs" sx={navButtonStyles}>
            Blogs
          </Button>

          {isLoggedIn ? (
            <>
              {(role === "COACH" || role === "MEMBER") && (
                <Button
                  component={Link}
                  to="/conversations"
                  sx={navButtonStyles}
                >
                  Chat
                </Button>
              )}

              {role === "MEMBER" && (
                <>
                  <Button
                    id="quit-plan-button"
                    aria-controls={open ? "quit-plan-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleOpenMenu}
                    sx={navButtonStyles}
                  >
                    Quit Plan
                  </Button>

                  <Menu
                    id="quit-plan-menu"
                    anchorEl={anchorELement}
                    open={open}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      "aria-labelledby": "quit-plan-button",
                    }}
                  >
                    <MenuItem
                      onClick={() => handleMenuItemClick("/progress-tracking")}
                    >
                      Progress Tracking
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuItemClick("/view-quit-plan")}
                    >
                      View Plan
                    </MenuItem>
                  </Menu>

                  <Button component={Link} to="/quiz" sx={navButtonStyles}>
                    Quiz
                  </Button>
                </>
              )}

              {(userRole === "ADMIN" || userRole === "STAFF") && (
                <Button component={Link} to="/dashboard" sx={navButtonStyles}>
                  Dashboard
                </Button>
              )}
              {(userRole === "ADMIN" ||
                userRole === "STAFF" ||
                userRole === "COACH" ||
                userRole === "MEMBER") && (
                <Button component={Link} to="/profile" sx={navButtonStyles}>
                  Profile
                </Button>
              )}
              <Button
                onClick={handleLogout}
                sx={{
                  ...navButtonStyles,
                  "&:hover": {
                    ...navButtonStyles["&:hover"],
                    backgroundColor: "rgba(220, 53, 69, 0.2)",
                    textDecorationColor: "#FF6B6B",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                ...navButtonStyles,
                "&:hover": {
                  ...navButtonStyles["&:hover"],
                  backgroundColor: "rgba(40, 167, 69, 0.2)",
                  textDecorationColor: "#28A745",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
