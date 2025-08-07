import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const COLORS = ["#00C49F", "#ebd262ff", "#db482eff"];
const API_BASE = "http://localhost:8082/api";

export default function DependencyDistributionPieChart() {
  const [dependencyData, setDependencyData] = useState([
    { name: "LOW", value: 0 },
    { name: "MEDIUM", value: 0 },
    { name: "HIGH", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");

    // Fetch dependency level stats from the correct API endpoint
    axios
      .get(`${API_BASE}/admin/report/dependency-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        if (data && typeof data === 'object') {
          setDependencyData([
            { name: "LOW", value: data.LOW || 0 },
            { name: "MEDIUM", value: data.MEDIUM || 0 },
            { name: "HIGH", value: data.HIGH || 0 },
          ]);
        } else {
          throw new Error("Invalid data format from API");
        }
      })
      .catch((err) => {
        setError("Failed to load dependency distribution data.");
        console.error("API call failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
        minHeight: 300,
      }}
    >
      <h4>User Dependency Levels</h4>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 220,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #c2410c",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 16,
            }}
          />
          <style>{`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
          <span style={{ color: "#888" }}>Loading...</span>
        </div>
      ) : error ? (
        <div style={{ color: "#e53935", textAlign: "center", padding: 24 }}>
          {error}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={dependencyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {dependencyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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