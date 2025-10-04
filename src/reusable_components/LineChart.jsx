// LineChart.jsx - Reusable line chart component
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Card from './Card';

const LineChartComponent = ({ 
  data, 
  title = "Line Chart", 
  height = 300, 
  lines = [
    { dataKey: "sales", stroke: "#8884d8", name: "Sales" },
    { dataKey: "users", stroke: "#82ca9d", name: "Users" }
  ],
  showGrid = true,
  showLegend = true 
}) => {
  const defaultData = [
    { name: 'Jan', sales: 4000, users: 2400, revenue: 2400 },
    { name: 'Feb', sales: 3000, users: 1398, revenue: 2210 },
    { name: 'Mar', sales: 2000, users: 9800, revenue: 2290 },
    { name: 'Apr', sales: 2780, users: 3908, revenue: 2000 },
    { name: 'May', sales: 1890, users: 4800, revenue: 2181 },
    { name: 'Jun', sales: 2390, users: 3800, revenue: 2500 },
  ];

  const chartData = data || defaultData;

  return (
    <Card title={title} icon={TrendingUp}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          {lines.map((line, index) => (
            <Line 
              key={index}
              type="monotone" 
              dataKey={line.dataKey} 
              stroke={line.stroke} 
              strokeWidth={2}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default LineChartComponent;