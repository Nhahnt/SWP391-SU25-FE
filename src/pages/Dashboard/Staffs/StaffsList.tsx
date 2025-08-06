import { SyntheticEvent, useEffect, useState } from "react";
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
} from "@mui/material";
import DashboardSidebar from "../../../components/Sidebar";
import axios from "axios";
import "./StaffsList.css";
import PopUpDialog from "../components/PopUpDialog";

interface Staff {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  status: string;
  phoneNumber: string;
  gender: string;
}

const API_BASE = "http://localhost:8082/api";

export default function StaffsList() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
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
  const totalPages = Math.ceil(staffs.length / rowsPerPage);
  const currentStaffs = staffs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/admin/accounts/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaffs(res.data);
    } catch (err) {
      console.error("Error fetching staffs:", err);
      showSnackbar("Không thể tải danh sách staff", "error");
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

  const handleDelete = (staff: Staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (staffToDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${API_BASE}/admin/account/${staffToDelete.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShowDeleteModal(false);
        setStaffToDelete(null);
        fetchStaffs();
        showSnackbar("Huấn luyện viên đã được xoá thành công.", "success");
      } catch (err: any) {
        console.error("Error deleting staff:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Đã xảy ra lỗi khi xoá nhân viên.";
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
      !newStaff.userName ||
      !newStaff.email ||
      !newStaff.fullName ||
      !newStaff.phoneNumber ||
      !newStaff.gender
    ) {
      showSnackbar("Please fill in all required fields.", "warning");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStaff.email)) {
      showSnackbar("Please enter a valid email address.", "warning");
      return false;
    }
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(newStaff.phoneNumber)) {
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
          userName: newStaff.userName,
          email: newStaff.email,
          fullName: newStaff.fullName,
          phoneNumber: newStaff.phoneNumber,
          password: newStaff.password
            ? newStaff.password
            : "DefaultPassword123",
          gender: newStaff.gender,
          role: "STAFF",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowAddModal(false);
      setNewStaff({
        userName: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        password: "",
        gender: "MALE",
      });
      fetchStaffs();
      showSnackbar("Huấn luyện viên mới được thêm thành công.", "success");
    } catch (err: any) {
      console.error("Error adding staff:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Đã xảy ra lỗi khi thêm nhân viên.";
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
          <div className="bg-[red]">Staff Management</div>
          <button
            className="button primary-button add-btn"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
            onClick={handleAdd}
          >
            Add Staff
          </button>
        </div>
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
              <p>Đang tải danh sách nhân viên...</p>
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
                  {currentStaffs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-message">
                        <div className="empty-state">
                          <p>Không tìm thấy nhân viên nào</p>
                          <p className="empty-subtitle">
                            Hiện tại chưa có nhân viên nào trong hệ thống.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentStaffs.map((staff, index) => (
                      <tr
                        key={staff.userId}
                        style={{
                          backgroundColor:
                            staff.status === "INACTIVE"
                              ? "#ffe6e6"
                              : undefined,
                          color:
                            staff.status === "INACTIVE"
                              ? "#8b0000"
                              : undefined,
                        }}
                      >
                        <td>{(page - 1) * rowsPerPage + index + 1}</td>
                        <td>{staff.userName}</td>
                        <td>{staff.email}</td>
                        <td>{staff.fullName}</td>
                        <td>{staff.phoneNumber}</td>
                        <td>{staff.gender}</td>
                        <td>
                          {staff.status === "INACTIVE" ? (
                            <strong>INACTIVE</strong>
                          ) : (
                            <>
                              <button className="action-button edit-button">
                                Edit
                              </button>
                              <button
                                className="action-button delete-button"
                                onClick={() => handleDelete(staff)}
                                disabled={isDeleting}
                              >
                                {isDeleting &&
                                staffToDelete?.userId === staff.userId ? (
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
            Bạn có chắc muốn xóa nhân viên{" "}
            <strong>{staffToDelete?.userName}</strong> không?
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

        {/* Add Staff Popup */}
        <PopUpDialog
          isOpen={showAddModal}
          title="Add Staff"
          onClose={() => setShowAddModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={newStaff.userName}
              onChange={(e) =>
                setNewStaff({ ...newStaff, userName: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={newStaff.email}
              onChange={(e) => {
                setNewStaff({ ...newStaff, email: e.target.value });
                setEmailError("");
              }}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={newStaff.fullName}
              onChange={(e) =>
                setNewStaff({ ...newStaff, fullName: e.target.value })
              }
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={newStaff.phoneNumber}
              onChange={(e) =>
                setNewStaff({ ...newStaff, phoneNumber: e.target.value })
              }
            />
            <TextField
              label="Password (leave empty for DefaultPassword123)"
              type="password"
              variant="outlined"
              fullWidth
              value={newStaff.password}
              onChange={(e) => {
                setNewStaff({ ...newStaff, password: e.target.value });
                setPasswordError("");
              }}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={newStaff.gender}
                label="Gender"
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
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
