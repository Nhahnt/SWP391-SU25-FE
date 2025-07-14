import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const roleData = [
  { name: "Members", value: 300 },
  { name: "Coaches", value: 20 },
  { name: "Staff", value: 10 },
  { name: "Admins", value: 5 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function RoleDistributionPieChart() {
  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h4>User Roles</h4>
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
    </div>
  );
}