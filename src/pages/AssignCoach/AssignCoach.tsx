import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CardMedia,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert, 
  Rating,
} from "@mui/material";
import axios from "axios";
import Card from "../../components/shared/Card";
import { useNavigate } from "react-router-dom";

interface Coach {
  id: number;
  name: string;
  avatarUrl: string;
  status: "ACTIVE" | "INACTIVE";
  averageRating?: number;
  ratingCount?: number;
}

interface FeedbackItem {
  id: number;
  memberName: string;
  coachName: string;
  coachId: number;
  stars: number;
  comment: string;
}

const API_BASE_URL = "http://localhost:8082";

export default function AssignCoach() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  const [allRatings, setAllRatings] = useState<FeedbackItem[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

  const fetchCoachesAndRatings = async () => {
    setLoadingCoaches(true);
    setLoadingRatings(true);
    setError(null); 

    try {
      const coachesRes = await axios.get(
        `${API_BASE_URL}/api/member/coach/available`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const allCoaches: Coach[] = coachesRes.data;
      const activeCoaches = allCoaches.filter(
        (coach) => coach.status === "ACTIVE"
      );
      
      const ratingsRes = await axios.get(
        `${API_BASE_URL}/api/rating/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setAllRatings(ratingsRes.data);
      
      const groupedRatings = ratingsRes.data.reduce((acc: { [key: number]: { sum: number; count: number } }, rating: FeedbackItem) => {
        const coachId = rating.coachId;
        if (!acc[coachId]) {
          acc[coachId] = { sum: 0, count: 0 };
        }
        acc[coachId].sum += rating.stars;
        acc[coachId].count++;
        return acc;
      }, {});

      const coachesWithRatings = activeCoaches.map(coach => {
        const ratingsData = groupedRatings[coach.id] || { sum: 0, count: 0 };
        return {
          ...coach,
          averageRating: ratingsData.count > 0 ? ratingsData.sum / ratingsData.count : 0,
          ratingCount: ratingsData.count,
        };
      });

      setCoaches(coachesWithRatings);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Đã xảy ra lỗi khi tải danh sách huấn luyện viên hoặc đánh giá.");
    } finally {
      setLoadingCoaches(false); 
      setLoadingRatings(false); 
    }
  };

  const handleAssignCoach = async () => {
    if (!selectedCoachId) {
      setError("Vui lòng chọn một huấn luyện viên.");
      setSnackbarMessage("Vui lòng chọn một huấn luyện viên.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/member/coach/${selectedCoachId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data);
      console.log(selectedCoachId);
      localStorage.setItem("coachId", selectedCoachId.toString());
      
      setSnackbarMessage("Đã chọn huấn luyện viên thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/conversations");
      }, 1500); 
    } catch (err) {
      console.error("Error assigning coach:", err);
      setSnackbarMessage("Đã xảy ra lỗi khi chọn huấn luyện viên.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const vipStatus = localStorage.getItem("isVip");
    if (vipStatus === "true") {
      setIsVip(true);
    }

    if (token && vipStatus === "true") {
      fetchCoachesAndRatings();
    }
  }, [token]);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (!isVip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MuiAlert severity="warning">
          Bạn không có quyền truy cập trang này. Vui lòng nâng cấp gói thành viên
          để sử dụng tính năng này.
        </MuiAlert>
      </div>
    );
  }

  const isLoading = loadingCoaches || loadingRatings;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#c2410c" }}
        className="text-center"
      >
        Chọn một huấn luyện viên cho hành trình cai thuốc của bạn
      </Typography>

      {error && <MuiAlert severity="error">{error}</MuiAlert>}

      {isLoading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress sx={{ color: "#c2410c" }} />
        </Box>
      ) : coaches.length > 0 ? (
        <>
          <div className="flex overflow-x-auto pb-4 -mx-2 sm:mx-0 custom-scrollbar">
            {coaches.map((coach) => {
              const isSelected = selectedCoachId === coach.id;

              return (
                <Card
                  key={coach.id}
                  onClick={() => setSelectedCoachId(coach.id)}
                  className={`flex-shrink-0 w-full min-h-[400px] flex flex-col justify-between mx-2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 transition-transform hover:scale-[1.02] overflow-hidden rounded-xl ${
                    isSelected
                      ? "border-2 border-[#c2410c] shadow-lg"
                      : "border border-gray-300 bg-white shadow-md"
                  }`}
                >
                  <CardMedia
                    component="img"
                    image={coach.avatarUrl || "https://placehold.co/400x400/cccccc/000000?text=No+Image"}
                    alt="coach avatar"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.onerror = null;
                      img.src = "https://placehold.co/400x400/cccccc/000000?text=No+Image";
                    }}
                    sx={{
                      height: 200,
                      width: "100%",
                      objectFit: "cover",
                      borderBottom: '1px solid #eee',
                    }}
                  />
                  <Box p={2} flexGrow={1}>
                    <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                      {coach.name ?? "Coach Name"}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Rating
                        name={`coach-rating-${coach.id}`}
                        value={coach.averageRating ?? 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary" ml={1}>
                        {coach.averageRating?.toFixed(1) ?? "N/A"} ({coach.ratingCount ?? 0} ratings)
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </div>
          {selectedCoachId && (
            <div className="col-span-full flex justify-center mt-6">
              <Button
                variant="contained"
                onClick={handleAssignCoach}
                sx={{
                  bgcolor: "#c2410c",
                  "&:hover": {
                    bgcolor: "#a8390b",
                  },
                  color: "#fff",
                  px: 3,
                  py: 1.5,
                  borderRadius: "8px",
                  boxShadow: 3,
                  textTransform: "none",
                }}
              >
                Chọn huấn luyện viên này
              </Button>
            </div>
          )}
        </>
      ) : (
        <MuiAlert severity="info">
          Không có huấn luyện viên nào đang hoạt động.
        </MuiAlert>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </main>
  );
}
