export const InputField: React.FC<{
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  pattern?: string;
}> = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  placeholder = "",
  pattern,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700">
      {label}
      {!["age", "work"].includes(name) && (
        <span className="text-red-500">*</span>
      )}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-2 rounded"
      placeholder={placeholder}
      pattern={pattern}
    />
  </div>
);
