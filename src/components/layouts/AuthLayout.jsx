import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logoDistrito from '../../assets/logo_distrito.svg';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-scout-bg-card">

      {/* Lado Izquierdo */}
      <div className="w-full md:w-1/2 bg-scout-bg-panel flex flex-col justify-center p-8 md:p-16 lg:p-24 border-r border-scout-border">
        <div className="max-w-md mx-auto md:mx-0">
          <img src={logoDistrito} alt="Distrito 3 - Zona 13 - Scouts de Argentina" className="h-24 mb-8" />
          <h1 className="text-3xl md:text-4xl font-bold text-scout-primary mb-4">
            Sistema de Gestión Distrital
          </h1>
          <p className="text-scout-muted text-base max-w-sm">
            Plataforma interna para la administración y coordinación de actividades del distrito scout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-scout-muted hover:text-scout-primary transition-colors mt-8"
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
