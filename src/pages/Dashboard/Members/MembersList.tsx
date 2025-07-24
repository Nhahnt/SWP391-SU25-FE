import { useEffect, useState } from "react";
import DashboardSidebar from "../../../components/Sidebar";
import axios from "axios";
import "./MembersList.css";

interface Member {
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

const API_BASE = "http://localhost:8082/api";

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ userName: "", email: "", full_name: "", phoneNumber: "", password: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/admin/accounts/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      await axios.delete(
        `${API_BASE}/admin/account/${memberToDelete.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          fullName: newMember.full_name,
          phoneNumber: newMember.phoneNumber,
          password: newMember.password ? newMember.password : "DefaultPassword123",
          role: "MEMBER",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowAddModal(false);
      setNewMember({ userName: "", email: "", full_name: "", phoneNumber: "", password: "" });
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
            style={{ backgroundColor: '#007bff', color: '#fff' }}
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-message">
                      <div className="empty-state">
                        <p>No members found</p>
                        <p className="empty-subtitle">There are currently no members in the system.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => (
                    <tr key={member.user_id}>
                      <td>{index + 1}</td>
                      <td>{member.userName}</td>
                      <td>{member.email}</td>
                      <td>{member.full_name}</td>
                      <td>
                        <button className="action-button edit-button">Edit</button>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDelete(member)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Confirmation Popup */}
        <Popup
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          onClose={() => setShowDeleteModal(false)}
        >
          <p>Are you sure you want to delete <b>{memberToDelete?.userName}</b>?</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <button className="delete-btn" onClick={confirmDelete}>Yes, Delete</button>
            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </Popup>

        {/* Add Member Popup */}
        <Popup
          isOpen={showAddModal}
          title="Add Member"
          onClose={() => setShowAddModal(false)}
          style={{ minWidth: 420, maxWidth: 500 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              className="add-popup-input"
              type="text"
              placeholder="Username"
              value={newMember.userName}
              onChange={e => setNewMember({ ...newMember, userName: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="email"
              placeholder="Email"
              value={newMember.email}
              onChange={e => setNewMember({ ...newMember, email: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="text"
              placeholder="Full Name"
              value={newMember.full_name}
              onChange={e => setNewMember({ ...newMember, full_name: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="text"
              placeholder="Phone Number"
              value={newMember.phoneNumber}
              onChange={e => setNewMember({ ...newMember, phoneNumber: e.target.value })}
            />
            <input
              className="add-popup-input"
              type="password"
              placeholder="Password (leave empty for DefaultPassword123)"
              value={newMember.password}
              onChange={e => setNewMember({ ...newMember, password: e.target.value })}
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
