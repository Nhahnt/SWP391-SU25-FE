import * as React from "react";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import axios from "axios";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AppBarChart } from "../../components/shared/AppBarChart";
import Card from "../../components/shared/Card";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Tab,
} from "@mui/material";
import { TodayReportCard } from "./Components/TodayReport";
import { CurrentStreakCard } from "./Components/CurrentStreak";
import { EncouragementCard } from "./Components/Encouragement";
import { WeeklyTargetCard } from "./Components/WeeklyTarget";
import { WeeklyChartTabs } from "./Components/WeeklyChart";

type DailyProgress = {
  date: string;
  cigarettesSmoked: number;
  targetCigarettes: number;
  status: "OVER" | "UNDER" | "ON_TARGET" | "NO_RECORD";
};

type WeeklyReport = {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  targetCigarettesPerDay: number;
  totalCigarettesSmoked: number;
  previousWeeklyTotal: number;
  daysOverTarget: number;
  daysOnTarget: number;
  daysUnderTarget: number;
  cigarettesReduction: number;
  dailyProgress: DailyProgress[];
};

const reportData: WeeklyReport[] = [
  {
    weekNumber: 1,
    weekStartDate: "2025-06-16",
    weekEndDate: "2025-06-22",
    targetCigarettesPerDay: 18,
    totalCigarettesSmoked: 118,
    previousWeeklyTotal: 0,
    daysOverTarget: 2,
    daysOnTarget: 2,
    daysUnderTarget: 3,
    cigarettesReduction: 8,
    dailyProgress: [
      {
        date: "2025-06-16",
        cigarettesSmoked: 19,
        targetCigarettes: 18,
        status: "OVER",
      },
      {
        date: "2025-06-17",
        cigarettesSmoked: 18,
        targetCigarettes: 18,
        status: "ON_TARGET",
      },
      {
        date: "2025-06-18",
        cigarettesSmoked: 17,
        targetCigarettes: 18,
        status: "UNDER",
      },
      {
        date: "2025-06-19",
        cigarettesSmoked: 15,
        targetCigarettes: 18,
        status: "UNDER",
      },
      {
        date: "2025-06-20",
        cigarettesSmoked: 18,
        targetCigarettes: 18,
        status: "ON_TARGET",
      },
      {
        date: "2025-06-21",
        cigarettesSmoked: 14,
        targetCigarettes: 18,
        status: "UNDER",
      },
      {
        date: "2025-06-22",
        cigarettesSmoked: 17,
        targetCigarettes: 18,
        status: "OVER",
      },
    ],
  },
  {
    weekNumber: 2,
    weekStartDate: "2025-06-23",
    weekEndDate: "2025-06-29",
    targetCigarettesPerDay: 16,
    totalCigarettesSmoked: 106,
    previousWeeklyTotal: 118,
    daysOverTarget: 1,
    daysOnTarget: 1,
    daysUnderTarget: 5,
    cigarettesReduction: 12,
    dailyProgress: [
      {
        date: "2025-06-23",
        cigarettesSmoked: 15,
        targetCigarettes: 16,
        status: "UNDER",
      },
      {
        date: "2025-06-24",
        cigarettesSmoked: 14,
        targetCigarettes: 16,
        status: "UNDER",
      },
      {
        date: "2025-06-25",
        cigarettesSmoked: 18,
        targetCigarettes: 16,
        status: "OVER",
      },
      {
        date: "2025-06-26",
        cigarettesSmoked: 16,
        targetCigarettes: 16,
        status: "ON_TARGET",
      },
      {
        date: "2025-06-27",
        cigarettesSmoked: 13,
        targetCigarettes: 16,
        status: "UNDER",
      },
      {
        date: "2025-06-28",
        cigarettesSmoked: 15,
        targetCigarettes: 16,
        status: "UNDER",
      },
      {
        date: "2025-06-29",
        cigarettesSmoked: 15,
        targetCigarettes: 16,
        status: "UNDER",
      },
    ],
  },
  {
    weekNumber: 3,
    weekStartDate: "2025-06-30",
    weekEndDate: "2025-07-06",
    targetCigarettesPerDay: 14,
    totalCigarettesSmoked: 84,
    previousWeeklyTotal: 106,
    daysOverTarget: 0,
    daysOnTarget: 2,
    daysUnderTarget: 5,
    cigarettesReduction: 22,
    dailyProgress: [
      {
        date: "2025-06-30",
        cigarettesSmoked: 14,
        targetCigarettes: 14,
        status: "ON_TARGET",
      },
      {
        date: "2025-07-01",
        cigarettesSmoked: 13,
        targetCigarettes: 14,
        status: "UNDER",
      },
      {
        date: "2025-07-02",
        cigarettesSmoked: 12,
        targetCigarettes: 14,
        status: "UNDER",
      },
      {
        date: "2025-07-03",
        cigarettesSmoked: 14,
        targetCigarettes: 14,
        status: "ON_TARGET",
      },
      {
        date: "2025-07-04",
        cigarettesSmoked: 12,
        targetCigarettes: 14,
        status: "UNDER",
      },
      {
        date: "2025-07-05",
        cigarettesSmoked: 14,
        targetCigarettes: 14,
        status: "ON_TARGET",
      },
      {
        date: "2025-07-06",
        cigarettesSmoked: 15,
        targetCigarettes: 14,
        status: "OVER",
      },
    ],
  },
  {
    weekNumber: 4,
    weekStartDate: "2025-07-07",
    weekEndDate: "2025-07-13",
    targetCigarettesPerDay: 12,
    totalCigarettesSmoked: 55,
    previousWeeklyTotal: 84,
    daysOverTarget: 0,
    daysOnTarget: 1,
    daysUnderTarget: 4,
    cigarettesReduction: 29,
    dailyProgress: [
      {
        date: "2025-07-07",
        cigarettesSmoked: 11,
        targetCigarettes: 12,
        status: "UNDER",
      },
      {
        date: "2025-07-08",
        cigarettesSmoked: 12,
        targetCigarettes: 12,
        status: "ON_TARGET",
      },
      {
        date: "2025-07-09",
        cigarettesSmoked: 10,
        targetCigarettes: 12,
        status: "UNDER",
      },
      {
        date: "2025-07-10",
        cigarettesSmoked: 11,
        targetCigarettes: 12,
        status: "UNDER",
      },
      {
        date: "2025-07-11",
        cigarettesSmoked: 11,
        targetCigarettes: 12,
        status: "UNDER",
      },
      {
        date: "2025-07-12",
        cigarettesSmoked: 0,
        targetCigarettes: 12,
        status: "NO_RECORD",
      },
      {
        date: "2025-07-13",
        cigarettesSmoked: 0,
        targetCigarettes: 12,
        status: "NO_RECORD",
      },
    ],
  },
];

export function ProgressTracking() {
  const [value, setValue] = React.useState("1");
  const [todayReport, setTodayReport] = React.useState<DailyProgress | null>(
    null
  );
  const [inputCount, setInputCount] = React.useState<number | "">("");
  const [reportData, setReportData] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const getTodayString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8082/api/smoking-records/progress/all-weeks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  const calculateCurrentStreak = (): number => {
    const allDays: DailyProgress[] = reportData
      .flatMap((week) => week.dailyProgress)
      .filter((d) => d.status !== "NO_RECORD")
      .sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    for (const d of allDays) {
      if (d.status === "UNDER" || d.status === "ON_TARGET") {
        streak++;
      } else {
        break;
      }
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
        {
          date,
          cigarettesSmoked: count,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Gọi lại API để cập nhật lại biểu đồ sau khi báo cáo thành công
      const res = await axios.get(
        "http://localhost:8082/api/smoking-records/progress/all-weeks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  return (
    <div className="w-[70%] mx-auto py-4 space-y-4">
      <Typography variant="h4" sx={{ color: "#c2410c", fontWeight: "bold" }}>
        Progress Tracking
      </Typography>

      <div className="flex gap-4">
        {/* Self Report */}
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

        {/* Streak */}
        <CurrentStreakCard streak={calculateCurrentStreak()} />

        {/* Encouragement */}

        <EncouragementCard
          message={getEncouragementMessage(calculateCurrentStreak())}
        />
      </div>

      {/* Bar Chart + Weekly Target */}
      <div className="flex gap-4 w-full">
        <WeeklyChartTabs data={reportData} />
        {/* Weekly Target Progress */}
        <WeeklyTargetCard targets={weeklyTargets} />
      </div>

      {/* Stats Table */}
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
