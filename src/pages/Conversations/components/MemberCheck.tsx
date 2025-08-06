import React from 'react';
import { Box, Typography, Alert, AlertTitle, Button } from "@mui/material";
import { Link } from "react-router-dom";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

interface MemberCheckProps {
  children: React.ReactNode;
}

export default function MemberCheck({ children }: MemberCheckProps) {
  // Retrieve VIP status and coach ID from local storage
  const isVip = localStorage.getItem("isVip");
  const coachId = localStorage.getItem("coachId");
  const role = localStorage.getItem("role");

  const centeredBoxStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    p: 4, 
    textAlign: 'center',
  };

  // Check if user is a Coach
  if (role === "coach" || role === "COACH") {
    return <>{children}</>;
  }

  // Check 1: If the user is not a VIP
  if (isVip !== "true") {
    return (
      <Box sx={centeredBoxStyles}>
        <Alert
          severity="warning"
          icon={<WarningAmberOutlinedIcon sx={{ fontSize: 80 }} />} // Warning icon
          sx={{
            width: '100%',
            maxWidth: 550,
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #fffbeb, #fef2f2)',
            py: 5,
            px: 4,
            '& .MuiAlert-icon': {
              fontSize: 80,
              color: '#d97706',
              alignItems: 'center',
              mr: 2,
            },
            '& .MuiAlert-message': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            },
          }}
        >
          <AlertTitle sx={{ fontSize: 30, fontWeight: 700, color: '#b45309' }}>
            Bạn không có quyền truy cập
          </AlertTitle>
          <Typography variant="body1" sx={{ fontSize: 18, color: '#4a5568' }}>
            Để sử dụng chức năng chat, vui lòng nâng cấp lên gói thành viên VIP.
          </Typography>
          <Link to="/payment" style={{ textDecoration: "none", width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#c2410c',
                '&:hover': {
                  backgroundColor: '#a8390b',
                  transform: 'scale(1.02)', 
                },
                transition: 'all 0.3s ease', 
                color: '#fff',
                fontWeight: 700, 
                borderRadius: 2, 
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: 16,
              }}
            >
              Nâng cấp VIP ngay
            </Button>
          </Link>
        </Alert>
      </Box>
    );
  }

  // Check 2: If the user is a VIP but has no coach assigned
  if (isVip === "true" && !coachId) {
    return (
      <Box sx={centeredBoxStyles}>
        <Alert
          severity="info"
          icon={<GroupsOutlinedIcon sx={{ fontSize: 80 }} />} // Community icon
          sx={{
            width: '100%',
            maxWidth: 550,
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            py: 5,
            px: 4,
            '& .MuiAlert-icon': {
              fontSize: 80,
              color: '#2563eb',
              alignItems: 'center',
              mr: 2,
            },
            '& .MuiAlert-message': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            },
          }}
        >
          <AlertTitle sx={{ fontSize: 30, fontWeight: 700, color: '#1e40af' }}>
            Chào mừng bạn đến với VIP!
          </AlertTitle>
          <Typography variant="body1" sx={{ fontSize: 18, color: '#4a5568' }}>
            Bạn đã là thành viên VIP. Vui lòng chọn một huấn luyện viên để bắt đầu hành trình của mình.
          </Typography>
          <Link to="/coach-assign" style={{ textDecoration: "none", width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: 16,
              }}
            >
              Chọn Huấn luyện viên
            </Button>
          </Link>
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
}
