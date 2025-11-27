import { useState, useEffect } from "react";

export default function Calendar({ isOpen, onClose, onSelect, selectedDate }) {
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendar();
  }, []);

  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty filler for alignment
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: "", full: "", today: false });
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const full = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      days.push({
        date: d,
        full,
        today: d === today.getDate(),
      });
    }

    setCalendarDays(days);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h3 className="text-lg font-semibold mb-4 text-center">Select Date</h3>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} className="text-gray-500 text-sm font-medium">
              {d}
            </div>
          ))}

          {calendarDays.map((day, i) => (
            <div
              key={i}
              onClick={() => day.full && onSelect(day.full)}
              className={`
                p-2 rounded-lg cursor-pointer text-sm
                ${day.full === selectedDate ? "bg-indigo-500 text-white" : ""}
                ${day.today ? "bg-indigo-200" : ""}
                ${
                  day.full && day.full !== selectedDate
                    ? "hover:bg-indigo-100"
                    : ""
                }
              `}
            >
              {day.date}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
