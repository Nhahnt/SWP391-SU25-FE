import { useEffect, useState, SyntheticEvent, ChangeEvent } from "react";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import DashboardSidebar from "../../../components/Sidebar";
import axios from "axios";
import "./CoachesList.css";
import PopUpDialog from "../components/PopUpDialog";

interface Coach {
  userId: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isVip: string;
  gender: string;
  status: string;
}

const API_BASE = "http://localhost:8082/api";

export default function CoachesList() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<Coach | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoach, setNewCoach] = useState({
    userName: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    gender: "MALE",
  });

  // State for loading indicators
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for Snackbar notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // State for form validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State for pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(coaches.length / rowsPerPage);
  const currentCoaches = coaches.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/admin/accounts/coaches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCoaches(res.data);
    } catch (err) {
      console.error("Error fetching coaches:", err);
      showSnackbar("Không thể tải danh sách coach", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to show the Snackbar
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Function to close the Snackbar
  const handleSnackbarClose = (
    event?: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDelete = (coach: Coach) => {
    setCoachToDelete(coach);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (coachToDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${API_BASE}/admin/account/${coachToDelete.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShowDeleteModal(false);
        setCoachToDelete(null);
        fetchCoaches();
        showSnackbar("Huấn luyện viên đã được xoá thành công.", "success");
      } catch (err: any) {
        console.error("Error deleting coach:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Đã xảy ra lỗi khi xoá huấn luyện viên.";
        showSnackbar(errorMessage, "error");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
    setEmailError("");
    setPasswordError("");
  };

  const validateForm = () => {
    if (
      !newCoach.userName ||
      !newCoach.email ||
      !newCoach.fullName ||
      !newCoach.phoneNumber ||
      !newCoach.gender
    ) {
      showSnackbar("Please fill in all required fields.", "warning");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newCoach.email)) {
      showSnackbar("Please enter a valid email address.", "warning");
      return false;
    }
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(newCoach.phoneNumber)) {
      showSnackbar(
        "Please enter a valid phone number (10-15 digits).",
        "warning"
      );
      return false;
    }
    return true;
  };

  const confirmAdd = async () => {
    if (!validateForm()) {
      return;
    }

    setIsAdding(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/admin/create-account`,
        {
          userName: newCoach.userName,
          email: newCoach.email,
          fullName: newCoach.fullName,
          phoneNumber: newCoach.phoneNumber,
          password: newCoach.password
            ? newCoach.password
            : "DefaultPassword123",
          gender: newCoach.gender,
          role: "COACH",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowAddModal(false);
      setNewCoach({
        userName: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        password: "",
        gender: "MALE",
      });
      fetchCoaches();
      showSnackbar("Huấn luyện viên mới được thêm thành công.", "success");
    } catch (err: any) {
      console.error("Error adding coach:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Đã xảy ra lỗi khi thêm huấn luyện viên.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1); // Reset to first page
  };

  return (
    <div className="dashboard-container">
      <div className="db-sidebar">
        <DashboardSidebar />
      </div>

      <div className="db-content">
        <div className="mng-header">
          <div className="bg-[red]">Coach Management</div>
          <button
            className="button primary-button add-btn"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
            onClick={handleAdd}
          >
            Add Coach
          </button>
        </div>
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
              <p>Đang tải danh sách huấn luyện viên...</p>
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCoaches.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-message">
                        <div className="empty-state">
                          <p>Không tìm thấy huấn luyện viên nào</p>
                          <p className="empty-subtitle">
                            Hiện tại chưa có huấn luyện viên nào trong hệ thống.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentCoaches.map((coach, index) => (
                      <tr
                        key={coach.userId}
                        style={{
                          backgroundColor:
                            coach.status === "INACTIVE"
                              ? "#ffe6e6"
                              : undefined,
                          color:
                            coach.status === "INACTIVE"
                              ? "#8b0000"
                              : undefined,
                        }}
                      >
                        <td>{(page - 1) * rowsPerPage + index + 1}</td>
                        <td>{coach.userName}</td>
                        <td>{coach.email}</td>
                        <td>{coach.fullName}</td>
                        <td>{coach.phoneNumber}</td>
                        <td>{coach.gender}</td>
                        <td>
                          {coach.status === "INACTIVE" ? (
                            <strong>INACTIVE</strong>
                          ) : (
                            <>
                              <button className="action-button edit-button">
                                Edit
                              </button>
                              <button
                                className="action-button delete-button"
                                onClick={() => handleDelete(coach)}
                                disabled={isDeleting}
                              >
                                {isDeleting &&
                                coachToDelete?.userId === coach.userId ? (
                                  <CircularProgress size={20} color="inherit" />
                                ) : (
                                  "Delete"
                                )}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="pagination-container">
                <FormControl variant="outlined" size="small">
                  <InputLabel>Rows per page</InputLabel>
                  <Select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    label="Rows per page"
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </FormControl>
                <div className="page-navigation">
                  <Typography variant="body2">
                    Page {page} of {totalPages}
                  </Typography>
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    size="small"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    size="small"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Popup */}
        <PopUpDialog
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          onClose={() => setShowDeleteModal(false)}
        >
          <Typography>
            Bạn có chắc muốn xóa huấn luyện viên{" "}
            <strong>{coachToDelete?.userName}</strong> không?
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
              gap: 8,
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Yes, Delete"
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
          </div>
        </PopUpDialog>

        {/* Add Coach Popup */}
        <PopUpDialog
          isOpen={showAddModal}
          title="Add Coach"
          onClose={() => setShowAddModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={newCoach.userName}
              onChange={(e) =>
                setNewCoach({ ...newCoach, userName: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={newCoach.email}
              onChange={(e) => {
                setNewCoach({ ...newCoach, email: e.target.value });
                setEmailError("");
              }}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={newCoach.fullName}
              onChange={(e) =>
                setNewCoach({ ...newCoach, fullName: e.target.value })
              }
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={newCoach.phoneNumber}
              onChange={(e) =>
                setNewCoach({ ...newCoach, phoneNumber: e.target.value })
              }
            />
            <TextField
              label="Password (leave empty for DefaultPassword123)"
              type="password"
              variant="outlined"
              fullWidth
              value={newCoach.password}
              onChange={(e) => {
                setNewCoach({ ...newCoach, password: e.target.value });
                setPasswordError("");
              }}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={newCoach.gender}
                label="Gender"
                onChange={(e) =>
                  setNewCoach({
                    ...newCoach,
                    gender: e.target.value as "MALE" | "FEMALE",
                  })
                }
              >
                <MenuItem value="" disabled>
                  <em>Select Gender</em>
                </MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </Select>
            </FormControl>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Button
                variant="contained"
                onClick={confirmAdd}
                disabled={isAdding}
              >
                {isAdding ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add"
                )}
              </Button>
              <Button variant="outlined" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </PopUpDialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );


}
