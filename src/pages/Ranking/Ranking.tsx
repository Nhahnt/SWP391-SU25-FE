import React from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Hardcoded data for demonstration
const participationData = [
  { name: 'Nguyễn Văn A', points: 1500 },
  { name: 'Trần Thị B', points: 1200 },
  { name: 'Lê Văn C', points: 950 },
  { name: 'Phạm Thị D', points: 800 },
  { name: 'Hoàng Văn E', points: 720 },
  { name: 'Vũ Thị F', points: 650 },
];

const moneySavedData = [
  { name: 'Nguyễn Văn A', amount: 500000 },
  { name: 'Đặng Văn G', amount: 480000 },
  { name: 'Phan Thị H', amount: 450000 },
  { name: 'Trần Thị B', amount: 420000 },
  { name: 'Hà Văn K', amount: 390000 },
  { name: 'Mai Thị L', amount: 350000 },
];

const Ranking = () => {
  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return '#cd7f32'; // Bronze
      default:
        return '#e2e8f0';
    }
  };

  const getRankIcon = (index: number) => {
    if (index < 3) {
      return <EmojiEventsIcon sx={{ color: getRankColor(index) }} />;
    }
    return null;
  };

  const renderRankingTable = (data: any[], title: string, columnHeader: string) => (
    <Paper
      elevation={6}
      sx={{
        bgcolor: '#fef3c7',
        borderRadius: '16px',
        p: 3,
        mb: 4,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#c2410c',
            textAlign: 'center',
            letterSpacing: '1px',
            borderBottom: '2px solid #FFD700',
            pb: 1,
            display: 'inline-block',
          }}
        >
          {title}
        </Typography>
      </Box>
      <TableContainer>
        <Table aria-label={`${title} ranking`}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#c2410c' }}>Hạng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#c2410c' }}>Tên</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#c2410c' }}>{columnHeader}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#fffbe0' },
                  '&:nth-of-type(even)': { backgroundColor: '#fef9e7' },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: index < 3 ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getRankIcon(index)}
                  {index + 1}
                </TableCell>
                <TableCell sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>{row.name}</TableCell>
                <TableCell align="right" sx={{ fontWeight: index < 3 ? 'bold' : 'normal', color: index < 3 ? getRankColor(index) : 'inherit' }}>
                  {row.points || `${row.amount.toLocaleString()} VND`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'extrabold',
            color: '#c2410c',
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Bảng xếp hạng
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#4b5563',
            fontWeight: 'medium',
          }}
        >
          Theo dõi thành tích của mọi người và cùng cố gắng nhé!
        </Typography>
      </Box>
      <Box sx={{ maxWidth: '900px', mx: 'auto', p: 2 }}>
        {renderRankingTable(participationData, 'Bảng xếp hạng Điểm tham gia', 'Điểm')}
        {renderRankingTable(moneySavedData, 'Bảng xếp hạng Tiền tiết kiệm', 'Tiền tiết kiệm')}
      </Box>
    </div>
  );
};

export default Ranking;
