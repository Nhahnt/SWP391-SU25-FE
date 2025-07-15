import { useEffect, useState } from "react";
import DashboardSidebar from "../../../components/Sidebar";
import axios from "axios";
import "./StaffsList.css";

interface Staff {
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

export default function StaffsList() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ userName: "", email: "", full_name: "", phoneNumber: "", password: "" });

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8082/api/admin/accounts/staff",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStaffs(res.data);
    } catch (err) {
      console.error("Failed to fetch staffs: ", err);
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
      await axios.delete(
        `http://localhost:8082/api/admin/account/${staffToDelete.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        "http://localhost:8082/api/admin/create-account",
        {
          userName: newStaff.userName,
          email: newStaff.email,
          fullName: newStaff.full_name,
          phoneNumber: newStaff.phoneNumber,
          password: newStaff.password ? newStaff.password : "DefaultPassword123",
          role: "STAFF",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowAddModal(false);
      setNewStaff({ userName: "", email: "", full_name: "", phoneNumber: "", password: "" });
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
            style={{ backgroundColor: '#007bff', color: '#fff' }}
            onClick={handleAdd}
          >
            Add Staff
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
              {staffs.map((staff, index) => (
                <tr key={staff.user_id}>
                  <td>{index + 1}</td>
                  <td>{staff.userName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.full_name}</td>
                  <td>
                    <button className="action-button edit-button">Edit</button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(staff)}
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
          <p>Are you sure you want to delete <b>{staffToDelete?.userName}</b>?</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <button className="delete-btn" onClick={confirmDelete}>Yes, Delete</button>
            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </Popup>

        {/* Add Staff Popup */}
        <Popup
          isOpen={showAddModal}
          title="Add Staff"
          onClose={() => setShowAddModal(false)}
          style={{ minWidth: 420, maxWidth: 500 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              className="add-popup-input"
              type="text"
              placeholder="Username"
              value={newStaff.userName}
              onChange={e => setNewStaff({ ...newStaff, userName: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="email"
              placeholder="Email"
              value={newStaff.email}
              onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="text"
              placeholder="Full Name"
              value={newStaff.full_name}
              onChange={e => setNewStaff({ ...newStaff, full_name: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="text"
              placeholder="Phone Number"
              value={newStaff.phoneNumber}
              onChange={e => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="password"
              placeholder="Password (leave empty for DefaultPassword123)"
              value={newStaff.password}
              onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
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
