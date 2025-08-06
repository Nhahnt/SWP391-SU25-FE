import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
} from "@mui/material";
import { WeeklyProgressStats, MemberShortDTO } from "../models/type";

interface DailyProgressDialogProps {
  selectedWeekStats: WeeklyProgressStats | null;
  selectedMember: MemberShortDTO | null;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "OVER": return "error";
    case "ON_TARGET": return "success";
    case "UNDER": return "info";
    default: return "default";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "OVER": return "Vượt mục tiêu";
    case "ON_TARGET": return "Đúng mục tiêu";
    case "UNDER": return "Dưới mục tiêu";
    case "NO_RECORD": return "Chưa ghi nhận";
    default: return status;
  }
};

export default function DailyProgressDialog({
  selectedWeekStats,
  selectedMember,
  onClose,
}: DailyProgressDialogProps) {
  return (
    <Dialog open={!!selectedWeekStats} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Chi tiết tuần {selectedWeekStats?.weekNumber} - {selectedMember?.fullName}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {selectedWeekStats && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell align="center">Mục tiêu</TableCell>
                  <TableCell align="center">Đã hút</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedWeekStats.dailyProgress.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell>{formatDate(day.date)}</TableCell>
                    <TableCell align="center">{day.targetCigarettes}</TableCell>
                    <TableCell align="center">{day.cigarettesSmoked}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(day.status)}
                        color={getStatusColor(day.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}