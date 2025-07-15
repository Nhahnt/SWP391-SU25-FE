import { Box, Button, TextField, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async () => {
    // Basic validation
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    
    try {
      // Call backend forgot-password API
      await axios.post(
        "http://localhost:8082/api/forgot-password",
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      // Email sent successfully - show success state
      setEmailSent(true);
      
    } catch (error: any) {
      // Error handling for backend exceptions
      console.error("Forgot password failed", error);
      
      // Backend throws AuthenticationException("User not found") for email not found
      if (error.response && (
          error.response.status === 500 || 
          error.response.status === 404 ||
          error.response.status === 401 ||
          (error.response.data && typeof error.response.data === 'string' && 
           error.response.data.includes("User not found")) ||
          (error.response.data && error.response.data.message && 
           error.response.data.message.includes("User not found"))
        )) {
        // Email doesn't exist - show popup
        setOpenDialog(true);
      } else {
        // Other errors (network, server, etc.)
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail("");
  };

  // Show success state after email is sent
  if (emailSent) {
    return (
      <Paper elevation={3} className="w-full p-6 max-w-sm">
        {/* Logo */}
        <Box className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-16 object-contain" />
        </Box>

        {/* Success Message */}
        <Box className="text-center">
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="success.main"
          >
            Email Sent! ✉️
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-700 mb-4"
          >
            We've sent a password reset link to:
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            className="text-blue-600 mb-4"
          >
            {email}
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-500 mb-6"
          >
            Please check your email and click the reset link to create a new password.
          </Typography>

          <Box className="space-y-2">
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#c2410c",
                "&:hover": { bgcolor: "#9a3412" },
                mb: 1
              }}
              onClick={handleBackToLogin}
            >
              Back to Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: "#c2410c",
                color: "#c2410c",
                "&:hover": { 
                  borderColor: "#9a3412",
                  backgroundColor: "#fef2f2"
                },
              }}
              onClick={handleTryAgain}
            >
              Try Different Email
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Show form state
  return (
    <Paper elevation={3} className="w-full p-6 max-w-sm">
      {/* Logo */}
      <Box className="flex justify-center mb-4">
        <img src="/logo.png" alt="Logo" className="h-16 object-contain" />
      </Box>

      {/* Heading */}
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
      >
        Forgot Password
      </Typography>
      <Typography
        variant="body2"
        className="text-gray-500 mb-6"
        textAlign="center"
      >
        Enter your email address and we'll send you a reset link
      </Typography>

      {/* Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
        <TextField 
          fullWidth 
          label="Email" 
          variant="outlined" 
          margin="normal" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#c2410c",
            "&:hover": { bgcolor: "#9a3412" },
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {/* Back to Login Link */}
      <Box className="text-center mt-4">
        <Button
          variant="text"
          sx={{ 
            color: "#6b7280",
            "&:hover": { color: "#374151" }
          }}
          onClick={handleBackToLogin}
        >
          Back to Login
        </Button>
      </Box>

      {/* Email Not Found Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Email Not Found</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            The email address "{email}" doesn't exist in our database. 
            Please check your email address and try again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            variant="contained"
            sx={{
              bgcolor: "#c2410c",
              "&:hover": { bgcolor: "#9a3412" },
            }}
          >
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
