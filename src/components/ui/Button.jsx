import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      // Ajustes: bg-neutral-900 (más oscuro), rounded-sm (casi cuadrado), sin shadow pesada
      className={`w-full bg-[#121212] text-white font-medium py-2.5 px-4 rounded-sm hover:bg-neutral-800 transition duration-200 text-sm active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;