// components/progress/TodayReportCard.tsx
import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import Card from "../../../components/shared/Card";
import { DailyProgress } from "../models/type";

interface Props {
  inputCount: number | "";
  onChange: (val: number | "") => void;
  onSubmit: () => void;
  todayReport: DailyProgress | null;
}

export const TodayReportCard = ({
  inputCount,
  onChange,
  onSubmit,
  todayReport,
}: Props) => {
  return (
    <Card className="flex-1">
      <Box className="p-4 space-y-3">
        <Typography variant="h6" sx={{ color: "#c2410c" }}>
          Today's Report
        </Typography>
        <Typography variant="body2">
          How many cigarettes did you smoke today?
        </Typography>
        <TextField
          type="number"
          fullWidth
          value={inputCount}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : +e.target.value)
          }
          placeholder="Enter number..."
          size="small"
        />
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-[#c2410c] text-white rounded-md hover:bg-[#a6360a]"
        >
          Save
        </button>
        {todayReport && (
          <Typography variant="body2" color="text.secondary">
            You reported smoking <strong>{todayReport.cigarettesSmoked}</strong>{" "}
            on <strong>{todayReport.date}</strong>.
          </Typography>
        )}
      </Box>
    </Card>
  );
};
