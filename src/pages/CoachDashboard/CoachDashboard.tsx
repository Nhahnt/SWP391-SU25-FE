import React, { useState } from "react";
import Card from "../../components/shared/Card";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { CalendarMonth, EmojiEvents, TrendingUp } from "@mui/icons-material";

// Hardcoded members assigned to coach
const members = [
  { id: 1, name: "John Doe", lastMessage: "Feeling motivated!" },
  { id: 2, name: "Jane Smith", lastMessage: "Struggling with cravings." },
  { id: 3, name: "Alex Nguyen", lastMessage: "Had a good week!" },
];

// Hardcoded progress data for each member
const memberProgress: Record<number, any> = {
  1: {
    quitDate: "2024-08-20",
    weeks: [
      { week: 1, smoked: 15, target: 20 },
      { week: 2, smoked: 10, target: 15 },
      { week: 3, smoked: 5, target: 10 },
    ],
    streak: 7,
    encouragement: "Great job, John! Keep up the momentum!",
  },
  2: {
    quitDate: "2024-07-10",
    weeks: [
      { week: 1, smoked: 18, target: 20 },
      { week: 2, smoked: 17, target: 18 },
      { week: 3, smoked: 16, target: 16 },
    ],
    streak: 2,
    encouragement: "Hang in there, Jane! Every day counts.",
  },
  3: {
    quitDate: "2024-06-01",
    weeks: [
      { week: 1, smoked: 12, target: 15 },
      { week: 2, smoked: 8, target: 10 },
      { week: 3, smoked: 4, target: 5 },
    ],
    streak: 14,
    encouragement: "Amazing progress, Alex! You're a role model.",
  },
};

export default function CoachDashboard() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedMember = members.find((m) => m.id === selectedId);
  const progress = selectedId ? memberProgress[selectedId] : null;

  return (
    <div className="w-full h-[85vh] flex flex-row">
      {/* Sidebar: Members list */}
      <Card className="w-[18%] overflow-y-auto">
        <Typography variant="h6" fontWeight="bold" color="#c2410c">
          Assigned Members
        </Typography>
        <List>
          {members.map((member) => (
            <ListItem
              key={member.id}
              onClick={() => setSelectedId(member.id)}
              className={`hover:bg-gray-100 hover:cursor-pointer ${
                selectedId === member.id ? "bg-gray-200" : ""
              }`}
              component="li"
            >
              <ListItemText
                primary={member.name}
                secondary={member.lastMessage}
                primaryTypographyProps={{ fontWeight: "500" }}
              />
            </ListItem>
          ))}
        </List>
      </Card>

      {/* Member progress */}
      <Card className="flex-1 bg-white h-full p-6 flex flex-col">
        {selectedMember && progress ? (
          <>
            <h2 className="text-2xl font-bold text-orange-700 mb-2">
              {selectedMember.name}'s Quit Smoking Progress
            </h2>
            {/* Stats Row */}
            <div className="flex justify-around mb-4">
              <div className="flex flex-col items-center bg-orange-100 rounded-lg px-4 py-2 shadow min-w-[150px]">
                <span className="text-lg font-bold text-orange-700">
                  Quit Date
                </span>
                <span className="text-base font-semibold">
                  {progress.quitDate}
                </span>
              </div>
              <div className="flex flex-col items-center bg-orange-100 rounded-lg px-4 py-2 shadow min-w-[150px]">
                <span className="text-lg font-bold text-orange-700">
                  Streak
                </span>
                <span className="text-base font-semibold">
                  {progress.streak} days
                </span>
              </div>
              <div className="flex flex-col items-center bg-orange-100 rounded-lg px-4 py-2 shadow min-w-[200px]">
                <span className="text-lg font-bold text-orange-700">
                  Encouragement
                </span>
                <span className="text-base font-semibold text-center">
                  {progress.encouragement}
                </span>
              </div>
            </div>
            <hr className="my-3" />

            {/* Table Title */}
            <h3 className="text-xl font-bold text-orange-700 mb-1">
              Weekly Progress
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-orange-200 rounded-lg">
                <thead className="bg-orange-700 text-white">
                  <tr>
                    <th className="py-2 px-4">Week</th>
                    <th className="py-2 px-4">Smoked</th>
                    <th className="py-2 px-4">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.weeks.map((w: any) => (
                    <tr key={w.week} className="text-center border-b">
                      <td className="py-2 px-4">{w.week}</td>
                      <td className="py-2 px-4">{w.smoked}</td>
                      <td className="py-2 px-4">{w.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 text-lg">
              Select a member to view their progress.
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
