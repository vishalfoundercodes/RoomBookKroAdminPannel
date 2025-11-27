import { Check, ChevronDown } from "lucide-react";
import { useState,useEffect, useRef } from "react";

const PrettyDropdown = ({ value, onChange, options, width = "w-full" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`relative ${width}`} ref={ref}>
      <div
        className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition shadow-sm"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm">
          {options.find((o) => o.value === value)?.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="absolute z-30 w-full mt-1 bg-white border rounded-xl shadow-md max-h-56 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2 cursor-pointer flex justify-between text-sm items-center hover:bg-blue-50 
                ${value === opt.value ? "bg-blue-100" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
              {value === opt.value && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrettyDropdown