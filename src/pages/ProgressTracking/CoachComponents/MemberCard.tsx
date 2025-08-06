import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import { MemberShortDTO } from "../models/type";

interface MemberCardProps {
  member: MemberShortDTO;
  onViewDetails: (member: MemberShortDTO) => void;
}

export default function MemberCard({ member, onViewDetails }: MemberCardProps) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={member.avatarUrl || undefined}
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              bgcolor: "#c2410c",
              fontSize: "1.5rem",
              border: "2px solid #f5f5f5",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {member.fullName?.charAt(0) || "M"}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {member.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thành viên
            </Typography>
            <Chip
              label={member.status}
              size="small"
              color={member.status === "ACTIVE" ? "success" : "default"}
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Nhấn "Xem chi tiết" để xem tiến độ
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => onViewDetails(member)}
          sx={{
            bgcolor: "#c2410c",
            "&:hover": { bgcolor: "#a0300a" },
            mt: "auto",
          }}
        >
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
}