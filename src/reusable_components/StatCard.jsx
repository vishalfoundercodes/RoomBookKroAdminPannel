// StatCard.jsx - Statistics card with trend indicators
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const StatCard = ({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  color = "blue",
  route,
  titleHighlight,
}) => {
  const navigate = useNavigate();
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <Card>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => navigate(route || "#",{ state: { highlight: title }})}
      >
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === "positive" ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;