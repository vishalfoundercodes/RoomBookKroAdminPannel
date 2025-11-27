import React from "react";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function StatusDropdown({ filterStatus, setFilterStatus }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "All", label: "All Status" },
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-48" ref={dropdownRef}>
      {/* Selected Box */}
      <div
        className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition"
        onClick={() => setOpen(!open)}
      >
        <span>{options.find((o) => o.value === filterStatus)?.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                setFilterStatus(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-blue-50 transition ${
                filterStatus === opt.value ? "bg-blue-100" : ""
              }`}
            >
              {opt.label}
              {filterStatus === opt.value && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


