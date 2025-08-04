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
import "./CoachesList.css";
import PopUpDialog from "../components/PopUpDialog";

interface Coach {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  status: string;
  phoneNumber: string;
  gender: string;
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
    gender: "",
  });

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
      console.error("Failed to fetch coaches: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (coach: Coach) => {
    setCoachToDelete(coach);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!coachToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/admin/account/${coachToDelete.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteModal(false);
      setCoachToDelete(null);
      fetchCoaches();
    } catch (err) {
      console.error("Failed to delete coach: ", err);
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
    } catch (err) {
      console.error("Failed to add coach: ", err);
    }
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
              <div className="loading-spinner"></div>
              <p>Loading coaches...</p>
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
                {coaches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-message">
                      <div className="empty-state">
                        <p>No coaches found</p>
                        <p className="empty-subtitle">
                          There are currently no coaches in the system.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  coaches.map((coach, index) => (
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
                      <td>{index + 1}</td>
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
            <strong>{coachToDelete?.userName}</strong>?
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
              onChange={(e) =>
                setNewCoach({ ...newCoach, email: e.target.value })
              }
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
              onChange={(e) =>
                setNewCoach({ ...newCoach, password: e.target.value })
              }
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
