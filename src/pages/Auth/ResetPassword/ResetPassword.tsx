import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const handleResetPassword = () => {
    navigate("/login");
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
        Create new password
      </Typography>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          fullWidth
          label="Mật khẩu mới"
          type="password"
          variant="outlined"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Xác nhận mật khẩu"
          type="password"
          variant="outlined"
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#c2410c",
            "&:hover": { bgcolor: "#9a3412" },
          }}
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
      </form>
    </Paper>
  );
}
