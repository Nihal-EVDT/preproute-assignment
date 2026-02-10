import { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedLabels = options
    .filter(o => value.includes(o.value))
    .map(o => o.label);

  return (
    <div ref={ref} className="relative">
      {/* Input */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(prev => !prev)}
        className="w-full min-h-[40px] border rounded-md px-3 text-sm flex flex-wrap gap-2 items-center disabled:bg-gray-50"
      >
        {selectedLabels.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selectedLabels.map(label => (
            <span
              key={label}
              className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
            >
              {label}
            </span>
          ))
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-[220px] overflow-auto border bg-white rounded-md shadow">
          {options.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
              />
              {opt.label}
            </label>
          ))}

          {options.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-400">
              No options available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
