import {
  CircularProgress,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; // Import the CSS file

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const usernameStr = localStorage.getItem("username");
        const response = await axios.get(
          `http://localhost:8082/api/account/${usernameStr}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (err: any) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="p-body">
      <div className="p-body-inner">
        <div className="p-body-main">
          {/* Profile Header Section */}
          <div className="profile-header network-pattern">
            {/* Profile Picture */}
            <span className="profile-picture-container">
              <span className="profile-picture-wrapper">
                <div className="profile-picture-border">
                  <img 
                    src={user.profileImage || "https://placehold.co/150x150/0073b1/ffffff?text=" + (user.fullName ? user.fullName.charAt(0) : user.userName.charAt(0))} 
                    alt={`${user.fullName || user.userName} profile`} 
                    className="profile-picture"
                  />
                </div>
              </span>
            </span>
          </div>

          {/* Profile Info Section */}
          <div className="profile-card">
            <div className="profile-main-info">
              <div className="profile-name-details">
                <h1 className="member-full-name">
                  <span className="member-full-name-nameWrapper">
                    {user.fullName || user.username}
                  </span>
                </h1>
                <div className="member-username">
                  <span className="member-username-nameWrapper">
                    @{user.userName || user.username || "No username"}
                  </span>
                </div>
                <div className="role-banner">
                  <em className="rolebanner rolebanner--mem">
                    <span className="rolebanner-before"></span>
                    <strong>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Member"}</strong>
                    <span className="rolebanner-after"></span>
                  </em>
                </div>
              </div>
              <div className="profile-actions">
                <Button 
                  className="button-secondary"
                  variant="outlined"
                  sx={{
                    borderColor: "#9ca3af",
                    color: "#374151",
                    borderRadius: "9999px",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      borderColor: "#9ca3af",
                    },
                  }}
                >
                  <svg className="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="user-contact-section">
              <div className="user-contact-item">
                <span className="contact">📍 {user.address || "No address provided"}</span>
              </div>
              <div className="user-contact-item">
                <span className="contact">📞 {user.phone || "No phone provided"}</span>
              </div>
              <div className="user-contact-item">
                <span className="contact">✉️ {user.email || "No email provided"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
