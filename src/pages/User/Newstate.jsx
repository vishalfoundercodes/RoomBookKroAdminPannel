// NewStatCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NewStatCard({
  title,
  value,
  icon: Icon,
  route,
  gradient, // <--- full static gradient classes
  highlight,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`transition-all duration-300 ${
        highlight == title ? "animate-bounce-twice " : ""
      }`}
      onClick={() => route && navigate(route)}
    >
      <div
        className={`
          p-4 sm:p-6 
          bg-gradient-to-r ${gradient}
          rounded-xl sm:rounded-2xl 
          shadow-lg text-white 
          flex items-center justify-between 
          cursor-pointer
        `}
      >
        <div>
          <p className="text-xs sm:text-sm opacity-80">{title}</p>
          <h2 className="text-sm sm:text-3xl font-bold mt-1">{value}</h2>
        </div>

        {Icon && <Icon className="w-8 h-8 sm:w-12 sm:h-12 opacity-80" />}
      </div>
    </div>
  );
}
