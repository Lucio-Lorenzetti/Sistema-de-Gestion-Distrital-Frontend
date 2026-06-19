import React from 'react';

const Input = ({ label, id, type = 'text', value, onChange, placeholder, ...props }) => {
  return (
    <div className="mb-4 text-left">
      <label htmlFor={id} className="block text-sm font-medium text-scout-primary mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-scout-border rounded-md shadow-sm placeholder-scout-muted focus:outline-none focus:ring-scout-primary focus:border-scout-primary transition text-sm text-scout-primary bg-scout-bg-card"
        {...props}
      />
    </div>
  );
};

export default Input;
