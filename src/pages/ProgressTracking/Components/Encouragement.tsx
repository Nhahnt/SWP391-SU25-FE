// components/progress/EncouragementCard.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "../../../components/shared/Card";

interface Props {
  message: string;
}

export const EncouragementCard = ({ message }: Props) => {
  return (
    <Card className="flex-1">
      <Box className="p-4 space-y-2 text-center">
        <Typography variant="h6" sx={{ color: "#c2410c" }}>
          Encouragement
        </Typography>
        <Typography>{message}</Typography>
      </Box>
    </Card>
  );
};
