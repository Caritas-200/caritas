export const SelectField: React.FC<{
  id: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}> = ({ id, name, value, options, onChange, label }) => (
  <div>
    <label htmlFor={id} className="block text-gray-700">
      {label}
      {name !== "middleName" && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-2 rounded"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
