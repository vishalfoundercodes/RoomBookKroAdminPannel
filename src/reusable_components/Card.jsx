
import React from 'react';

const Card = ({ children, className = "", title, subtitle, icon: Icon, action }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-2 ${className}`}>
    {(title || Icon || action) && (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          <div>
            {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {action && action}
      </div>
    )}
    {children}
  </div>
);

export default Card;