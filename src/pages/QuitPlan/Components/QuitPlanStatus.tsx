import React, { useEffect, useState } from "react";
import { Typography, Button, Box, CircularProgress, Snackbar, Alert as MuiAlert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8082";

interface QuitPlanStatusProps {
  children: React.ReactNode;
}

export default function QuitPlanStatus({ children }: QuitPlanStatusProps) {
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const checkPlanStatus = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/plans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasPlan(true);
      } catch (error: any) {
        if(error?.response.status === 404) {
            console.log("Không có plan.");
        }
        setHasPlan(false);
      }
    };

    if (token) {
      checkPlanStatus();
    } else {
      setHasPlan(false);
    }
  }, [token]);

  // Redirect if has plan
  useEffect(() => {
    if (hasPlan === true) {
      setIsRedirecting(true); 
      showSnackbar("Bạn đã có kế hoạch cai thuốc. Đang chuyển hướng đến trang chi tiết kế hoạch...", "info");
      
      const timer = setTimeout(() => {
        navigate("/view-quit-plan");
      }, 3000); // Redirect after 3 seconds

      return () => {
        clearTimeout(timer); 
        setIsRedirecting(false); 
      };
    }
  }, [hasPlan, navigate]);

  // Loading
  if (hasPlan === null) {
    return (
      <Box className="w-full flex flex-col items-center justify-center h-64">
        <CircularProgress sx={{ color: "#c2410c" }} />
        <Typography variant="body1" sx={{ mt: 2, color: "#c2410c" }}>
          Đang kiểm tra kế hoạch của bạn...
        </Typography>
      </Box>
    );
  }

  if (hasPlan === true) {
    return (
      <Box className="w-full flex flex-col items-center justify-center h-64">
        <Typography
          variant="h5"
          sx={{ color: "#c2410c", fontWeight: "bold", mb: 2 }}
        >
          Bạn đã có kế hoạch cai thuốc!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          Đang chuyển hướng đến trang chi tiết kế hoạch...
        </Typography>
        <CircularProgress sx={{ color: "#c2410c" }} />

        {/* Overlay to disable clicks during redirection */}
        {isRedirecting && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              pointerEvents: 'none', 
              cursor: 'not-allowed', 
              background: 'rgba(255, 255, 255, 0.01)', 
            }}
          />
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
    );
  }

  return <>{children}</>;
}
