// src/components/layouts/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Lado Izquierdo (Logo e Info) */}
      <div className="w-full md:w-1/2 bg-[#F9FAFB] flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-gray-50 border-r border-gray-200">
        <div className="max-w-md mx-auto md:mx-0">
          <div className="w-20 h-20 bg-gray-400 flex items-center justify-center text-xs text-white font-bold mb-8 rounded">
            LOGO
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">
            Sistema de Gestión Distrital
          </h1>
          <p className="text-gray-600 text-base max-w-sm">
            Plataforma interna para la administración y coordinación de actividades del distrito scout.
          </p>
        </div>
      </div>

      {/* Lado Derecho (Formularios Dinámicos) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;