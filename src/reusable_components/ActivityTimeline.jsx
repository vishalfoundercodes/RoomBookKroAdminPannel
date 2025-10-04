// ActivityTimeline.jsx - Activity timeline component
import React from 'react';
import { Clock, User, ShoppingCart, AlertTriangle, Settings } from 'lucide-react';
import Card from './Card';

const ActivityTimeline = ({ 
  title = "Recent Activity", 
  activities, 
  maxItems = 10,
  showIcons = true 
}) => {
  const defaultActivities = [
    { 
      id: 1, 
      type: "user", 
      message: "New user registered", 
      time: "2 min ago", 
      color: "bg-green-500",
      icon: User 
    },
    { 
      id: 2, 
      type: "order", 
      message: "Order #1234 completed", 
      time: "15 min ago", 
      color: "bg-blue-500",
      icon: ShoppingCart 
    },
    { 
      id: 3, 
      type: "alert", 
      message: "Server maintenance scheduled", 
      time: "1 hour ago", 
      color: "bg-yellow-500",
      icon: AlertTriangle 
    },
    { 
      id: 4, 
      type: "user", 
      message: "User profile updated", 
      time: "2 hours ago", 
      color: "bg-purple-500",
      icon: Settings 
    },
    { 
      id: 5, 
      type: "order", 
      message: "Payment received for order #1235", 
      time: "3 hours ago", 
      color: "bg-green-500",
      icon: ShoppingCart 
    },
  ];

  const timelineData = (activities || defaultActivities).slice(0, maxItems);

  return (
    <Card title={title} icon={Clock}>
      <div className="space-y-4">
        {timelineData.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-3">
            {showIcons ? (
              <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                {activity.icon && <activity.icon className="w-4 h-4 text-white" />}
              </div>
            ) : (
              <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`}></div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            {index < timelineData.length - 1 && !showIcons && (
              <div className="absolute left-[11px] w-px h-6 bg-gray-200 mt-4"></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityTimeline;