import { useEffect, useState } from "react";
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
} from "@mui/material";

import { TodayReportCard } from "./Components/TodayReport";
import { CurrentStreakCard } from "./Components/CurrentStreak";
import { EncouragementCard } from "./Components/Encouragement";
import { WeeklyTargetCard } from "./Components/WeeklyTarget";
import { WeeklyChartTabs } from "./Components/WeeklyChart";
import { DailyProgress, WeeklyReport } from "./models/type";
import Card from "../../components/shared/Card";

export function ProgressTracking() {
  const [todayReport, setTodayReport] = useState<DailyProgress | null>(null);
  const [inputCount, setInputCount] = useState<number | "">("");
  const [reportData, setReportData] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8082/api/smoking-records/progress/all-weeks",
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

  const getTodayString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

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
    const total = validDays.reduce((sum, d) => sum + d.cigarettesSmoked, 0);
    const avg = total / validDays.length;
    const over = validDays.filter((d) => d.status === "OVER").length;
    const below = validDays.filter((d) => d.status === "UNDER").length;
    const target = week.targetCigarettesPerDay;

    return {
      total,
      avg: avg.toFixed(1),
      over,
      below,
      target,
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

  const submitTodayReport = async (count: number) => {
    const date = getTodayString();
    const target = 12;

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
      await axios.post(
        "http://localhost:8082/api/smoking-records/record",
        { date, cigarettesSmoked: count, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get(
        "http://localhost:8082/api/smoking-records/progress/all-weeks",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportData(res.data);

      setTodayReport({
        date,
        cigarettesSmoked: count,
        targetCigarettes: target,
        status,
      });

      setInputCount("");
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu báo cáo hôm nay:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại.");
    }
  };

  const streak = calculateCurrentStreak();

  return (
    <div className="w-[70%] mx-auto py-4 space-y-4">
      <Typography variant="h4" sx={{ color: "#c2410c", fontWeight: "bold" }}>
        Progress Tracking
      </Typography>

      <div className="flex gap-4">
        <TodayReportCard
          inputCount={inputCount}
          onChange={setInputCount}
          onSubmit={() => {
            if (inputCount !== "" && !isNaN(inputCount)) {
              submitTodayReport(+inputCount);
            }
          }}
          todayReport={todayReport}
        />
        <CurrentStreakCard streak={streak} />
        <EncouragementCard message={getEncouragementMessage(streak)} />
      </div>

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
              {["total", "avg", "target", "over", "below"].map((key) => (
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
