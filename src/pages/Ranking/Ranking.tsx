import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Grid,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import axios from "axios";
import { styled } from "@mui/system";

interface UserRankingDTO {
  id: number;
  username: string;
  avatarUrl: string;
  totalMoneySaved: number;
  participationScore: number;
}

const getRankColor = (index: number) => {
  switch (index) {
    case 0:
      return "gold";
    case 1:
      return "silver";
    case 2:
      return "#cd7f32"; // Bronze
    default:
      return "#4b5563"; // gray-700
  }
};

const LeaderboardItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "16px",
  marginBottom: "12px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  backgroundColor: "#ffffff",
  "&.top-3": {
    background: "linear-gradient(135deg, #fef3c7 0%, #fffbe6 100%)",
  },
}));

const API_BASE_URL = "http://localhost:8082/api";

export default function Ranking() {
  const [participationRankings, setParticipationRankings] = useState<
    UserRankingDTO[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const token = localStorage.getItem("token");
        const participationRes = await axios.get(
          `${API_BASE_URL}/ranking/participation/top/10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setParticipationRankings(participationRes.data);
      } catch (err) {
        console.error("Error fetching ranking data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  if (loading) {
    return (
      <Box className="w-full flex justify-center items-center h-64">
        <CircularProgress sx={{ color: "#c2410c" }} />
      </Box>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 font-sans">
      <Box className="max-w-xl mx-auto text-center mb-8">
        <Typography
          variant="h3"
          component="h1"
          className="font-extrabold text-[#c2410c] mb-2 drop-shadow-md"
          sx={{ fontWeight: 900 }}
        >
          Bảng xếp hạng
        </Typography>
        <Typography variant="body1" className="text-gray-600 font-medium">
          Theo dõi thành tích của mọi người và cùng cố gắng nhé!
        </Typography>
      </Box>

      <Box className="max-w-xl mx-auto">
        <Box className="p-4 bg-[#c2410c] text-white rounded-t-lg">
          <Typography variant="h6" className="font-bold">
            Điểm tham gia
          </Typography>
        </Box>
        <Paper elevation={3} className="bg-white rounded-b-lg p-4">
          {participationRankings.length > 0 ? (
            participationRankings.map((row, index) => (
              <LeaderboardItem key={row.id} className={index < 3 ? "top-3" : ""}>
                <Box className="flex items-center w-1/5">
                  {index < 3 ? (
                    <EmojiEventsIcon
                      sx={{ color: getRankColor(index), fontSize: 32 }}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      className="font-bold"
                      sx={{
                        color: getRankColor(index),
                        width: 32,
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </Typography>
                  )}
                </Box>
                <Box className="flex items-center space-x-4 w-3/5">
                  <Avatar
                    src={
                      row.avatarUrl ||
                      "https://placehold.co/400x400/cccccc/000000?text=No+Image"
                    }
                    alt={row.username}
                    className="w-12 h-12 rounded-full border-2 border-[#c2410c]"
                  />
                  <Typography variant="body1" className="font-semibold text-lg">
                    {row.username}
                  </Typography>
                </Box>
                <Box className="flex-grow text-right">
                  <Typography variant="h6" className="font-bold text-[#c2410c]">
                    {`${row.participationScore}`} pts
                  </Typography>
                </Box>
              </LeaderboardItem>
            ))
          ) : (
            <Box className="text-center p-4">
              <Typography>No ranking data available.</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
}