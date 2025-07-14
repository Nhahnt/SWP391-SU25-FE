import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const quitPlanData = [
  { name: "Active", value: 60 },
  { name: "Completed", value: 30 },
  { name: "Dropped", value: 10 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function QuitPlanPieChart() {
  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h4>Quit Plan Engagement</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={quitPlanData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {quitPlanData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}