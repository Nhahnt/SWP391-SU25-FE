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
  TextField,
  IconButton
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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
const token = localStorage.getItem("token");
const usernameStr = localStorage.getItem("username");

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAvatar = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/avatar/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data && res.data.avatarUrl) {
        setAvatar(res.data.avatarUrl);
      } else {
        setAvatar(null);
      }
    } catch {
      setAvatar(null);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
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
      setEditData({
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phone: response.data.phone || ""
      });
      fetchAvatar();
    } catch (err: any) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        `${API_BASE}/avatar/upload`,
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
      await fetchAvatar();
    } catch (err: any) {
      setUploadMsg("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || ""
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      await axios.put(
        `${API_BASE}/account/${usernameStr}/profile`,
        {
          fullName: editData.fullName,
          email: editData.email,
          phone: editData.phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setEditLoading(false);
    }
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
              {user.fullName
                ? user.fullName.charAt(0)
                : user.userName.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#c2410c" }}
              >
                {user.fullName || user.userName}
              </Typography>
              <Typography variant="body1" sx={{ color: "#757575" }}>
                Role: {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
              </Typography>
            </Box>
            <Box
              sx={{
                ml: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
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
                <span
                  className={`mt-2 text-sm ${
                    uploadMsg.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {uploadMsg}
                </span>
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderBottom: { xs: "1px solid #eee", sm: "none" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#9e9e9e", fontWeight: "medium" }}
                >
                  Username
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#424242", fontWeight: "bold" }}
                >
                  {user.userName}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderBottom: { xs: "1px solid #eee", sm: "none" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#9e9e9e", fontWeight: "medium" }}
                >
                  Email
                </Typography>
                {editMode ? (
                  <TextField
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ color: "#424242", fontWeight: "bold" }}
                  >
                    {user.email}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderBottom: { xs: "1px solid #eee", sm: "none" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#9e9e9e", fontWeight: "medium" }}
                >
                  Full Name
                </Typography>
                {editMode ? (
                  <TextField
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ color: "#424242", fontWeight: "bold" }}
                  >
                    {user.fullName}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderBottom: { xs: "1px solid #eee", sm: "none" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#9e9e9e", fontWeight: "medium" }}
                >
                  Phone Number
                </Typography>
                {editMode ? (
                  <TextField
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ color: "#424242", fontWeight: "bold" }}
                  >
                    {user.phone}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderBottom: { xs: "1px solid #eee", sm: "none" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#9e9e9e", fontWeight: "medium" }}
                >
                  Role
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#424242", fontWeight: "bold" }}
                >
                  {user.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : ""}
                </Typography>
              </Box>
            </Box>
            {editMode ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleEditSave}
                  disabled={editLoading}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={handleEditCancel}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                >
                  Edit Personal Info
                </Button>
              </Box>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Typography
              variant="body1"
              sx={{ color: "#9e9e9e", textAlign: "center" }}
            >
              You haven't written any blogs yet.
            </Typography>
          </TabPanel>
        </Paper>
      </Box>
    </main>
  );
}
