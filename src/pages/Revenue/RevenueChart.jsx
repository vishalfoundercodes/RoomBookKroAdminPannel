import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getMonthlyRevenue } from "./RevenueData";

export default function RevenueChart({ revenueList }) {
  const data = getMonthlyRevenue(revenueList);

  return (
    <div className="p-4 bg-white rounded-xl ">
      <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>

      <ResponsiveContainer
        width="100%"
        height={310}
      >
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="finalAmount"
            fill="#4f46e5"
            radius={[6, 6, 0, 0]}
            className={`cursor-pointer`}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
