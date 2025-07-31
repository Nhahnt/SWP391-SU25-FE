import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
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
  const [loading, setLoading] = useState(false);
  const role = "MEMBER"; // Role is always "MEMBER"

  // Field-specific error states
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [genderError, setGenderError] = useState("");

  const validateFields = () => {
    let isValid = true;
    
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneNumberError("");
    setFullNameError("");
    setGenderError("");

    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      setPhoneNumberError("Phone number is required");
      isValid = false;
    }

    if (!fullName.trim()) {
      setFullNameError("Full name is required");
      isValid = false;
    }

    if (!gender || gender === "") {
      setGenderError("Please select a gender");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
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
        Register
      </Typography>

      {/* Loading Spinner */}
      {loading && (
        <Box className="flex justify-center my-2">
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError("");
          }}
          disabled={loading}
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          disabled={loading}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          margin="normal"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            if (phoneNumberError) setPhoneNumberError("");
          }}
          disabled={loading}
          error={!!phoneNumberError}
          helperText={phoneNumberError}
        />
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          margin="normal"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fullNameError) setFullNameError("");
          }}
          disabled={loading}
          error={!!fullNameError}
          helperText={fullNameError}
        />
        <Select
          fullWidth
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            if (genderError) setGenderError("");
          }}
          displayEmpty
          inputProps={{ "aria-label": "Gender" }}
          sx={{ mt: 2, mb: 1 }}
          disabled={loading}
          error={!!genderError}
        >
          <MenuItem value="" disabled>
            <em>Select gender</em>
          </MenuItem>
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
        </Select>
        {genderError && (
          <FormHelperText error sx={{ mt: 0 }}>
            {genderError}
          </FormHelperText>
        )}
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
            if (confirmPassword && e.target.value === confirmPassword) {
              setConfirmPasswordError("");
            }
          }}
          disabled={loading}
          error={!!passwordError}
          helperText={passwordError}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) setConfirmPasswordError("");
          }}
          disabled={loading}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Register"}
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
