import React, { useState, useRef } from "react";
import { Box, Modal, Typography, IconButton, Fade, Backdrop, ToggleButton, Divider, Popover, Button } from "@mui/material";

// Busyness options
const busynessOptions = [
  { value: "free", label: "Free" },
  { value: "spare", label: "Some time" },
  { value: "busy", label: "No time" },
];

// Mood options (text and emoji on separate lines)
const moodOptions = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "stressed", label: "Stressed", emoji: "😣" },
  { value: "angry", label: "Angry", emoji: "😠" },
];

// Hardcoded suggestions based on busyness and mood
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

// Floating chat icon style
const style = {
  position: "fixed" as const,
  bottom: 32,
  right: 32,
  zIndex: 1300,
};

// Modal container: horizontal flex for side-by-side layout
const modalStyle = {
  position: "absolute" as const,
  bottom: 100,
  right: 32,
  width: 600,
  minHeight: 320,
  bgcolor: "#fff7ed",
  borderRadius: 4,
  boxShadow: 24,
  p: 0,
  outline: "none",
  border: "2px solid #c2410c",
  display: "flex",
  flexDirection: "row" as const,
  overflow: "hidden",
};

// Left panel: options
const leftPanelStyle = {
  flex: 1.2,
  p: 4,
  display: "flex",
  flexDirection: "column" as const,
  gap: 2,
  minWidth: 0,
};

// Right panel: suggestion (set minWidth to prevent overlap)
const rightPanelStyle = {
  flex: 1,
  minWidth: 220,
  maxWidth: 300,
  bgcolor: "#fff",
  borderLeft: "2px solid #c2410c",
  p: 3,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start" as const,
  justifyContent: "flex-start" as const,
  minHeight: 0,
};

// Option grid for busyness and mood
const optionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 1.5,
  mb: 2,
};

// Toggle button style for mood (text and emoji stacked)
const toggleButtonSx = {
  fontWeight: 600,
  fontSize: 16,
  color: "#c2410c",
  borderRadius: 2,
  border: "1.5px solid #c2410c",
  background: "#fff",
  transition: "all 0.2s",
  whiteSpace: "normal" as const,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  gap: 0.5,
  minHeight: 56,
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Open/close modal handlers
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
    setBusyness(null);
    setMood(null);
    setPopoverOpen(false);
  };

  // Show suggestion popover when both selected
  React.useEffect(() => {
    if (busyness && mood) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  }, [busyness, mood]);

  const suggestion = busyness && mood ? suggestions[busyness][mood] : "";

  return (
    <Box sx={style}>
      {/* Floating chat icon */}
      <IconButton
        color="primary"
        size="large"
        onClick={handleOpen}
        sx={{ background: "#fff7ed", boxShadow: 3, border: "2px solid #c2410c" }}
        aria-label="Open mood tracker"
      >
        <span style={{ fontSize: 28, color: '#c2410c' }}>💬</span>
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 200 } }}
      >
        <Fade in={open}>
          {/* Modal: only options panel */}
          <Box sx={{ ...modalStyle, flexDirection: 'column', width: 400, minHeight: 320 }}>
            {/* Header and close button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2}>
              <Typography variant="h6" fontWeight="bold" color="#c2410c">Mood Tracker</Typography>
              <IconButton size="small" onClick={handleClose} sx={{ color: '#c2410c' }}>
                <span style={{ fontSize: 20 }}>✖️</span>
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#c2410c', opacity: 0.3 }} />
            {/* Busyness options */}
            <Box sx={{ px: 4 }}>
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
              {/* Mood options (text and emoji stacked) */}
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
                    {/* Mood label and emoji on separate lines, centered */}
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
                      <span>{opt.label}</span>
                      <span style={{ fontSize: 24 }}>{opt.emoji}</span>
                    </span>
                  </ToggleButton>
                ))}
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* Suggestion Popover */}
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={() => setPopoverOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ pointerEvents: 'auto' }}
        disableRestoreFocus
        PaperProps={{ sx: { p: 2, minWidth: 260, bgcolor: '#fff7ed', border: '2px solid #c2410c', borderRadius: 2 } }}
      >
        <Typography variant="body1" fontWeight="bold" color="#c2410c" mb={1}>
          Suggestion
        </Typography>
        <Divider sx={{ mb: 1, borderColor: '#c2410c', opacity: 0.2 }} />
        <Typography
          variant="body2"
          color="#222"
          sx={{ wordBreak: 'break-word', minHeight: 40, maxHeight: 200, overflowY: 'auto' }}
        >
          {suggestion}
        </Typography>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button size="small" onClick={() => setPopoverOpen(false)} sx={{ color: '#c2410c' }}>Close</Button>
        </Box>
      </Popover>
    </Box>
  );
}
