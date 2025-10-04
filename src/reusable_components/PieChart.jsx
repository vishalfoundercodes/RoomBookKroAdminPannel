// PieChart.jsx - Reusable pie chart component
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import Card from './Card';

const PieChartComponent = ({ 
  data, 
  title = "Pie Chart", 
  height = 300,
  showLabels = true,
  showLegend = true,
  outerRadius = 80,
  innerRadius = 0 // Set to > 0 for donut chart
}) => {
  const defaultData = [
    { name: 'Desktop', value: 45, color: '#8884d8' },
    { name: 'Mobile', value: 35, color: '#82ca9d' },
    { name: 'Tablet', value: 20, color: '#ffc658' },
  ];

  const chartData = data || defaultData;

  const renderLabel = ({ name, percent }) => 
    showLabels ? `${name} ${(percent * 100).toFixed(0)}%` : '';

  return (
    <Card title={title} icon={PieIcon}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            label={renderLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PieChartComponent;