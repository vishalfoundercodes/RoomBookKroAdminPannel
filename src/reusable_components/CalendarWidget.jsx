// CalendarWidget.jsx - Calendar widget component
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Card from './Card';

const CalendarWidget = ({ 
  title = "Calendar", 
  events,
  showMiniCalendar = true,
  showUpcomingEvents = true 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const defaultEvents = [
    { id: 1, title: "Team Meeting", date: "2024-01-15", time: "10:00 AM", type: "meeting" },
    { id: 2, title: "Product Launch", date: "2024-01-16", time: "2:00 PM", type: "important" },
    { id: 3, title: "Client Call", date: "2024-01-17", time: "11:00 AM", type: "call" },
    { id: 4, title: "Code Review", date: "2024-01-18", time: "3:00 PM", type: "meeting" }
  ];

  const eventData = events || defaultEvents;
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: 'bg-blue-500',
      important: 'bg-red-500',
      call: 'bg-green-500',
      task: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const hasEvent = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventData.some(event => event.date === dateString);
  };

  const upcomingEvents = eventData
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <Card title={title} icon={Calendar}>
      <div className="space-y-4">
        {showMiniCalendar && (
          <div>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-semibold text-gray-900">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              
              {/* Calendar days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                const hasEventToday = hasEvent(day);
                
                return (
                  <div 
                    key={day} 
                    className={`p-2 text-sm cursor-pointer hover:bg-gray-100 rounded relative ${
                      isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                    }`}
                  >
                    {day}
                    {hasEventToday && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showUpcomingEvents && (
          <div className={showMiniCalendar ? "pt-4 border-t border-gray-200" : ""}>
            <h4 className="font-medium text-gray-900 mb-3">Upcoming Events</h4>
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CalendarWidget;