import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import axios from "axios";
import { DailyProgress, MemberShortDTO, WeeklyProgressStats } from "./models/type";
import MemberCard from "./CoachComponents/MemberCard";
import WeeklyProgressCard from "./CoachComponents/WeeklyProgressCard";
import DailyProgressCard from "./CoachComponents/DailyProgressCard";

const API_BASE = "http://localhost:8082/api";

export default function CoachTracking() {
  const [members, setMembers] = useState<MemberShortDTO[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberShortDTO | null>(null);
  const [memberProgress, setMemberProgress] = useState<WeeklyProgressStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMember, setLoadingMember] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedWeekStats, setSelectedWeekStats] = useState<WeeklyProgressStats | null>(null);
  const [coachId, setCoachId] = useState<string | null>(null);

  // New state for adjusting the plan
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [newTarget, setNewTarget] = useState<number | ''>('');
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);

  useEffect(() => {
    const coachIdFromStorage = localStorage.getItem("coachId");
    if (!coachIdFromStorage) {
      console.error("Coach ID not found in localStorage");
      return;
    }
    setCoachId(coachIdFromStorage);
    fetchMembers(coachIdFromStorage);
  }, []);

  const fetchMembers = async (coachId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/coach/${coachId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberProgress = async (memberId: number) => {
    if (!coachId) return;

    try {
      setLoadingMember(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/coach/${coachId}/members/${memberId}/progress/all-weeks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedProgress = await updateProgressStatus(res.data, memberId);
      setMemberProgress(updatedProgress);
    } catch (error) {
      console.error("Failed to fetch member progress:", error);
    } finally {
      setLoadingMember(false);
    }
  };

  const updateProgressStatus = async (progressData: WeeklyProgressStats[], memberId: number) => {
    try {
      const token = localStorage.getItem("token");
      const now = new Date();
      const todayString = now.toLocaleDateString('en-CA'); // YYYY-MM-DD FORMAT FOR DATE

      const todayRecordRes = await axios.get(`${API_BASE}/smoking-records/date/${todayString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todayRecord = todayRecordRes.data;

      const updatedProgress = progressData.map(week => {
        const weekStart = new Date(week.weekStartDate);
        const weekEnd = new Date(week.weekEndDate);
        const today = new Date();

        if (today >= weekStart && today <= weekEnd) {
          const updatedDailyProgress = week.dailyProgress.map(day => {
            if (day.date === todayString) {
              const actualSmoked = todayRecord?.cigarettesSmoked || 0;
              const target = day.targetCigarettes;

              let newStatus: "OVER" | "ON_TARGET" | "UNDER" | "NO_RECORD";
              if (actualSmoked === 0) {
                newStatus = "NO_RECORD";
              } else if (actualSmoked > target) {
                newStatus = "OVER";
              } else if (actualSmoked === target) {
                newStatus = "ON_TARGET";
              } else {
                newStatus = "UNDER";
              }

              return {
                ...day,
                cigarettesSmoked: actualSmoked,
                status: newStatus
              };
            }
            return day;
          });

          const updatedStats = calculateWeekStats(updatedDailyProgress, week.targetCigarettesPerDay);

          return {
            ...week,
            dailyProgress: updatedDailyProgress,
            ...updatedStats
          };
        }
        return week;
      });

      return updatedProgress;
    } catch (error) {
      console.error("Failed to update progress status:", error);
      return progressData;
    }
  };

  const calculateWeekStats = (dailyProgress: DailyProgress[], targetPerDay: number) => {
    let daysOverTarget = 0;
    let daysOnTarget = 0;
    let daysUnderTarget = 0;
    let totalSmoked = 0;

    dailyProgress.forEach(day => {
      totalSmoked += day.cigarettesSmoked;
      switch (day.status) {
        case "OVER":
          daysOverTarget++;
          break;
        case "ON_TARGET":
          daysOnTarget++;
          break;
        case "UNDER":
          daysUnderTarget++;
          break;
        default:
          break;
      }
    });

    const totalTarget = dailyProgress.length * targetPerDay;
    const reduction = Math.max(0, totalTarget - totalSmoked);

    return {
      totalCigarettesSmoked: totalSmoked,
      cigarettesReduction: reduction,
      daysOverTarget,
      daysOnTarget,
      daysUnderTarget
    };
  };

  const handleViewDetails = async (member: MemberShortDTO) => {
    setSelectedMember(member);
    await fetchMemberProgress(member.memberId);
    setDetailDialogOpen(true);
  };

  const handleViewWeekDetails = (weekStats: WeeklyProgressStats) => {
    setSelectedWeekStats(weekStats);
  };
  
  const handleAdjustPlan = () => {
      setAdjustDialogOpen(true);
      setNewTarget('');
      setAdjustmentError(null);
  };

  const handleConfirmAdjustment = async () => {
      if (!coachId || !selectedMember || newTarget === '' || newTarget < 0) {
          setAdjustmentError("Mục tiêu mới không hợp lệ.");
          return;
      }

      setAdjustmentLoading(true);
      setAdjustmentError(null);

      try {
          const token = localStorage.getItem("token");
          const payload = { newTargetCigarettes: newTarget };
          const apiUrl = `${API_BASE}/coach/${coachId}/members/${selectedMember.memberId}/plan/next-week`;

          await axios.patch(apiUrl, payload, {
              headers: { Authorization: `Bearer ${token}` },
          });

          // Refresh the member's progress after a successful update
          await fetchMemberProgress(selectedMember.memberId);

          setAdjustDialogOpen(false);
          alert("Kế hoạch đã được điều chỉnh thành công.");
      } catch (error: any) {
          console.error("Failed to adjust plan:", error);
          const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi điều chỉnh kế hoạch.";
          setAdjustmentError(errorMessage);
      } finally {
          setAdjustmentLoading(false);
      }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "success";
    if (progress >= 60) return "warning";
    return "error";
  };

  const calculateOverallProgress = (progress: WeeklyProgressStats[]) => {
    if (progress.length === 0) return 0;
    const totalWeeks = progress.length;
    const completedWeeks = progress.filter(week =>
      week.daysUnderTarget + week.daysOnTarget >= 4
    ).length;
    return (completedWeeks / totalWeeks) * 100;
  };

  const handleManualRefresh = async () => {
    if (coachId) {
      await fetchMembers(coachId);
      if (selectedMember) {
        await fetchMemberProgress(selectedMember.memberId);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#c2410c", fontWeight: "bold" }}>
          Theo dõi tiến độ thành viên
        </Typography>
        <Button
          variant="outlined"
          onClick={handleManualRefresh}
          sx={{ color: "#c2410c", borderColor: "#c2410c" }}
        >
          Làm mới dữ liệu
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {members.map((member) => (
          <Box key={member.memberId} sx={{ width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.33% - 16px)' } }}>
            <MemberCard member={member} onViewDetails={handleViewDetails} />
          </Box>
        ))}
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Chi tiết tiến độ - {selectedMember?.fullName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {loadingMember ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {memberProgress.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" mb={2}>Tổng quan</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateOverallProgress(memberProgress)}
                    color={getProgressColor(calculateOverallProgress(memberProgress)) as any}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2" mt={1}>
                    Tiến độ tổng thể: {Math.round(calculateOverallProgress(memberProgress))}%
                  </Typography>
                </Box>
              )}
              {/* Button to open the adjustment dialog */}
              <Box mb={3}>
                  <Button variant="contained" onClick={handleAdjustPlan}>Điều chỉnh kế hoạch tuần sau</Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {memberProgress.map((week) => (
                  <Box key={week.weekNumber} sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
                    <WeeklyProgressCard week={week} onViewWeekDetails={handleViewWeekDetails} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Week Details Dialog */}
      <DailyProgressCard
        selectedWeekStats={selectedWeekStats}
        selectedMember={selectedMember}
        onClose={() => setSelectedWeekStats(null)}
      />

      {/* New Dialog for Adjusting Plan */}
      <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)}>
          <DialogTitle>Điều chỉnh mục tiêu tuần tiếp theo</DialogTitle>
          <DialogContent>
              <Typography variant="body1" sx={{mb: 2}}>
                  Bạn đang điều chỉnh mục tiêu cai thuốc cho tuần tiếp theo của thành viên {selectedMember?.fullName}.
              </Typography>
              <TextField
                  autoFocus
                  margin="dense"
                  id="newTarget"
                  label="Số điếu thuốc mục tiêu mỗi ngày"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
              />
              {adjustmentError && (
                  <Alert severity="error" sx={{mt: 2}}>{adjustmentError}</Alert>
              )}
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setAdjustDialogOpen(false)} color="secondary">Hủy</Button>
              <Button onClick={handleConfirmAdjustment} disabled={adjustmentLoading} color="primary">
                  {adjustmentLoading ? <CircularProgress size={24} /> : 'Xác nhận'}
              </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
}