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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-2 rounded-lg shadow-lg text-white"
        style={{
          background: "#4F46E5",
          boxShadow: "0px 0px 10px rgba(79, 70, 229, 0.6)",
        }}
      >
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm">₹ {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ revenueList }) {
  const data = getMonthlyRevenue(revenueList);

  return (
    <div className="p-4 bg-white rounded-xl ">
      <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>

      <ResponsiveContainer width="100%" height={310}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          {/* <Tooltip /> */}
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="finalAmount"
            fill="#4f46e5"
            radius={[6, 6, 0, 0]}
            className={`cursor-pointer`}
            // activeBar={{
            //   fill: "#4F46E5",
            //   opacity: 0.85, // light tinted highlight instead of gray
            // }}
              activeBar={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
