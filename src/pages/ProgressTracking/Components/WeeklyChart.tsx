// components/progress/WeeklyChartTabs.tsx
import React, { useState } from "react";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AppBarChart } from "../../../components/shared/AppBarChart";
import Card from "../../../components/shared/Card";
import { DailyProgress, WeeklyReport } from "../models/type";

interface Props {
  data: WeeklyReport[];
}

export const WeeklyChartTabs = ({ data }: Props) => {
  const [value, setValue] = useState(data?.[0]?.weekNumber.toString() || "1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Card className="flex-[3]">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            {data.map((week) => (
              <Tab
                key={week.weekNumber}
                label={`Week ${week.weekNumber}`}
                value={week.weekNumber.toString()}
              />
            ))}
          </TabList>
        </Box>
        {data.map((week) => (
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
  );
};
