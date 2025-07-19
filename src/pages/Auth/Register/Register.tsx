import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const role = "MEMBER"; // Role is always "MEMBER"

  const handleRegister = async () => {
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !fullName ||
      !gender
    ) {
      alert("Please fill in all required information!");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!gender || gender === "") {
      alert("Please select a gender!");
      return;
    }

    try {
      await axios.post("http://localhost:8082/api/register", {
        userName: username,
        email,
        password,
        phoneNumber,
        fullName,
        role,
        gender,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed!";
      alert(errorMessage);
      console.error(error);
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
        Register
      </Typography>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Select
          fullWidth
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Gender" }}
          sx={{ mt: 2, mb: 1 }}
        >
          <MenuItem value="" disabled>
            <em>Select gender</em>
          </MenuItem>
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
        </Select>
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {/* Hidden role field */}
        <input type="hidden" value={role} readOnly />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#c2410c",
            "&:hover": { bgcolor: "#9a3412" },
          }}
          onClick={handleRegister}
        >
          Register
        </Button>

        {/* Login Link */}
        <Box className="text-center mt-4">
          <Typography
            variant="body2"
            component="a"
            href="/login"
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
            Already have an account? Login
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
