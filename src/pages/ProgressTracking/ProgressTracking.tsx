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

type ReportEntry = {
  date: string; // YYYY-MM-DD
  week: number;
  target: number;
  actual: number;
};

const plan: ReportEntry[] = [
  { date: "2025-07-07", week: 1, target: 12, actual: 13 },
  { date: "2025-07-08", week: 1, target: 12, actual: 10 },
  { date: "2025-07-09", week: 1, target: 12, actual: 14 },
  { date: "2025-07-10", week: 1, target: 12, actual: 12 },
  { date: "2025-07-11", week: 1, target: 12, actual: 11 },
  { date: "2025-07-12", week: 1, target: 12, actual: 15 },
  { date: "2025-07-13", week: 1, target: 12, actual: 10 },
  { date: "2025-07-14", week: 2, target: 10, actual: 9 },
  { date: "2025-07-15", week: 2, target: 10, actual: 11 },
  { date: "2025-07-16", week: 2, target: 10, actual: 8 },
  // ...
];

export function ProgressTracking() {
  const [value, setValue] = React.useState("1");
  const [todayReport, setTodayReport] = React.useState<ReportEntry | null>(
    null
  );
  const [inputCount, setInputCount] = React.useState<number | "">("");

  const getTodayString = () => new Date().toISOString().split("T")[0];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const groupedByWeek = plan.reduce((acc, item) => {
    const weekKey = item.week.toString();
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(item);
    return acc;
  }, {} as Record<string, ReportEntry[]>);

  const getStatsFromWeek = (reports: ReportEntry[]) => {
    const total = reports.reduce((sum, r) => sum + r.actual, 0);
    const avg = total / reports.length;
    const over = reports.filter((r) => r.actual > r.target).length;
    const below = reports.filter((r) => r.actual <= r.target).length;
    const target = reports[0]?.target ?? 0;

    return {
      total,
      avg: avg.toFixed(1),
      over,
      below,
      target,
    };
  };

  const calculateCurrentStreak = (): number => {
    const sorted = [...plan].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    for (const entry of sorted) {
      if (entry.actual <= entry.target) streak++;
      else break;
    }
    return streak;
  };

  const getEncouragementMessage = (streak: number): string => {
    if (streak >= 14) {
      return "You're unstoppable! Two weeks of commitment – you're doing amazing!";
    } else if (streak >= 7) {
      return "One week strong! Keep building this healthy habit!";
    } else if (streak >= 3) {
      return "You're on the right track! Stay focused and keep going!";
    } else if (streak > 0) {
      return "Great start! Every day matters – you've got this!";
    } else {
      return "Don't worry! Every day is a chance to begin again.";
    }
  };

  const weeklyTargets = Object.entries(groupedByWeek).map(
    ([weekKey, weekData]) => {
      const goal = weekData[0]?.target * weekData.length;
      const current = weekData.reduce((sum, r) => sum + r.actual, 0);
      return {
        id: +weekKey,
        label: `Week ${weekKey}`,
        current,
        goal,
      };
    }
  );

  return (
    <div className="w-[70%] mx-auto py-4 space-y-4">
      <Typography variant="h4" sx={{ color: "#c2410c", fontWeight: "bold" }}>
        Progress Tracking
      </Typography>

      <div className="flex gap-4">
        {/* Self report section */}
        <Card className="flex-1">
          <Box className="p-4 space-y-3">
            <Typography variant="h6" sx={{ color: "#c2410c" }}>
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
                    week: 5,
                    target: 8,
                    actual: inputCount,
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
                You reported smoking <strong>{todayReport.actual}</strong>{" "}
                cigarette{todayReport.actual !== 1 && "s"} on{" "}
                <strong>{todayReport.date}</strong>.
              </Typography>
            )}
          </Box>
        </Card>

        {/* Streak section */}
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

      {/* Chart and Weekly Targets */}
      <div className="flex gap-4 w-full">
        <Card className="flex-[2]">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                {Object.keys(groupedByWeek).map((w) => (
                  <Tab key={w} label={`Week ${w}`} value={w} />
                ))}
              </TabList>
            </Box>
            {Object.entries(groupedByWeek).map(([w, data]) => (
              <TabPanel key={w} value={w} sx={{ height: 300 }}>
                <AppBarChart
                  data={data.map((r) => ({
                    name: r.date.slice(5),
                    uv: r.actual,
                    fill: r.actual > r.target ? "#f87171" : "#34d399",
                  }))}
                  target={data[0]?.target}
                />
              </TabPanel>
            ))}
          </TabContext>
        </Card>

        {/* Weekly Targets */}
        <Card className="flex-1">
          <Box className="p-4 space-y-4">
            <Typography variant="h6" sx={{ color: "#c2410c" }}>
              Weekly Targets
            </Typography>
            {weeklyTargets.map((ms) => {
              const percent = Math.min((ms.current / ms.goal) * 100, 100);
              const achieved = percent >= 100;
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

      {/* Stats Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#c2410c" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Indicator</TableCell>
                {Object.keys(groupedByWeek).map((w) => (
                  <TableCell key={w} align="center" sx={{ color: "white" }}>
                    Week {w}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {["total", "avg", "target", "over", "below"].map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  {Object.values(groupedByWeek).map((data, i) => {
                    const stats = getStatsFromWeek(data);
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
