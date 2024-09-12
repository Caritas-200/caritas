export const SelectField: React.FC<{
  id: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  required?: boolean;
}> = ({ id, name, value, options, onChange, label, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-gray-700">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-2 rounded"
      required={required}
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
