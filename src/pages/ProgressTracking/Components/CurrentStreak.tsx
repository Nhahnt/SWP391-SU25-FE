// components/progress/CurrentStreakCard.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "../../../components/shared/Card";

interface Props {
  streak: number;
}

export const CurrentStreakCard = ({ streak }: Props) => {
  return (
    <Card className="flex-1">
      <Box className="p-4 text-center space-y-2">
        <Typography variant="h6" sx={{ color: "#c2410c" }}>
          Current Streak
        </Typography>
        <Typography variant="h4" sx={{ color: "#16a34a" }}>
          {streak} days
        </Typography>
        <Typography variant="body2">
          of smoking below or equal to your daily target
        </Typography>
      </Box>
    </Card>
  );
};
