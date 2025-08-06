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
} from "@mui/material";
import DashboardSidebar from "../../../components/Sidebar";
import axios from "axios";
import "./MembersList.css";
import PopupDialog from "../components/PopUpDialog";

interface Member {
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

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
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
  const totalPages = Math.ceil(members.length / rowsPerPage);
  const currentMembers = members.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/admin/accounts/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members: ", err);
      showSnackbar("Không thể tải danh sách thành viên.", "error");
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

  const handleDelete = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/admin/account/${memberToDelete.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteModal(false);
      setMemberToDelete(null);
      fetchMembers();
      showSnackbar("Thành viên đã được xóa thành công.", "success");
    } catch (err: any) {
      console.error("Failed to delete member: ", err);
      const errorMessage =
        err.response?.data?.message || "Đã xảy ra lỗi khi xóa thành viên.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
    // Reset validation errors when opening the modal
    setEmailError("");
    setPasswordError("");
  };

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      setEmailError("Email không hợp lệ.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (newMember.password && newMember.password.length < 8) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
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
          userName: newMember.userName,
          email: newMember.email,
          fullName: newMember.fullName,
          phoneNumber: newMember.phoneNumber,
          password: newMember.password
            ? newMember.password
            : "DefaultPassword123",
          gender: newMember.gender,
          role: "MEMBER",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowAddModal(false);
      setNewMember({
        userName: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        password: "",
        gender: "MALE",
      });
      fetchMembers();
      showSnackbar("Thành viên mới đã được thêm thành công.", "success");
    } catch (err: any) {
      console.error("Failed to add member: ", err);
      const errorMessage =
        err.response?.data?.message || "Đã xảy ra lỗi khi thêm thành viên.";
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
          <div className="bg-[red]">Member Management</div>
          <button
            className="button primary-button add-btn"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
            onClick={handleAdd}
          >
            Add Member
          </button>
        </div>
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
              <p>Đang tải danh sách thành viên...</p>
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
                  {currentMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-message">
                        <div className="empty-state">
                          <p>Không tìm thấy thành viên nào</p>
                          <p className="empty-subtitle">
                            Hiện tại chưa có thành viên nào trong hệ thống.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentMembers.map((member, index) => (
                      <tr
                        key={member.userId}
                        style={{
                          backgroundColor:
                            member.status === "DEACTIVATED"
                              ? "#ffe6e6"
                              : undefined,
                          color:
                            member.status === "DEACTIVATED"
                              ? "#8b0000"
                              : undefined,
                        }}
                      >
                        <td>{(page - 1) * rowsPerPage + index + 1}</td>
                        <td>{member.userName}</td>
                        <td>{member.email}</td>
                        <td>{member.fullName}</td>
                        <td>{member.phoneNumber}</td>
                        <td>{member.gender}</td>
                        <td>
                          {member.status === "DEACTIVATED" ? (
                            <strong>DEACTIVATED</strong>
                          ) : (
                            <>
                              <button className="action-button edit-button">
                                Edit
                              </button>
                              <button
                                className="action-button delete-button"
                                onClick={() => handleDelete(member)}
                                disabled={isDeleting}
                              >
                                {isDeleting &&
                                memberToDelete?.userId === member.userId ? (
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
        <PopupDialog
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          onClose={() => setShowDeleteModal(false)}
        >
          <Typography>
            Bạn có chắc muốn xóa thành viên{" "}
            <strong>{memberToDelete?.userName}</strong> không?
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
        </PopupDialog>

        {/* Add Member Popup */}
        <PopupDialog
          isOpen={showAddModal}
          title="Add Member"
          onClose={() => setShowAddModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={newMember.userName}
              onChange={(e) =>
                setNewMember({ ...newMember, userName: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={newMember.email}
              onChange={(e) => {
                setNewMember({ ...newMember, email: e.target.value });
                setEmailError("");
              }}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={newMember.fullName}
              onChange={(e) =>
                setNewMember({ ...newMember, fullName: e.target.value })
              }
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={newMember.phoneNumber}
              onChange={(e) =>
                setNewMember({ ...newMember, phoneNumber: e.target.value })
              }
            />
            <TextField
              label="Password (leave empty for DefaultPassword123)"
              type="password"
              variant="outlined"
              fullWidth
              value={newMember.password}
              onChange={(e) => {
                setNewMember({ ...newMember, password: e.target.value });
                setPasswordError("");
              }}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={newMember.gender}
                label="Gender"
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
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
        </PopupDialog>

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
