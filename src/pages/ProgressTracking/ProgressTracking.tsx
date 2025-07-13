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
  const getTodayString = () => new Date().toISOString().split("T")[0];

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

  return (
    <div className="w-[70%] mx-auto py-4 space-y-4">
      <Typography variant="h4" sx={{ color: "#c2410c", fontWeight: "bold" }}>
        Progress Tracking
      </Typography>

      <div className="flex gap-4">
        {/* Self Report */}
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
                setInputCount(e.target.value === "" ? "" : +e.target.value)
              }
              placeholder="Enter number..."
              size="small"
            />
            <button
              onClick={() => {
                if (inputCount !== "" && !isNaN(inputCount)) {
                  setTodayReport({
                    date: getTodayString(),
                    cigarettesSmoked: +inputCount,
                    targetCigarettes: 12,
                    status: "UNDER",
                  });
                  setInputCount("");
                }
              }}
              className="px-4 py-2 bg-[#c2410c] text-white rounded-md hover:bg-[#a6360a]"
            >
              Save
            </button>
            {todayReport && (
              <Typography variant="body2" color="text.secondary">
                You reported smoking{" "}
                <strong>{todayReport.cigarettesSmoked}</strong> on{" "}
                <strong>{todayReport.date}</strong>.
              </Typography>
            )}
          </Box>
        </Card>

        {/* Streak */}
        <Card className="flex-1">
          <Box className="p-4 text-center space-y-2">
            <Typography variant="h6" sx={{ color: "#c2410c" }}>
              Current Streak
            </Typography>
            <Typography variant="h4" sx={{ color: "#16a34a" }}>
              {calculateCurrentStreak()} days
            </Typography>
            <Typography variant="body2">
              of smoking below or equal to your daily target
            </Typography>
          </Box>
        </Card>

        {/* Encouragement */}
        <Card className="flex-1">
          <Box className="p-4 space-y-2 text-center">
            <Typography variant="h6" sx={{ color: "#c2410c" }}>
              Encouragement
            </Typography>
            <Typography>
              {getEncouragementMessage(calculateCurrentStreak())}
            </Typography>
          </Box>
        </Card>
      </div>

      {/* Bar Chart + Weekly Target */}
      <div className="flex gap-4 w-full">
        <Card className="flex-[2]">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                {reportData.map((week) => (
                  <Tab
                    key={week.weekNumber}
                    label={`Week ${week.weekNumber}`}
                    value={week.weekNumber.toString()}
                  />
                ))}
              </TabList>
            </Box>
            {reportData.map((week) => (
              <TabPanel
                key={week.weekNumber}
                value={week.weekNumber.toString()}
                sx={{ height: 300 }}
              >
                <AppBarChart
                  data={week.dailyProgress.map((d) => ({
                    name: d.date.slice(5),
                    uv: d.cigarettesSmoked,
                    fill:
                      d.status === "OVER"
                        ? "#f87171"
                        : d.status === "NO_RECORD"
                        ? "#d1d5db"
                        : "#34d399",
                  }))}
                  target={week.targetCigarettesPerDay}
                />
              </TabPanel>
            ))}
          </TabContext>
        </Card>

        {/* Weekly Target Progress */}
        <Card className="flex-1">
          <Box className="p-4 space-y-4">
            <Typography variant="h6" sx={{ color: "#c2410c" }}>
              Weekly Targets
            </Typography>
            {weeklyTargets.map((ms) => {
              const percent = Math.min((ms.current / ms.goal) * 100, 100);
              const achieved = percent <= ms.goal;
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
