import { useEffect, useState } from "react";
import DashboardSidebar from "../../../components/Sidebar";
import axios from "axios";
import "./CoachesList.css";

interface Coach {
  user_id: number;
  userName: string;
  email: string;
  full_name: string;
}

function Popup({ isOpen, title, onClose, children, style }: { isOpen: boolean; title?: string; onClose: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  if (!isOpen) return null;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" style={style} onClick={e => e.stopPropagation()}>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {children}
        <button
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function CoachesList() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<Coach | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoach, setNewCoach] = useState({ userName: "", email: "", full_name: "", phoneNumber: "", password: "" });

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8082/api/admin/accounts/coaches",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoaches(res.data);
    } catch (err) {
      console.error("Failed to fetch coaches: ", err);
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
      await axios.delete(
        `http://localhost:8082/api/admin/account/${coachToDelete.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        "http://localhost:8082/api/admin/create-account",
        {
          userName: newCoach.userName,
          email: newCoach.email,
          fullName: newCoach.full_name,
          phoneNumber: newCoach.phoneNumber,
          password: newCoach.password ? newCoach.password : "DefaultPassword123",
          role: "COACH",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowAddModal(false);
      setNewCoach({ userName: "", email: "", full_name: "", phoneNumber: "", password: "" });
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
            style={{ backgroundColor: '#007bff', color: '#fff' }}
            onClick={handleAdd}
          >
            Add Coach
          </button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach, index) => (
                <tr key={coach.user_id}>
                  <td>{index + 1}</td>
                  <td>{coach.userName}</td>
                  <td>{coach.email}</td>
                  <td>{coach.full_name}</td>
                  <td>
                    <button className="action-button edit-button">Edit</button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(coach)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Popup */}
        <Popup
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          onClose={() => setShowDeleteModal(false)}
        >
          <p>Are you sure you want to delete <b>{coachToDelete?.userName}</b>?</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <button className="delete-btn" onClick={confirmDelete}>Yes, Delete</button>
            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </Popup>

        {/* Add Coach Popup */}
        <Popup
          isOpen={showAddModal}
          title="Add Coach"
          onClose={() => setShowAddModal(false)}
          style={{ minWidth: 420, maxWidth: 500 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              className="add-popup-input"
              type="text"
              placeholder="Username"
              value={newCoach.userName}
              onChange={e => setNewCoach({ ...newCoach, userName: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="email"
              placeholder="Email"
              value={newCoach.email}
              onChange={e => setNewCoach({ ...newCoach, email: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="text"
              placeholder="Full Name"
              value={newCoach.full_name}
              onChange={e => setNewCoach({ ...newCoach, full_name: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="text"
              placeholder="Phone Number"
              value={newCoach.phoneNumber}
              onChange={e => setNewCoach({ ...newCoach, phoneNumber: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="password"
              placeholder="Password (leave empty for DefaultPassword123)"
              value={newCoach.password}
              onChange={e => setNewCoach({ ...newCoach, password: e.target.value })}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <button className="add-btn-modal" onClick={confirmAdd}>Add</button>
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}
