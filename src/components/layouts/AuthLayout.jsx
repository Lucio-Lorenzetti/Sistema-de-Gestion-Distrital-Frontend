import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-scout-bg-card">

      {/* Lado Izquierdo */}
      <div className="w-full md:w-1/2 bg-scout-bg-panel flex flex-col justify-center p-8 md:p-16 lg:p-24 border-r border-scout-border">
        <div className="max-w-md mx-auto md:mx-0">
          <div className="w-20 h-20 bg-scout-muted flex items-center justify-center text-xs text-scout-bg-card font-bold mb-8 rounded">
            LOGO
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-scout-primary mb-4">
            Sistema de Gestión Distrital
          </h1>
          <p className="text-scout-muted text-base max-w-sm">
            Plataforma interna para la administración y coordinación de actividades del distrito scout.
          </p>
        </div>
      </div>

      {/* Lado Derecho */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-scout-bg-card">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
