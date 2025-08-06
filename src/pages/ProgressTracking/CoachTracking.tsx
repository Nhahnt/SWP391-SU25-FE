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

      // Get today's date in the correct timezone and format
      const now = new Date();

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      let todayString = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      let yesterdayString = yesterday.toLocaleDateString('en-CA'); // YYYY-MM-DD format

      console.log('Sending today date to API:', todayString);
      console.log('Sending yesterday date to API:', yesterdayString);
      console.log('Current local time:', now.toLocaleString());
      console.log('ISO string:', now.toISOString());

      let todayRecordRes;
      try {
        todayRecordRes = await axios.get(`${API_BASE}/smoking-records/date/${todayString}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Success with today date:', todayString);
      } catch (dateError) {
        console.log('Today date failed, trying yesterday...');
        try {
          todayRecordRes = await axios.get(`${API_BASE}/smoking-records/date/${yesterdayString}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Success with yesterday date:', yesterdayString);
        } catch (yesterdayError) {
          console.log('Yesterday date also failed, trying alternative format...');
          const alternativeDate = now.toLocaleDateString('en-GB').split('/').reverse().join('-');
          console.log('Trying alternative date format:', alternativeDate);

          todayRecordRes = await axios.get(`${API_BASE}/smoking-records/date/${alternativeDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      console.log('API response:', todayRecordRes.data);

      const todayRecord = todayRecordRes.data;

      const updatedProgress = progressData.map(week => {
        const weekStart = new Date(week.weekStartDate);
        const weekEnd = new Date(week.weekEndDate);
        const today = new Date();

        // Check if this week includes today
        if (today >= weekStart && today <= weekEnd) {
          const updatedDailyProgress = week.dailyProgress.map(day => {
            if (day.date === todayString) {
              // Update today's status based on actual smoking record
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
          // NO_RECORD doesn't count towards any category
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
    </Box>
  );
}