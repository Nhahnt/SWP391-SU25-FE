import React, { useState } from "react";
import {
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const API_BASE_URL = "http://localhost:8082";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vipBenefits = [
    "Có một Huấn luyện viên đồng hành cùng bạn",
    "Trò chuyện riêng tư với Huấn luyện viên",
    "Được Huấn luyện viên nhắc nhở và điều chỉnh trong quá trình cai thuốc",
  ];

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userID");
    const token = localStorage.getItem("token");
    const paymentMethod = "VNPAY";

    if (!userId || !token) {
      setError("Vui lòng đăng nhập để thực hiện thanh toán.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payment/payment`,
        { userId, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (typeof response.data === "string" && response.data.startsWith("redirect:")) {
        // Extract the URL by removing the "redirect:" prefix
        const redirectUrl = response.data.substring("redirect:".length);
        // Redirect the user to the VNPAY payment page
        window.location.href = redirectUrl;
      } else {
        throw new Error("Phản hồi không hợp lệ từ server.");
      }

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      if (axios.isAxiosError(err) && err.response) {
        // Handle errors with a response from the server
        setError(err.response.data.message || "Đã xảy ra lỗi khi tạo yêu cầu thanh toán.");
      } else {
        // Handle network or other errors without a server response
        setError("Không thể kết nối đến server thanh toán. Vui lòng kiểm tra kết nối mạng.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "500px",
          p: 4,
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#c2410c",
            mb: 2,
          }}
        >
          Thanh toán Gói VIP
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#4b5563",
            mb: 4,
          }}
        >
          Nâng cấp tài khoản của bạn để nhận những quyền lợi đặc biệt.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            p: 4,
            border: "2px solid #c2410c",
            borderRadius: "12px",
            bgcolor: "#fef2f2",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#c2410c",
              mb: 1,
            }}
          >
            Gói thành viên VIP
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "extrabold",
              color: "#1a202c",
              my: 2,
            }}
          >
            69.000đ
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 2,
              px: 2,
            }}
          >
            {vipBenefits.map((benefit, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <CheckCircleIcon sx={{ color: "#c2410c", mr: 1 }} />
                <Typography
                  variant="body1"
                  sx={{ color: "#4a5568", textAlign: "left" }}
                >
                  {benefit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handlePayment}
          disabled={loading}
          sx={{
            mt: 4,
            width: "100%",
            py: 2,
            borderRadius: "12px",
            bgcolor: "#c2410c",
            "&:hover": {
              bgcolor: "#a0300a",
            },
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Thanh toán ngay"
          )}
        </Button>
      </Paper>
    </div>
  );
};

export default Payment;
