import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 250 },
  { month: "Apr", users: 320 },
  { month: "May", users: 400 },
];

export default function UserGrowthChart() {
  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h4>User Growth</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={userGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}