import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Button,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const API_BASE = "http://localhost:8082/api";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const usernameStr = localStorage.getItem("username");
        const response = await axios.get(
          `${API_BASE}/account/${usernameStr}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUser(response.data);
        if (response.data && response.data.memberId) {
          fetchAvatar(response.data.memberId, token);
        }
      } catch (err: any) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    const fetchAvatar = async (memberId: number, token: string | null) => {
      try {
        const res = await axios.get(
          `${API_BASE}/member/${memberId}/avatar`, // doesnt work yet due to not having memberID
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "text",
            withCredentials: true,
          }
        );
        if (res.data) {
          setAvatar(`data:image/jpeg;base64,${res.data}`);
        } else {
          setAvatar(null);
        }
      } catch {
        setAvatar(null);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    setUploading(true);
    setUploadMsg("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        `${API_BASE}/member/${user.memberId}/avatar`, // doesnt work yet due to not having memberID
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setUploadMsg("Avatar uploaded successfully!");
      // Refresh avatar after upload
      if (user.memberId) {
        const res = await axios.get(
          `${API_BASE}/member/${user.memberId}/avatar`, // doesnt work yet due to not having memberID
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "text",
            withCredentials: true,
          }
        );
        if (res.data) {
          setAvatar(`data:image/jpeg;base64,${res.data}`);
        }
      }
    } catch (err: any) {
      setUploadMsg("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress sx={{ color: "#c2410c" }} />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          color: "#e53935",
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }
  if (!user) return null;

  return (
    <main>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          p: { xs: 2, sm: 3, lg: 4 },
          fontFamily: "Inter, sans-serif",
          color: "#424242",
          mt: { xs: "80px", sm: "80px" },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            maxWidth: { xs: "100%", md: "800px" },
            mx: "auto",
            mt: { xs: 2, sm: 4 },
            p: { xs: 2, sm: 3 },
            borderRadius: "16px",
            border: "1px solid #eeeeee",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Avatar
              src={avatar || undefined}
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                bgcolor: "#c2410c",
                fontSize: { xs: "2rem", sm: "2.5rem" },
                border: "3px solid #f5f5f5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#c2410c" }}
              >
                {user.fullName || user.username}
              </Typography>
              <Typography variant="body1" sx={{ color: "#757575" }}>
                Role: {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
              </Typography>
            </Box>
            <Box sx={{ ml: "auto", display: "flex", flexDirection: "column", alignItems: "end" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#c2410c",
                  "&:hover": { bgcolor: "#a0300a" },
                  color: "white",
                  fontWeight: "semibold",
                  py: 1,
                  px: 2,
                  borderRadius: "8px",
                  textTransform: "none",
                  mb: 1,
                }}
                onClick={handleAvatarButtonClick}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Avatar"}
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              {uploadMsg && (
                <span className={`mt-2 text-sm ${uploadMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>{uploadMsg}</span>
              )}
            </Box>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#c2410c",
                },
                "& .MuiTab-root": {
                  color: "#757575",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: "#c2410c",
                  },
                },
              }}
            >
              <Tab label="Personal Info" />
              <Tab label="My Blogs" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ p: 1, borderBottom: { xs: '1px solid #eee', sm: 'none' } }}>
                <Typography variant="body2" sx={{ color: "#9e9e9e", fontWeight: "medium" }}>Username</Typography>
                <Typography variant="body1" sx={{ color: "#424242", fontWeight: "bold" }}>{user.username}</Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: { xs: '1px solid #eee', sm: 'none' } }}>
                <Typography variant="body2" sx={{ color: "#9e9e9e", fontWeight: "medium" }}>Email</Typography>
                <Typography variant="body1" sx={{ color: "#424242", fontWeight: "bold" }}>{user.email}</Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: { xs: '1px solid #eee', sm: 'none' } }}>
                <Typography variant="body2" sx={{ color: "#9e9e9e", fontWeight: "medium" }}>Full Name</Typography>
                <Typography variant="body1" sx={{ color: "#424242", fontWeight: "bold" }}>{user.fullName}</Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: { xs: '1px solid #eee', sm: 'none' } }}>
                <Typography variant="body2" sx={{ color: "#9e9e9e", fontWeight: "medium" }}>Phone Number</Typography>
                <Typography variant="body1" sx={{ color: "#424242", fontWeight: "bold" }}>{user.phone}</Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: { xs: '1px solid #eee', sm: 'none' } }}>
                <Typography variant="body2" sx={{ color: "#9e9e9e", fontWeight: "medium" }}>Role</Typography>
                <Typography variant="body1" sx={{ color: "#424242", fontWeight: "bold" }}>
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#c2410c",
                "&:hover": { bgcolor: "#a0300a" },
                color: "white",
                fontWeight: "semibold",
                py: 1,
                px: 3,
                borderRadius: "8px",
                textTransform: "none",
                display: "block",
                mx: "auto",
                mt: 4,
              }}
            >
              Edit Personal Info
            </Button>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1" sx={{ color: "#9e9e9e", textAlign: "center" }}>
              You haven't written any blogs yet.
            </Typography>
          </TabPanel>
        </Paper>
      </Box>
    </main>
  );
}
