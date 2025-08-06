import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import { WeeklyProgressStats } from "../models/type";

interface WeeklyProgressCardProps {
  week: WeeklyProgressStats;
  onViewWeekDetails: (weekStats: WeeklyProgressStats) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function WeeklyProgressCard({
  week,
  onViewWeekDetails,
}: WeeklyProgressCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Tuần {week.weekNumber}</Typography>
          <Chip
            label={`${week.daysUnderTarget + week.daysOnTarget}/7 ngày tốt`}
            color={week.daysOverTarget > 3 ? "error" : "success"}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {formatDate(week.weekStartDate)} - {formatDate(week.weekEndDate)}
        </Typography>

        <Box mb={2}>
          <Typography variant="body2" mb={1}>
            Mục tiêu: {week.targetCigarettesPerDay} điếu/ngày
          </Typography>
          <Typography variant="body2" mb={1}>
            Tổng đã hút: {week.totalCigarettesSmoked} điếu
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight="bold">
            Giảm được: {week.cigarettesReduction} điếu
          </Typography>
        </Box>

        <Box display="flex" gap={1} mb={2}>
          <Chip label={`${week.daysUnderTarget} dưới`} color="success" size="small" />
          <Chip label={`${week.daysOnTarget} đúng`} color="primary" size="small" />
          <Chip label={`${week.daysOverTarget} vượt`} color="error" size="small" />
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={() => onViewWeekDetails(week)}
          fullWidth
        >
          Xem chi tiết ngày
        </Button>
      </CardContent>
    </Card>
  );
}