import { useEffect, useState, SyntheticEvent } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DashboardSidebar from "../../../components/Sidebar";

import AddModal from "../shared/AddModal";
import EditModal from "../shared/EditModal";
import DeleteModal from "../shared/DeleteModal";

import "../RoleList.css";

interface Member {
  userId: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isVip: boolean;
  gender: string;
  status: string;
}

const API_BASE = "http://localhost:8082/api";

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const memberFormFields = [
    { name: "userName", label: "Tên đăng nhập", type: "text", disabled: false },
    { name: "fullName", label: "Tên đầy đủ", type: "text", disabled: false },
    { name: "email", label: "Email", type: "text", disabled: false },
    {
      name: "phoneNumber",
      label: "Số điện thoại",
      type: "text",
      disabled: false,
    },
    { name: "password", label: "Mật khẩu", type: "password", disabled: false },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { value: "MALE", label: "Nam" },
        { value: "FEMALE", label: "Nữ" },
      ],
      disabled: false,
    },
  ];

  const memberEditFormFields = [
    { name: "userName", label: "Tên đăng nhập", type: "text", disabled: true },
    { name: "fullName", label: "Tên đầy đủ", type: "text", disabled: false },
    { name: "email", label: "Email", type: "text", disabled: false },
    {
      name: "phoneNumber",
      label: "Số điện thoại",
      type: "text",
      disabled: false,
    },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { value: "MALE", label: "Nam" },
        { value: "FEMALE", label: "Nữ" },
      ],
      disabled: false,
    },
    {
      name: "isVip",
      label: "Trạng thái VIP",
      type: "select",
      options: [
        { value: "true", label: "VIP" },
        { value: "false", label: "Thường" },
      ],
      disabled: false,
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: "active", label: "Hoạt động" },
        { value: "DEACTIVATED", label: "Không hoạt động" },
      ],
      disabled: false,
    },
  ];

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

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event?: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddMember = async (newMember: any) => {
    setIsAdding(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/admin/create-account`,
        { ...newMember, role: "MEMBER" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowAddModal(false);
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

  const handleUpdateMember = async (updatedMember: any) => {
    if (!selectedMember) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/admin/update-account/${selectedMember.userId}`,
        updatedMember,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditModal(false);
      fetchMembers();
      showSnackbar(
        "Thông tin thành viên đã được cập nhật thành công.",
        "success"
      );
    } catch (err: any) {
      console.error("Failed to update member: ", err);
      const errorMessage =
        err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thành viên.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/admin/account/${selectedMember.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteModal(false);
      setSelectedMember(null);
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

  const handleRowClick = (member: Member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  return (
    <main className="dashboard-container">
      <div className="db-sidebar">
        <DashboardSidebar />
      </div>

      <div className="db-content">
        <>
          <div className="members-list-container">
            <div className="header-and-actions">
              <Typography variant="h4" className="page-title">
                Quản lý Thành viên
              </Typography>
              <div className="actions-container">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Thêm Thành viên mới
                </Button>
              </div>
            </div>
            {loading ? (
              <div className="loading-container">
                <CircularProgress />
              </div>
            ) : (
              <div className="table-container">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên đăng nhập</TableCell>
                        <TableCell>Tên đầy đủ</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Số điện thoại</TableCell>
                        <TableCell>Trạng thái VIP</TableCell>
                        <TableCell>Giới tính</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow
                          key={member.userId}
                          hover
                          onClick={() => handleRowClick(member)}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell>{member.userName}</TableCell>
                          <TableCell>{member.fullName}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phoneNumber}</TableCell>
                          <TableCell>
                            {member.isVip ? (
                              <span className="vip-status-chip">VIP</span>
                            ) : (
                              "Thường"
                            )}
                          </TableCell>
                          <TableCell>{member.gender}</TableCell>
                          <TableCell>
                            <span
                              className={`status-chip ${
                                member.status &&
                                member.status.toLowerCase() === "active"
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >
                              {member.status.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMember(member);
                                setShowEditModal(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMember(member);
                                setShowDeleteModal(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}

            <AddModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onConfirm={handleAddMember}
              isLoading={isAdding}
              formTitle="Thêm Thành viên mới"
              fields={memberFormFields}
            />

            {selectedMember && (
              <>
                <EditModal
                  isOpen={showEditModal}
                  onClose={() => setShowEditModal(false)}
                  onUpdate={handleUpdateMember}
                  isLoading={isUpdating}
                  data={selectedMember}
                  formTitle="Chỉnh sửa Thành viên"
                  fields={memberEditFormFields}
                />
                <DeleteModal
                  isOpen={showDeleteModal}
                  onClose={() => setShowDeleteModal(false)}
                  onConfirm={handleDeleteMember}
                  isLoading={isDeleting}
                  itemName={selectedMember.fullName}
                />
              </>
            )}

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
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
        </>
      </div>
    </main>
  );
}
