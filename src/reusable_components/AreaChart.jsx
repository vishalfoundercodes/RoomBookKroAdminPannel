// AreaChart.jsx - Reusable area chart component
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import Card from './Card';

const AreaChartComponent = ({ 
  data, 
  title = "Area Chart", 
  height = 300,
  areas = [
    { dataKey: "sales", stackId: "1", stroke: "#8884d8", fill: "#8884d8", name: "Sales" },
    { dataKey: "users", stackId: "1", stroke: "#82ca9d", fill: "#82ca9d", name: "Users" }
  ],
  showGrid = true,
  showLegend = true,
  fillOpacity = 0.6
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
    <Card title={title} icon={Activity}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          {areas.map((area, index) => (
            <Area 
              key={index}
              type="monotone" 
              dataKey={area.dataKey} 
              stackId={area.stackId}
              stroke={area.stroke} 
              fill={area.fill} 
              fillOpacity={fillOpacity}
              name={area.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AreaChartComponent;