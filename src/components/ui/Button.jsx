import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-scout-primary text-scout-bg-card font-medium py-2.5 px-4 rounded-sm hover:bg-scout-primary-hover transition duration-200 text-sm active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
