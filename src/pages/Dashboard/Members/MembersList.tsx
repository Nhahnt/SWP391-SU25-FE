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
    gender: "",
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
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
    } catch (err) {
      console.error("Failed to delete member: ", err);
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
    } catch (err) {
      console.error("Failed to add member: ", err);
    }
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
              <div className="loading-spinner"></div>
              <p>Loading members...</p>
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
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-message">
                      <div className="empty-state">
                        <p>No members found</p>
                        <p className="empty-subtitle">
                          There are currently no members in the system.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => (
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
                      <td>{index + 1}</td>
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
        <PopupDialog
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          onClose={() => setShowDeleteModal(false)}
        >
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{memberToDelete?.userName}</strong>?
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
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
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
              onChange={(e) =>
                setNewMember({ ...newMember, password: e.target.value })
              }
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
        </PopupDialog>
      </div>
    </div>
  );
}
