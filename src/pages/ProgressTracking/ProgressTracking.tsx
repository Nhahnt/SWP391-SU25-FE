import { useEffect, useState } from "react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import { TodayReportCard } from "./Components/TodayReport";
import { CurrentStreakCard } from "./Components/CurrentStreak";
import { EncouragementCard } from "./Components/Encouragement";
import { WeeklyTargetCard } from "./Components/WeeklyTarget";
import { WeeklyChartTabs } from "./Components/WeeklyChart";
import { DailyProgress, WeeklyReport } from "./models/type";
import Card from "../../components/shared/Card";
import { report } from "process";

const getTodayString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const API_BASE = "http://localhost:8082/api";

export function ProgressTracking() {
  const [todayReport, setTodayReport] = useState<DailyProgress | null>(null);
  const [inputCount, setInputCount] = useState<number | "">("");
  const [reportData, setReportData] = useState<WeeklyReport[]>([]);
  const [reportDate, setReportDate] = useState(getTodayString());
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const [moneySaved, setMoneySaved] = useState<number | null>(null);
  const [totalMoneySaved, setTotalMoneySaved] = useState<number | null>(null);
  const [dailyMessage, setDailyMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.get(`${API_BASE}/plans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasPlan(true);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setHasPlan(false);
        }
      }
    };
    checkPlan();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE}/smoking-records/progress/all-weeks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReportData(res.data);
      } catch (err) {
        console.error("Error fetching progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const calculateCurrentStreak = (): number => {
    const allDays: DailyProgress[] = reportData
      .flatMap((week) => week.dailyProgress)
      .filter((d) => d.status !== "NO_RECORD")
      .sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    for (const d of allDays) {
      if (d.status === "UNDER" || d.status === "ON_TARGET") streak++;
      else break;
    }
    return streak;
  };

  const getEncouragementMessage = (streak: number): string => {
    if (streak >= 14)
      return "You're unstoppable! Two weeks of commitment – amazing!";
    if (streak >= 7)
      return "One week strong! Keep building this healthy habit!";
    if (streak >= 3)
      return "You're on the right track! Stay focused and keep going!";
    if (streak > 0) return "Great start! Every day matters – you've got this!";
    return "Don't worry! Every day is a chance to begin again.";
  };

  const getStatsFromWeek = (week: WeeklyReport) => {
    const validDays = week.dailyProgress.filter(
      (d) => d.status !== "NO_RECORD"
    );
    const Total = validDays.reduce((sum, d) => sum + d.cigarettesSmoked, 0);
    const Avg = Total / validDays.length;
    const Over = validDays.filter((d) => d.status === "OVER").length;
    const Below = validDays.filter((d) => d.status === "UNDER").length;
    const Target = week.targetCigarettesPerDay;

    return {
      Total,
      Avg: Avg.toFixed(1),
      Over,
      Below,
      Target,
    };
  };

  const weeklyTargets = reportData.map((week) => {
    const current = week.totalCigarettesSmoked;
    const goal = week.targetCigarettesPerDay * 7;
    return {
      id: week.weekNumber,
      label: `Week ${week.weekNumber}`,
      current,
      goal,
    };
  });

  const submitTodayReport = async (count: number, date: string) => {
    const target = 12;
    console.log(reportData);
    let status: DailyProgress["status"];
    if (count > target) status = "OVER";
    else if (count === target) status = "ON_TARGET";
    else status = "UNDER";

    const message =
      status === "OVER"
        ? "Bạn đã hút vượt quá mục tiêu của ngày hôm nay!"
        : status === "ON_TARGET"
        ? "Bạn đã đạt đúng mục tiêu hôm nay!"
        : "Tuyệt vời! Bạn hút ít hơn mục tiêu hôm nay!";

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/smoking-records/record`,
        { date, cigarettesSmoked: count, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Capture and set new state variables from the backend response
      setMoneySaved(res.data.moneySaved);
      setTotalMoneySaved(res.data.totalMoneySaved);
      setDailyMessage(res.data.message);

      const progressRes = await axios.get(
        `${API_BASE}/smoking-records/progress/all-weeks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportData(progressRes.data);

      setTodayReport({
        date,
        cigarettesSmoked: count,
        targetCigarettes: target,
        status,
      });

      setInputCount("");
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu báo cáo hôm nay:", error);
      alert("Chưa tới ngày bắt đầu kế hoạch. Không thể lưu dữ liệu.");
    }
  };

  const handleDeletePlan = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your quit plan? This action cannot be undone."
      )
    )
      return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteSuccess(true);
      setReportData([]);
      setIsRedirecting(true);
      setTimeout(() => {
        navigate("/");
      }, 3000); // Redirect to homepage after 3s
    } catch (err: any) {
      setDeleteError(err?.response?.data || "Failed to delete quit plan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <Typography
          variant="h5"
          sx={{
            color: "#c2410c",
            fontWeight: "bold",
            mb: 2,
            textAlign: "center",
          }}
        >
          Kế hoạch cai thuốc của bạn đã bị xóa thành công!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
          Đang chuyển hướng về trang chủ...
        </Typography>
        <CircularProgress sx={{ color: "#c2410c" }} />
      </div>
    );
  }

  const streak = calculateCurrentStreak();

  if (hasPlan === null || loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-64">
        <Typography
          variant="h5"
          sx={{ color: "#c2410c", fontWeight: "bold", mb: 2 }}
        >
          Bạn chưa có kế hoạch cai thuốc!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
          Hãy bắt đầu với một bài đánh giá để hiểu rõ hơn về bản thân và hành
          trình cai thuốc của bạn.
        </Typography>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            component={Link}
            to="/quiz"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#c2410c",
              "&:hover": {
                bgcolor: "#9a3412",
                transform: "translateY(-1px)",
              },
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontSize: "1.1rem",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            Bắt đầu bài đánh giá
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[70%] mx-auto py-4 space-y-4">
      <Typography variant="h4" sx={{ color: "#c2410c", fontWeight: "bold" }}>
        Progress Tracking
      </Typography>
      <div className="flex justify-end mb-2">
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeletePlan}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Delete Quit Plan"}
        </Button>
      </div>
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={4000}
        onClose={() => setDeleteSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setDeleteSuccess(false)}>
          Quit plan deleted successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!deleteError}
        autoHideDuration={4000}
        onClose={() => setDeleteError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setDeleteError("")}>
          {deleteError}
        </Alert>
      </Snackbar>

      <div className="flex gap-4">
        <TodayReportCard
          reportDate={reportDate}
          inputCount={inputCount}
          onChange={setInputCount}
          onSubmit={() => {
            if (inputCount !== "" && !isNaN(inputCount)) {
              submitTodayReport(+inputCount, reportDate);
            }
          }}
          todayReport={todayReport}
        />
        <CurrentStreakCard streak={streak} />
        <EncouragementCard message={getEncouragementMessage(streak)} />
      </div>

      {dailyMessage && (
        <Card>
          <div className="p-4 space-y-2">
            <Typography variant="body1" className="text-gray-700">
              <span className="font-semibold">Daily Message:</span>{" "}
              {dailyMessage}
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              <span className="font-semibold">Money Saved Today:</span>{" "}
              {moneySaved !== null
                ? `${moneySaved.toLocaleString()} VNĐ`
                : "N/A"}
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              <span className="font-semibold">Total Money Saved:</span>{" "}
              {totalMoneySaved !== null
                ? `${totalMoneySaved.toLocaleString()} VNĐ`
                : "N/A"}
            </Typography>
          </div>
        </Card>
      )}

      <div className="flex gap-4 w-full">
        <WeeklyChartTabs data={reportData} />
        <WeeklyTargetCard targets={weeklyTargets} />
      </div>

      <Card>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#c2410c" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Indicator</TableCell>
                {reportData.map((w) => (
                  <TableCell
                    key={w.weekNumber}
                    align="center"
                    sx={{ color: "white" }}
                  >
                    Week {w.weekNumber}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {["Total", "Avg", "Target", "Over", "Below"].map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  {reportData.map((week, i) => {
                    const stats = getStatsFromWeek(week);
                    return (
                      <TableCell key={i} align="center">
                        {stats[key as keyof typeof stats]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
