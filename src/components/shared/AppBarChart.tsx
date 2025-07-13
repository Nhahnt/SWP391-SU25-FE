// AppBarChart.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

type ChartItem = {
  name: string;
  uv: number;
  fill?: string;
};

type AppBarChartProps = {
  data: ChartItem[];
  target?: number;
};

export function AppBarChart({ data, target }: AppBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} cigarettes`, "Amount"]} />

        <Legend />
        <Bar
          dataKey="uv"
          label={{ position: "top", fill: "#374151", fontSize: 12 }}
          name="Cigarettes"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                target !== undefined
                  ? entry.uv > target
                    ? "#dc2626" // đỏ cháy đất
                    : "#16a34a" // xanh emerald
                  : entry.fill || "#8884d8"
              }
            />
          ))}
        </Bar>

        {target !== undefined && (
          <ReferenceLine y={target} stroke="#facc15" strokeDasharray="6 3" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
