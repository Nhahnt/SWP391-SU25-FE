import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    // Check for reset token in URL query params (from email link)
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
    } else {
      // If no token, redirect to forgot password
      alert("Invalid or missing reset token. Please use the forgot password feature.");
      navigate("/forgot-password");
    }
  }, [location.search, navigate]);

  const handleResetPassword = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (!resetToken) {
      alert("Token không hợp lệ. Vui lòng thử lại.");
      return;
    }

    setLoading(true);
    
    try {
      // Call the existing reset-password API with the token from email
      await axios.post(
        "http://localhost:8082/api/reset-password",
        { 
          password: newPassword 
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resetToken}`,
          },
          withCredentials: true,
        }
      );
      
      // Success - password changed in database
      alert("Đặt lại mật khẩu thành công!");
      
      // Clear any stored tokens and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      navigate("/login");
      
    } catch (error: any) {
      console.error("Reset password failed", error);
      
      if (error.response && error.response.status === 401) {
        alert("Token đã hết hạn hoặc không hợp lệ. Vui lòng thực hiện lại quá trình quên mật khẩu.");
        navigate("/forgot-password");
      } else if (error.response && error.response.status === 403) {
        alert("Token không hợp lệ. Vui lòng thực hiện lại quá trình quên mật khẩu.");
        navigate("/forgot-password");
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        Reset Password
      </Typography>
      <Typography
        variant="body2"
        className="text-gray-500 mb-6"
        textAlign="center"
      >
        Enter your new password below
      </Typography>

      {/* Token Status Indicator */}
      <Box sx={{ 
        p: 2, 
        mb: 2, 
        backgroundColor: resetToken ? '#e8f5e8' : '#ffebee', 
        borderRadius: 1,
        border: `1px solid ${resetToken ? '#4caf50' : '#f44336'}`
      }}>
        <Typography variant="body2" color={resetToken ? 'success.main' : 'error.main'} textAlign="center">
          {resetToken ? '✅ Valid reset token detected' : '❌ No valid reset token found'}
        </Typography>
      </Box>

      {/* Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
        <TextField
          fullWidth
          label="Mật khẩu mới"
          type="password"
          variant="outlined"
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={!resetToken}
        />

        <TextField
          fullWidth
          label="Xác nhận mật khẩu mới"
          type="password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={!resetToken}
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
          disabled={loading || !resetToken}
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </Button>
      </form>

      {/* Back to Forgot Password Link */}
      <Box className="text-center mt-4">
        <Button
          variant="text"
          sx={{ 
            color: "#6b7280",
            "&:hover": { color: "#374151" }
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Back to Forgot Password
        </Button>
      </Box>

      {/* Show token status for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <Typography variant="caption" sx={{ mt: 2, color: 'gray', display: 'block' }}>
          Token: {resetToken ? 'Available' : 'Not found'}<br/>
          Token Length: {resetToken ? resetToken.length : 0}
        </Typography>
      )}
    </Paper>
  );
}
