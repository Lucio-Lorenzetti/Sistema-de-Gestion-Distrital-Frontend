import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logoDistrito from '../../assets/logo_distrito.svg';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-scout-bg-card">

      {/* Lado Izquierdo */}
      <div className="w-full md:w-1/2 bg-scout-bg-panel flex flex-col justify-center px-8 py-6 md:p-16 lg:p-24 border-b md:border-b-0 md:border-r border-scout-border">
        <div className="max-w-md mx-auto md:mx-0">
          <img src={logoDistrito} alt="Distrito 3 - Zona 13 - Scouts de Argentina" className="h-14 md:h-24 mb-4 md:mb-8" />
          <h1 className="text-2xl md:text-4xl font-bold text-scout-primary mb-2 md:mb-4">
            Sistema de Gestión Distrital
          </h1>
          <p className="hidden md:block text-scout-muted text-base max-w-sm">
            Plataforma interna para la administración y coordinación de actividades del distrito scout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-scout-muted hover:text-scout-primary transition-colors mt-4 md:mt-8"
          >
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
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
