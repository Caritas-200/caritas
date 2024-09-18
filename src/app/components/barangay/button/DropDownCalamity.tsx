import React from "react";

interface CalamityDropdownProps {
  calamity: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  errors: { [key: string]: string };
}

const calamityOptions = [
  "Typhoon",
  "Earthquake",
  "Flood",
  "Volcanic Eruption",
  "Tsunami",
  "Landslide",
  "Drought",
  "Other",
];

const CalamityDropdown: React.FC<CalamityDropdownProps> = ({
  calamity,
  onChange,
  errors,
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-semibold text-gray-800">
        Calamity<span className="text-red-500">*</span>
      </label>
      <select
        name="calamity"
        value={calamity}
        onChange={onChange}
        className="p-2 border border-gray-300 rounded text-gray-700"
      >
        <option value="">Select Calamity</option>
        {calamityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors["calamity"] && (
        <span className="text-red-500 text-sm">{errors["calamity"]}</span>
      )}
    </div>
  );
};

export default CalamityDropdown;
