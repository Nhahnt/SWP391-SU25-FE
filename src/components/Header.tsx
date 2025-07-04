import { useState } from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // 🔁 Replace with actual auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
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
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "#c2410c",
        height: "70px",
        zIndex: 100,
        justifyContent: "center",
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
          <Button
            component={Link}
            to="/"
            className="!text-white font-semibold normal-case"
          >
            Home
          </Button>

          {isLoggedIn ? (
            <>
              {userRole === "ADMIN" && (
                <Button
                  component={Link}
                  to="/dashboard"
                  className="!text-white font-semibold normal-case"
                >
                  Dashboard
                </Button>
              )}
              {userRole === "ADMIN" ||
                userRole === "STAFF" ||
                (userRole === "MEMBER" && (
                  <Button
                    component={Link}
                    to="/profile"
                    className="!text-white font-semibold normal-case"
                  >
                    Profile
                  </Button>
                ))}
              <Button
                onClick={handleLogout}
                className="!text-white font-semibold normal-case hover:text-blue-600 transition-colors duration-300"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              className="!text-white font-semibold normal-case hover:text-blue-600 transition-colors duration-300"
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
