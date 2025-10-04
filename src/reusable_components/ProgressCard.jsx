// ProgressCard.jsx - Progress tracking card component
import React from 'react';
import { Target } from 'lucide-react';
import Card from './Card';

const ProgressCard = ({ 
  title, 
  current, 
  targets, 
  percentage, 
  color = "blue",
  showValues = true,
  animated = true,
  size = "normal", // normal, small, large
  icon: Icon
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  const sizeClasses = {
    small: "h-1",
    normal: "h-2",
    large: "h-3"
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      
      {showValues && (
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{current}</span>
          <span>{targets}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">Progress</span>
        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
      </div>
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${sizeClasses[size]} rounded-full ${colorClasses[color]} ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </Card>
  );
};

export default ProgressCard;