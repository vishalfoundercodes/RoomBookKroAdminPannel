// DataTable.jsx - Reusable data table component
import React, { useState } from 'react';
import { Filter, Download, MoreVertical, Search } from 'lucide-react';
import Card from './Card';

const DataTable = ({ 
  title = "Data Table", 
  data, 
  columns, 
  showActions = true,
  showSearch = true,
  showFilters = true,
  itemsPerPage = 10 
}) => {
  const defaultData = [
    { id: 1, customer: "John Doe", product: "Premium Plan", amount: "$99", status: "Completed", date: "2024-01-15" },
    { id: 2, customer: "Jane Smith", product: "Basic Plan", amount: "$29", status: "Pending", date: "2024-01-14" },
    { id: 3, customer: "Mike Johnson", product: "Pro Plan", amount: "$59", status: "Completed", date: "2024-01-13" },
    { id: 4, customer: "Sarah Wilson", product: "Premium Plan", amount: "$99", status: "Cancelled", date: "2024-01-12" },
    { id: 5, customer: "Tom Brown", product: "Basic Plan", amount: "$29", status: "Completed", date: "2024-01-11" },
  ];

  const defaultColumns = [
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const tableData = data || defaultData;
  const tableColumns = columns || defaultColumns;

  // Filter data based on search
  const filteredData = tableData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Inactive': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      title={title} 
      action={
        <div className="flex gap-2">
          {showFilters && (
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Download className="w-4 h-4" />
          </button>
        </div>
      }
    >
      {showSearch && (
        <div className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {tableColumns.map((column) => (
                <th 
                  key={column.key} 
                  className={`text-left py-3 px-4 font-medium text-gray-700 ${
                    column.sortable ? 'cursor-pointer hover:text-gray-900' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                {tableColumns.map((column) => (
                  <td key={column.key} className="py-3 px-4">
                    {column.key === 'status' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row[column.key])}`}>
                        {row[column.key]}
                      </span>
                    ) : (
                      <span className="text-gray-900">{row[column.key]}</span>
                    )}
                  </td>
                ))}
                {showActions && (
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data found
        </div>
      )}
    </Card>
  );
};

export default DataTable;