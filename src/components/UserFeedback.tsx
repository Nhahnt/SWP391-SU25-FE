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
  const [assignedCoach, setAssignedCoach] = useState<any>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState("");

  const handleOpen = () => {
    setOpen(true);
    fetchAssignedCoach();
  };
  
  const handleClose = () => {
    setOpen(false);
    setRating(null);
    setComment("");
    setSuccess(false);
    setError("");
    setAssignedCoach(null);
    setCoachError("");
  };

  const fetchAssignedCoach = async () => {
    setCoachLoading(true);
    setCoachError("");
    try {
      const token = localStorage.getItem("token");
      const memberId = localStorage.getItem("memberId");
      
      if (!memberId) {
        setCoachError("Member ID not found. Please log in again.");
        return;
      }

      const res = await axios.get(`${API_BASE}/member/${memberId}/coach`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data && res.data.id) {
        setAssignedCoach(res.data);
      } else {
        setCoachError("No coach assigned to you yet.");
      }
    } catch (e: any) {
      console.error("Error fetching assigned coach:", e);
      if (e.response?.status === 404) {
        setCoachError("No coach assigned to you yet.");
      } else {
        setCoachError("Failed to load assigned coach.");
      }
    } finally {
      setCoachLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please select a rating.");
      return;
    }

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
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setRating(null);
      setComment("");
    } catch (e: any) {
      console.error("Error submitting rating:", e);
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
            
            {coachLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={3}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 1 }}>Loading coach information...</Typography>
              </Box>
            ) : coachError ? (
              <Box sx={{ p: 2, bgcolor: "#ffebee", borderRadius: 1, mb: 2 }}>
                <Typography color="error" fontSize={14}>
                  {coachError}
                </Typography>
              </Box>
            ) : assignedCoach ? (
              <>
                <Box sx={{ p: 2, bgcolor: "#e8f5e8", borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="#2e7d32">
                    Your Assigned Coach:
                  </Typography>
                  <Typography variant="body2" color="#2e7d32">
                    {assignedCoach.name || assignedCoach.fullName || "Coach"}
                  </Typography>
                </Box>
                
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
                  disabled={loading || !rating}
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </>
            ) : (
              <Box sx={{ p: 2, bgcolor: "#fff3cd", borderRadius: 1 }}>
                <Typography color="#856404" fontSize={14}>
                  No coach information available.
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
