import { useState } from "react";
import { Calendar } from "lucide-react";

export default function DOBDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (e) => {
    onChange(e.target.value);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Input Box */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition"
      >
        <span className="text-gray-700 whitespace-nowrap">
          {value ? value : "Select DOB"}
        </span>
        <Calendar className="h-5 w-5 text-indigo-600" />
      </div>

      {/* Custom Calendar Popup */}
      {open && (
        <div className="absolute z-20 mt-2 p-1 bg-white shadow-lg rounded-xl border w-36">
          <input
            type="date"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={value}
            onChange={handleSelect}
            max={new Date().toISOString().split("T")[0]} // DOB future date block
          />
        </div>
      )}
    </div>
  );
}
