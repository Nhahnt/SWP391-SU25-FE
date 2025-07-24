import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Fade,
  Backdrop,
  Button,
  TextField,
  Rating,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const style = {
  position: "fixed" as const,
  right: 32,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1300,
};

const modalStyle = {
  position: "absolute" as const,
  bottom: 100,
  right: 32,
  width: 400,
  bgcolor: "#fff7ed",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  outline: "none",
  border: "2px solid #c2410c",
  display: "flex",
  flexDirection: "column" as const,
  gap: 2,
};

const API_BASE = "http://localhost:8082/api";

const userRole = localStorage.getItem("role");

export default function UserFeedback() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [coachId, setCoachId] = useState<string>("");
  const [coaches, setCoaches] = useState<any[]>([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState("");

  const handleOpen = () => {
    setOpen(true);
    fetchCoaches();
  };
  const handleClose = () => {
    setOpen(false);
    setRating(null);
    setComment("");
    setSuccess(false);
    setError("");
    setCoachId("");
    setCoachError("");
  };

  const fetchCoaches = async () => {
    setCoachLoading(true);
    setCoachError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/admin/accounts/coaches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoaches(res.data);
    } catch (e: any) {
      setCoachError("Failed to load coaches.");
      setCoaches([]);
    } finally {
      setCoachLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/rating`,
        {
          stars: rating,
          comment,
          // coachId: ... // If needed, but your backend gets coach from member
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setRating(null);
      setComment("");
      setCoachId("");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (userRole && userRole !== "MEMBER") return null;

  return (
    <Box sx={style}>
      <IconButton
        color="primary"
        size="medium"
        onClick={handleOpen}
        sx={{
          background: "#fff7ed",
          boxShadow: 3,
          border: "2px solid #c2410c",
          width: 32,
          height: 32,
          p: 0,
        }}
        aria-label="Open feedback form"
      >
        <span style={{ fontSize: 14, color: "#c2410c" }}>⭐</span>
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 200 } }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold" color="#c2410c">
                Rate Your Coach
              </Typography>
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ color: "#c2410c" }}
              >
                <span style={{ fontSize: 20 }}>✖️</span>
              </IconButton>
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="coach-select-label">Select Coach</InputLabel>
              <Select
                labelId="coach-select-label"
                value={coachId}
                label="Select Coach"
                onChange={(e) => setCoachId(e.target.value)}
                disabled={coachLoading}
              >
                {coachLoading ? (
                  <MenuItem value="" disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                  </MenuItem>
                ) : coachError ? (
                  <MenuItem value="" disabled>
                    {coachError}
                  </MenuItem>
                ) : coaches.length === 0 ? (
                  <MenuItem value="" disabled>
                    No coaches found
                  </MenuItem>
                ) : (
                  coaches.map((coach: any) => (
                    <MenuItem
                      key={coach.userId || coach.user_id}
                      value={coach.userId || coach.user_id}
                    >
                      {coach.fullName ||
                        coach.full_name ||
                        coach.userName ||
                        coach.user_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="#c2410c"
              mb={1}
            >
              How would you rate your coach?
            </Typography>
            <Rating
              name="coach-rating"
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="large"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Leave a comment (optional)"
              multiline
              minRows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 2, background: "#fff" }}
            />
            {error && (
              <Typography color="#e53935" fontSize={14} mb={1}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="#388e3c" fontSize={15} mb={1} fontWeight={600}>
                Thank you for your feedback!
              </Typography>
            )}
            <Button
              variant="contained"
              sx={{
                bgcolor: "#c2410c",
                "&:hover": { bgcolor: "#a0300a" },
                color: "white",
                fontWeight: 600,
                borderRadius: 2,
                mt: 1,
              }}
              onClick={handleSubmit}
              disabled={loading || !rating || !coachId}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
