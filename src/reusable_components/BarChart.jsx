// BarChart.jsx - Reusable bar chart component
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';
import Card from './Card';

const BarChartComponent = ({ 
  data, 
  title = "Bar Chart", 
  height = 300,
  bars = [
    { dataKey: "sales", fill: "#8884d8", name: "Sales" },
    { dataKey: "revenue", fill: "#82ca9d", name: "Revenue" }
  ],
  showGrid = true,
  showLegend = true,
  orientation = "vertical" // vertical or horizontal
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
  console.log("chartData:", chartData);


  return (
    <Card title={title} icon={BarChart3}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}

          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip />
          {showLegend && <Legend />}

          {bars.map((bar, index) => (
            <Bar key={index} dataKey={bar.dataKey} name={bar.name}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={bar.colors ? bar.colors[i] : bar.fill || "#8884d8"}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BarChartComponent;