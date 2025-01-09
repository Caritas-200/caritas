import React from "react";
import { UserData } from "@/app/lib/definitions";
interface DropdownProps {
  label: string;
  name: keyof UserData;
  options: string[];
  value: string;
  onChange: (name: keyof UserData, value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4 w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2 "
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
