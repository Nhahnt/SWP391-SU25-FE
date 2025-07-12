import { useState } from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // 🔁 Replace with actual auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("role") || ""
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
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
              {userRole === "ADMIN" && (
                <Button component={Link} to="/dashboard" sx={navButtonStyles}>
                  Dashboard
                </Button>
              )}
              {userRole === "ADMIN" ||
                userRole === "STAFF" ||
                (userRole === "MEMBER" && (
                  <Button component={Link} to="/profile" sx={navButtonStyles}>
                    Profile
                  </Button>
                ))}
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
