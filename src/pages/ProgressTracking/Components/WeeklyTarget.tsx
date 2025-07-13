// components/progress/WeeklyTargetCard.tsx
import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import Card from "../../../components/shared/Card";

interface WeeklyTarget {
  id: number;
  label: string;
  current: number;
  goal: number;
}

interface Props {
  targets: WeeklyTarget[];
}

export const WeeklyTargetCard = ({ targets }: Props) => {
  return (
    <Card className="flex-[2]">
      <Box className="p-4 space-y-4">
        <Typography variant="h6" sx={{ color: "#c2410c" }}>
          Weekly Targets
        </Typography>
        {targets.map((ms) => {
          const percent = Math.min((ms.current / ms.goal) * 100, 100);
          const achieved = percent <= 100;
          return (
            <Box key={ms.id} className="space-y-1">
              <Typography fontWeight="bold">
                {ms.label}: {ms.current} / {ms.goal}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#f3f3f3",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: achieved ? "#16a34a" : "#f87171",
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};
