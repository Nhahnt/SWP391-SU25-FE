import { Outlet, useNavigate } from "react-router-dom";

import AppBreadcrumbs from "./components/shared/BreadCrumbs";
import Header from "./components/Header";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

// import Header, Sidebar, Footer nếu cần

export default function AuthLayout() {
  const navigate = useNavigate();
  return (
    <Box className="flex h-screen overflow-hidden ">
      {/* Left image section */}
      <Box
        className="relative w-[70%] h-screen"
        sx={{
          backgroundImage: `url('/smoking_background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay để làm mờ nền */}
        <Box
          className="absolute inset-0 bg-black bg-opacity-50"
          sx={{ zIndex: 1 }}
        />

        {/* Nội dung bên trên overlay */}
        <Box className="relative z-10 flex flex-col items-start justify-center h-full p-16 space-y-4">
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontSize: { xs: "2.5rem", md: "5rem" },
            }}
          >
            Smoke-Free
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontSize: { xs: "1rem", md: "1.25rem" },
              maxWidth: "500px",
              textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            A supportive journey to help you quit smoking for good.
          </Typography>
        </Box>
      </Box>

      {/* Right login section */}
      <Box className="flex-1 flex items-center justify-center bg-white px-4">
        <Outlet />
      </Box>
    </Box>
  );
}
