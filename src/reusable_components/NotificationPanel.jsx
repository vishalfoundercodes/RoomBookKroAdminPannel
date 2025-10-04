// NotificationPanel.jsx - Notification panel component
import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import Card from './Card';

const NotificationPanel = ({ 
  title = "Notifications", 
  notifications,
  allowDismiss = true,
  maxItems = 5 
}) => {
  const defaultNotifications = [
    {
      id: 1,
      type: "success",
      title: "Payment Received",
      message: "Payment of $99 received from John Doe",
      time: "5 min ago",
      read: false
    },
    {
      id: 2,
      type: "warning",
      title: "Low Stock Alert",
      message: "Product inventory running low for Premium Plan",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      type: "info",
      title: "System Update",
      message: "New features have been deployed successfully",
      time: "2 hours ago",
      read: true
    },
    {
      id: 4,
      type: "error",
      title: "Failed Login Attempt",
      message: "Multiple failed login attempts detected",
      time: "3 hours ago",
      read: true
    }
  ];

  const [notificationList, setNotificationList] = useState(notifications || defaultNotifications);

  const getNotificationIcon = (type) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
      error: AlertCircle
    };
    return icons[type] || Info;
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: "text-green-600 bg-green-50",
      warning: "text-yellow-600 bg-yellow-50",
      info: "text-blue-600 bg-blue-50",
      error: "text-red-600 bg-red-50"
    };
    return colors[type] || "text-gray-600 bg-gray-50";
  };

  const dismissNotification = (id) => {
    setNotificationList(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <Card 
      title={`${title} ${unreadCount > 0 ? `(${unreadCount})` : ''}`} 
      icon={Bell}
    >
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notificationList.slice(0, maxItems).map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colorClass = getNotificationColor(notification.type);
          
          return (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-l-4 border-l-blue-500 shadow-sm'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                    {allowDismiss && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {notificationList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No notifications</p>
          </div>
        )}
      </div>
      
      {notificationList.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Notifications
          </button>
        </div>
      )}
    </Card>
  );
};

export default NotificationPanel;