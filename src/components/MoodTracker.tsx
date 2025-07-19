import React, { useState } from "react";
import { Box, Modal, Typography, IconButton, Fade, Backdrop, ToggleButton, ToggleButtonGroup, Divider } from "@mui/material";

const busynessOptions = [
  { value: "free", label: "Free" },
  { value: "spare", label: "Some time" },
  { value: "busy", label: "No time" },
];

const moodOptions = [
  { value: "happy", label: "Happy 😊" },
  { value: "neutral", label: "Neutral 😐" },
  { value: "sad", label: "Sad 😢" },
  { value: "stressed", label: "Stressed 😣" },
  { value: "angry", label: "Angry 😠" },
];

const suggestions: Record<string, Record<string, string>> = {
  free: {
    happy: "Go for a walk or do something you enjoy! Celebrate your progress.",
    neutral: "Try a new hobby or call a friend for a chat.",
    sad: "Watch a favorite movie or talk to someone you trust.",
    stressed: "Practice deep breathing or do a short workout.",
    angry: "Try journaling or listen to calming music.",
  },
  spare: {
    happy: "Take a short break and treat yourself to something healthy.",
    neutral: "Stretch or do a quick mindfulness exercise.",
    sad: "Send a message to a friend or listen to uplifting music.",
    stressed: "Step outside for fresh air or do a 5-minute meditation.",
    angry: "Take a few deep breaths and count to ten before acting.",
  },
  busy: {
    happy: "Smile and keep up the good work! Stay focused.",
    neutral: "Take a few deep breaths and refocus on your task.",
    sad: "Remind yourself why you want to quit. You’re doing great!",
    stressed: "Pause for a moment, stretch, and drink some water.",
    angry: "Try to relax your muscles and let go of tension.",
  },
};

const style = {
  position: "fixed" as const,
  right: 32,
  bottom: 32,
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

const optionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 1.5,
  mb: 2,
};

const toggleButtonSx = {
  fontWeight: 600,
  fontSize: 16,
  color: "#c2410c",
  borderRadius: 2,
  border: "1.5px solid #c2410c",
  background: "#fff",
  transition: "all 0.2s",
  '&.Mui-selected': {
    background: "#c2410c",
    color: "#fff",
    borderColor: "#c2410c",
  },
  '&:hover': {
    background: "#ffe3d3",
    borderColor: "#c2410c",
  },
};

export default function MoodTracker() {
  const [open, setOpen] = useState(false);
  const [busyness, setBusyness] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setBusyness(null);
    setMood(null);
  };

  const handleBusyness = (_: any, newValue: string | null) => setBusyness(newValue);
  const handleMood = (_: any, newValue: string | null) => setMood(newValue);

  const showSuggestion = busyness && mood;
  const suggestion = showSuggestion ? suggestions[busyness][mood] : "";

  return (
    <Box sx={style}>
      <IconButton
        color="primary"
        size="medium"
        onClick={handleOpen}
        sx={{ background: "#fff7ed", boxShadow: 3, border: "2px solid #c2410c", width: 32, height: 32, p: 0 }}
        aria-label="Open mood tracker"
      >
        <span style={{ fontSize: 14, color: '#c2410c' }}>💬</span>
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold" color="#c2410c">Mood Tracker</Typography>
              <IconButton size="small" onClick={handleClose} sx={{ color: '#c2410c' }}>
                <span style={{ fontSize: 20 }}>✖️</span>
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#c2410c', opacity: 0.3 }} />
            <Typography variant="subtitle1" fontWeight={600} color="#c2410c" mb={1}>How busy are you?</Typography>
            <Box sx={optionGrid}>
              {busynessOptions.map((opt) => (
                <ToggleButton
                  key={opt.value}
                  value={opt.value}
                  selected={busyness === opt.value}
                  onChange={() => setBusyness(opt.value)}
                  sx={toggleButtonSx}
                >
                  {opt.label}
                </ToggleButton>
              ))}
            </Box>
            <Typography variant="subtitle1" fontWeight={600} color="#c2410c" mb={1}>How do you feel?</Typography>
            <Box sx={optionGrid}>
              {moodOptions.map((opt) => (
                <ToggleButton
                  key={opt.value}
                  value={opt.value}
                  selected={mood === opt.value}
                  onChange={() => setMood(opt.value)}
                  sx={toggleButtonSx}
                >
                  {opt.label}
                </ToggleButton>
              ))}
            </Box>
            {showSuggestion && (
              <Box mt={2} p={2} bgcolor="#fff" borderRadius={2} border="1.5px solid #c2410c" minHeight={70}>
                <Typography variant="body1" fontWeight="bold" color="#c2410c" mb={0.5}>Suggestion:</Typography>
                <Typography variant="body2" color="#222" sx={{ wordBreak: 'break-word' }}>{suggestion}</Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
