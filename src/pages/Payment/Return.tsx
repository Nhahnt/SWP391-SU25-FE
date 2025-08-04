import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress, Paper, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082';

// Define the shape of the successful response from the backend
interface TransactionResponse {
  status: 'SUCCESS' | 'FAILURE';
  txnRef?: string;
  amount?: number;
  orderInfo?: string;
  message?: string;
}

// Define the shape of the user profile response from the backend
interface UserInfo {
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isVip: any; 
  memberID: string;
  userID: string;
}

const Return = () => {
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'FAILURE'>('LOADING');
  const [message, setMessage] = useState('Đang xử lý giao dịch của bạn...');
  const [transactionDetails, setTransactionDetails] = useState<TransactionResponse | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to re-fetch user data and update localStorage
  const fetchUserData = async () => {
    const usernameStr = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    
    if (!token || !usernameStr) {
      console.error('No token or username found, cannot fetch user data.');
      return;
    }

    try {
      const response = await axios.get<UserInfo>(
        `${API_BASE_URL}/api/account/${usernameStr}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, 
        }
      );
      
      const data = response.data;
      if (data) {
        console.log('User data successfully updated:', data);
        localStorage.setItem('isVip', data.isVip);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userID', data.userID);
      }

    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('FAILURE');
        setMessage('Không tìm thấy token. Vui lòng đăng nhập lại.');
        console.error('Payment return error: No token found in localStorage.');
        return;
      }

      try {
        const queryString = location.search;
        
        const response = await axios.get<TransactionResponse>(
          `${API_BASE_URL}/api/v1/payment/return${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setTransactionDetails(data);

        if (data.status === 'SUCCESS') {
          setStatus('SUCCESS');
          setMessage(data.message || 'Nâng cấp VIP thành công!');
          
          await fetchUserData();

          // Chuyển hướng về trang chủ sau 5000ms (5 giây)
          setTimeout(() => {
            navigate('/');
          }, 5000);
          
        } else {
          setStatus('FAILURE');
          setMessage(data.message || 'Giao dịch thất bại. Vui lòng thử lại.');
        }

      } catch (err: any) {
        setStatus('FAILURE');
        if (axios.isAxiosError(err) && err.response) {
          setMessage(err.response.data.message || 'Đã xảy ra lỗi từ server khi xác thực giao dịch.');
          console.error('API Error:', err.response.data);
        } else {
          setMessage('Không thể kết nối đến server để xác thực giao dịch.');
          console.error('Payment return error:', err);
        }
      }
    };

    handlePaymentReturn();
  }, [location.search, navigate]);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const renderContent = () => {
    switch (status) {
      case 'LOADING':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress sx={{ color: '#c2410c' }} />
            <Typography variant="h6" sx={{ color: '#4a5568', textAlign: 'center' }}>
              {message}
            </Typography>
          </Box>
        );
      case 'SUCCESS':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#10b981' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10b981', textAlign: 'center' }}>
              {message}
            </Typography>
            {transactionDetails && (
              <Box sx={{ mt: 2, p: 3, bgcolor: '#f0fdf4', borderRadius: '8px', width: '100%' }}>
                <Typography variant="body1" sx={{ textAlign: 'left', mb: 1 }}>
                  <span style={{ fontWeight: 'bold' }}>Mã giao dịch:</span> {transactionDetails.txnRef}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'left', mb: 1 }}>
                  <span style={{ fontWeight: 'bold' }}>Số tiền:</span> {formatCurrency(transactionDetails.amount)}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  <span style={{ fontWeight: 'bold' }}>Thông tin đơn hàng:</span> {transactionDetails.orderInfo}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ bgcolor: '#c2410c', '&:hover': { bgcolor: '#a0300a' } }}
            >
              Quay về trang chủ
            </Button>
          </Box>
        );
      case 'FAILURE':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: '#ef4444' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ef4444', textAlign: 'center' }}>
              {message}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/payment')}
              sx={{ borderColor: '#c2410c', color: '#c2410c', '&:hover': { borderColor: '#a0300a' } }}
            >
              Thử lại
            </Button>
          </Box>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: '600px',
          p: 6,
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}
      >
        {renderContent()}
      </Paper>
    </div>
  );
};

export default Return;
