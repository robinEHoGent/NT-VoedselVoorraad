import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-left font-medium mb-1">{label}</label>}
    <input {...props} className="border rounded px-2 py-1" />
  </div>
);

export default Input;
