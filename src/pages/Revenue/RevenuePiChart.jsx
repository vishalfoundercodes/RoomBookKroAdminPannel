import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getRevenueSplit } from "./RevenueData";

const COLORS = ["#6366f1", "#22c55e", "#f97316"];

export default function RevenuePie({ revenueList }) {
  const data = getRevenueSplit(revenueList);

  return (
    <div className="p-4 bg-white rounded-xl ">
      <h2 className="text-lg font-semibold mb-4">Revenue Distribution</h2>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            className={`cursor-pointer`}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend - Rounded Color Indicators */}
      <div className="mt-0 flex flex-col sm:flex-row gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-0">
            <span
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-sm text-gray-700 font-medium">
              {item.name}
            </span>
            <span>-</span>
            <span className="text-sm text-gray-500"> {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
