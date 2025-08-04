import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';

export default function SuggestedPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const quizResult = location.state?.quizResult;

  if (!quizResult) {
    // If there's no quiz result, navigate back to the quiz page
    navigate('/quiz');
    return null;
  }

  // Placeholder content for the suggested plan based on the quiz result
  let planContent;
  if (quizResult.level === 'NẶNG') {
    planContent = (
      <Typography variant="body1" sx={{ color: '#4a5568', mb: 4 }}>
        Kế hoạch gợi ý cho mức độ phụ thuộc **NẶNG** tập trung vào việc tìm kiếm sự giúp đỡ từ chuyên gia y tế, sử dụng các liệu pháp thay thế nicotine và xây dựng một mạng lưới hỗ trợ vững chắc.
      </Typography>
    );
  } else if (quizResult.level === 'TRUNG_BÌNH') {
    planContent = (
      <Typography variant="body1" sx={{ color: '#4a5568', mb: 4 }}>
        Kế hoạch gợi ý cho mức độ phụ thuộc **TRUNG BÌNH** bao gồm việc giảm dần số lượng thuốc, tìm kiếm các hoạt động thay thế và nhận sự hỗ trợ từ huấn luyện viên để vượt qua cơn thèm.
      </Typography>
    );
  } else {
    planContent = (
      <Typography variant="body1" sx={{ color: '#4a5568', mb: 4 }}>
        Kế hoạch gợi ý cho mức độ phụ thuộc **NHẸ** tập trung vào việc tự giám sát, thiết lập một ngày cai thuốc cụ thể và tìm kiếm các phương pháp thư giãn để đối phó với những cơn thèm thuốc đột ngột.
      </Typography>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <Paper elevation={4} sx={{ width: '100%', maxWidth: '700px', p: 6, borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#c2410c', mb: 2 }}>
          Kế Hoạch Gợi Ý
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'semibold', color: '#1a202c', mb: 1 }}>
          Mức Độ Phụ Thuộc: {quizResult.level}
        </Typography>
        <Typography variant="body1" sx={{ color: '#4a5568', mb: 4 }}>
          Điểm số của bạn: <span className="font-bold text-lg">{quizResult.score}</span>
        </Typography>

        <Box sx={{ mb: 6 }}>
          {planContent}
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            bgcolor: '#c2410c',
            '&:hover': { bgcolor: '#a0300a' },
            py: 1.5,
            px: 4,
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          Hoàn Thành
        </Button>
      </Paper>
    </div>
  );
};
