import React, { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  pattern?: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  pattern,
  required = true,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        pattern={pattern}
        required={required}
        onChange={onChange}
        className="w-full text-gray-500 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default InputField;
