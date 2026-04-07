// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ label, id, type = 'text', value, onChange, placeholder, ...props }) => {
  return (
    <div className="mb-4 text-left">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black transition text-sm"
        {...props}
      />
    </div>
  );
};

export default Input;