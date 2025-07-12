import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
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
} from "@mui/material";
const plan = {
  week1: {
    target: 12,
    data: { mon: 12, tues: 13, wed: 10, thurs: 9, fri: 11, sat: 14, sun: 15 },
  },
  week2: {
    target: 10,
    data: { mon: 10, tues: 11, wed: 9, thurs: 7, fri: 10, sat: 12, sun: 13 },
  },
  week3: {
    target: 9,
    data: { mon: 8, tues: 9, wed: 7, thurs: 6, fri: 8, sat: 10, sun: 9 },
  },
  week4: {
    target: 9,
    data: { mon: 8, tues: 9, wed: 7, thurs: 6, fri: 8, sat: 10, sun: 9 },
  },
};
const getStatsFromWeek = (week: (typeof plan)["week1"]) => {
  const values = Object.values(week.data);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / values.length;
  const over = values.filter((v) => v > week.target).length;
  const below = values.filter((v) => v <= week.target).length;

  return {
    total,
    avg: avg.toFixed(1),
    over,
    below,
    target: week.target,
  };
};

export function ProgressTracking() {
  const [value, setValue] = React.useState("week1");
  const [todayReport, setTodayReport] = React.useState<{
    date: string;
    count: number;
  } | null>(null);
  const [inputCount, setInputCount] = React.useState<number | "">("");

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Chuyển đổi từng tuần thành mảng dữ liệu cho chart
  const getChartData = (
    weekData: Record<string, number>,
    target: number
  ): { name: string; uv: number; fill: string }[] => {
    return Object.entries(weekData).map(([day, count]) => ({
      name: capitalize(day),
      uv: count,
      fill: count > target ? "#f87171" : "#34d399", // đỏ / xanh
    }));
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const weeklyTargets = Object.entries(plan).reduce(
    (acc, [weekKey, weekObj], index) => {
      const current = Object.values(weekObj.data).reduce((a, b) => a + b, 0);
      const goal = weekObj.target * 7;

      acc.push({
        id: index + 1,
        label: `Cigarettes in ${weekKey.toUpperCase()}`,
        current,
        goal,
      });

      return acc;
    },
    [] as { id: number; label: string; current: number; goal: number }[]
  );

  const calculateCurrentStreak = (planData: typeof plan): number => {
    const allDays: { value: number; target: number }[] = [];

    // Gộp tất cả ngày từ các tuần theo thứ tự
    for (const week of Object.values(plan)) {
      for (const value of Object.values(week.data)) {
        allDays.push({ value, target: week.target });
      }
    }

    // Tính streak từ cuối mảng (gần nhất)
    let streak = 0;
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].value <= allDays[i].target) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="w-[70%] h-[100vh] mx-auto py-4 space-y-4">
      <Typography
        variant="h4"
        sx={{
          color: "#c2410c",
          fontWeight: "bold",
        }}
      >
        Progress Tracking
      </Typography>
      <div className="flex flex-row gap-4">
        <Card>
          <Box className="p-4 space-y-3">
            <Typography
              variant="h6"
              sx={{ color: "#c2410c", fontWeight: "bold" }}
            >
              Today's Report
            </Typography>

            <Typography variant="body2">
              How many cigarettes did you smoke today?
            </Typography>

            <input
              type="number"
              value={inputCount}
              onChange={(e) =>
                setInputCount(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              placeholder="Enter number..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />

            <button
              onClick={() => {
                if (inputCount !== "" && !isNaN(inputCount)) {
                  setTodayReport({
                    date: getTodayString(),
                    count: inputCount,
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
                You reported smoking <strong>{todayReport.count}</strong>{" "}
                cigarette
                {todayReport.count !== 1 && "s"} on{" "}
                <strong>{todayReport.date}</strong>.
              </Typography>
            )}
          </Box>
        </Card>

        <Card>
          <Box className="p-4 space-y-2 text-center">
            <Typography
              variant="h6"
              sx={{ color: "#c2410c", fontWeight: "bold" }}
            >
              Current Streak
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "#16a34a", fontWeight: "bold" }}
            >
              {calculateCurrentStreak(plan)} days
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of smoking below or equal to your daily target
            </Typography>
          </Box>
        </Card>

        <Card className="flex-1">
          <Box className="p-4 space-y-4 ">
            <Typography
              variant="h6"
              sx={{ color: "#c2410c", fontWeight: "bold" }}
            >
              Weekly Targets
            </Typography>
            {weeklyTargets.map((ms) => {
              const percent = Math.min((ms.current / ms.goal) * 100, 100);
              const achieved = percent >= 100;
              return (
                <Box key={ms.id} className="space-y-1">
                  <Typography variant="body2" fontWeight="bold">
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
                        backgroundColor: achieved ? "#c2410c" : "#16a34a",
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Card>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <Card className="flex-[2]">
          <Box sx={{ width: "100%" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleChange}>
                  {Object.keys(plan).map((week) => (
                    <Tab key={week} label={week.toUpperCase()} value={week} />
                  ))}
                </TabList>
              </Box>

              {Object.entries(plan).map(([weekKey, weekObj]) => (
                <TabPanel
                  key={weekKey}
                  value={weekKey}
                  sx={{ height: 300, p: 4, background: "#f3f4f6" }}
                >
                  <AppBarChart
                    data={getChartData(weekObj.data, weekObj.target)}
                    target={weekObj.target}
                  />
                </TabPanel>
              ))}
            </TabContext>
          </Box>
        </Card>
        <Card className="flex-[1]">
          <TableContainer component={Paper} sx={{ height: "100%" }}>
            <Table size="small" sx={{ height: "100%" }}>
              <TableHead
                sx={{
                  backgroundColor: "#c2410c",
                  "& th": {
                    color: "white",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableRow>
                  <TableCell>Indicator</TableCell>
                  {Object.keys(plan).map((weekKey) => (
                    <TableCell key={weekKey} align="center">
                      {weekKey.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { label: "Total", key: "total" },
                  { label: "Average per day", key: "avg" },
                  { label: "Target", key: "target" },
                  { label: "Days exceeded", key: "over" },
                  { label: "Days met/below", key: "below" },
                ].map((statRow) => (
                  <TableRow key={statRow.key}>
                    <TableCell>{statRow.label}</TableCell>
                    {Object.values(plan).map((weekData, index) => {
                      const stats = getStatsFromWeek(weekData);
                      return (
                        <TableCell key={index} align="center">
                          {stats[statRow.key as keyof typeof stats]}
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
    </div>
  );
}
