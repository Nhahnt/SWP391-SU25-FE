import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const API_BASE = "http://localhost:8082/api";

export default function RoleDistributionPieChart() {
  const [roleData, setRoleData] = useState([
    { name: "Members", value: 0 },
    { name: "Coaches", value: 0 },
    { name: "Staff", value: 0 },
    { name: "Admins", value: 1 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");
    Promise.all([
      axios.get(`${API_BASE}/admin/accounts/members`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE}/admin/accounts/coaches`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE}/admin/accounts/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([membersRes, coachesRes, staffRes]) => {
        setRoleData([
          { name: "Members", value: Array.isArray(membersRes.data) ? membersRes.data.length : 0 },
          { name: "Coaches", value: Array.isArray(coachesRes.data) ? coachesRes.data.length : 0 },
          { name: "Staff", value: Array.isArray(staffRes.data) ? staffRes.data.length : 0 },
          { name: "Admins", value: 1 },
        ]);
      })
      .catch((err) => {
        setError("Failed to load role distribution data.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee", minHeight: 300 }}>
      <h4>User Roles</h4>
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={220}>
          <CircularProgress sx={{ color: "#c2410c", mb: 2 }} />
          <span style={{ color: "#888" }}>Loading...</span>
        </Box>
      ) : error ? (
        <div style={{ color: "#e53935", textAlign: "center", padding: 24 }}>{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={roleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {roleData.map((entry, index) => (
                <Cell key={`cell-role-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}