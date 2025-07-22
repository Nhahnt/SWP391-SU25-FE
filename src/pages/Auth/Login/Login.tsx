import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8082/api/login",
        { userName: username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { token, role, memberId, coachId } = response.data;

      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      if (memberId) localStorage.setItem("memberId", memberId.toString());
      if (coachId) localStorage.setItem("coachId", coachId.toString());
      if (role === "ADMIN" || role === "STAFF") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      // Cấu hình token mặc định cho axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;
      setErrorMsg("");
    } catch (err: any) {
      let message = "Đăng nhập thất bại";
      if (err.response) {
        if (err.response.data && typeof err.response.data === "string") {
          message = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          message = err.response.data.message;
        } else {
          message = `Lỗi: ${err.response.status}`;
        }
      } else if (err.request) {
        message = "Không thể kết nối đến máy chủ.";
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
      alert(message);
      console.error(message, err);
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
        Welcome Back
      </Typography>
      <Typography
        variant="body2"
        className="text-gray-500 mb-6"
        textAlign="center"
      >
        Please sign in to continue
      </Typography>

      {/* Loading Spinner */}
      {loading && (
        <Box className="flex justify-center my-2">
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        {errorMsg && (
          <Typography color="error" textAlign="center" sx={{ mb: 1 }}>
            {errorMsg}
          </Typography>
        )}
        <TextField
          fullWidth
          label="userName"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setuserName(e.target.value)}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {/* Forgot Password Link */}
        <Box className="text-right mt-1">
          <Typography
            variant="body2"
            component="a"
            href="/forgot-password"
            sx={{
              textDecoration: "none",
              color: "#2563EB",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#c2410c",
            "&:hover": { bgcolor: "#9a3412" },
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Đăng nhập"}
        </Button>

        {/* Register Link */}
        <Box className="text-center mt-4">
          <Typography
            variant="body2"
            component="a"
            href="/register"
            sx={{
              textDecoration: "none",
              color: "#2563EB",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Chưa có tài khoản? Đăng ký
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
