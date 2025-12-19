import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function AmenitiesDropdown({
  options = [],
  value = [],
  onChange,
  placeholder = "Select Amenities",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleAmenity = (amenity) => {
    const exists = value.find((v) => v._id === amenity._id);
    if (exists) {
      onChange(value.filter((v) => v._id !== amenity._id));
    } else {
      onChange([...value, amenity]);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition"
      >
        <span className="text-sm text-gray-700 truncate">
          {value.length > 0 ? value.map((v) => v.name).join(", ") : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-64 overflow-auto">
          {options.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              No amenities found
            </div>
          )}

          {options.map((opt) => {
            const selected = value.some((v) => v._id === opt._id);

            return (
              <div
                key={opt._id}
                onClick={() => toggleAmenity(opt)}
                className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-blue-50 transition ${
                  selected ? "bg-blue-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={opt.icon}
                    alt={opt.name}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-sm">{opt.name}</span>
                </div>

                {selected && <Check className="w-4 h-4 text-blue-600" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
