import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
    gender: "",
  });

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
      console.error("Failed to fetch staffs: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (staff: Staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/admin/account/${staffToDelete.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteModal(false);
      setStaffToDelete(null);
      fetchStaffs();
    } catch (err) {
      console.error("Failed to delete staff: ", err);
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
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
    } catch (err) {
      console.error("Failed to add staff: ", err);
    }
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
              <div className="loading-spinner"></div>
              <p>Loading staffs...</p>
            </div>
          ) : (
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
                {staffs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-message">
                      <div className="empty-state">
                        <p>No staffs found</p>
                        <p className="empty-subtitle">
                          There are currently no staffs in the system.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  staffs.map((staff, index) => (
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
                      <td>{index + 1}</td>
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
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Confirmation Popup */}
        <PopUpDialog
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          onClose={() => setShowDeleteModal(false)}
        >
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{staffToDelete?.userName}</strong>?
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
              gap: 8,
            }}
          >
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Yes, Delete
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
              onChange={(e) =>
                setNewStaff({ ...newStaff, email: e.target.value })
              }
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
              onChange={(e) =>
                setNewStaff({ ...newStaff, password: e.target.value })
              }
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
                <MenuItem value="" disabled><em>Select Gender</em></MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </Select>
            </FormControl>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Button variant="contained" onClick={confirmAdd}>
                Add
              </Button>
              <Button variant="outlined" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </PopUpDialog>
      </div>
    </div>
  );
}
