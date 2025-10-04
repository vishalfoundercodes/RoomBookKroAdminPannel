// ReportsCard.jsx - Reports summary component
import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Eye, } from 'lucide-react';
import Card from './Card';

const ReportsCard = ({ 
  title = "Reports & Analytics", 
  reports,
  showDownloadAll = true 
}) => {
  const defaultReports = [
    { 
      id: 1, 
      name: "Monthly Sales Report", 
      type: "Sales", 
      generated: "2024-01-15", 
      size: "2.3 MB",
      views: 45,
      status: "Ready",
    //   Target:"11"
    },
    { 
      id: 2, 
      name: "User Analytics Report", 
      type: "Analytics", 
      generated: "2024-01-14", 
      size: "1.8 MB",
      views: 32,
      status: "Ready"
    },
    { 
      id: 3, 
      name: "Financial Summary", 
      type: "Finance", 
      generated: "2024-01-13", 
      size: "5.2 MB",
      views: 78,
      status: "Processing"
    },
    { 
      id: 4, 
      name: "Performance Metrics", 
      type: "Performance", 
      generated: "2024-01-12", 
      size: "3.1 MB",
      views: 56,
      status: "Ready"
    },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const reportsData = reports || defaultReports;

  const getStatusColor = (status) => {
    const colors = {
      'Ready': 'bg-green-100 text-green-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Sales': TrendingUp,
      'Analytics': Eye,
      'Finance': FileText,
    //   'Performance': Target
    };
    return icons[type] || FileText;
  };

  return (
    <Card 
      title={title} 
      icon={FileText}
      action={
        <div className="flex gap-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {showDownloadAll && (
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {reportsData.map((report) => {
          const TypeIcon = getTypeIcon(report.type);
          return (
            <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TypeIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.generated}
                    </span>
                    <span>{report.size}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {report.views} views
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                {report.status === 'Ready' && (
                  <button className="p-1 text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Reports
        </button>
      </div>
    </Card>
  );
};

export default ReportsCard;