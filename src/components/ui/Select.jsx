import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Reemplaza el <select> nativo: el cuadro cerrado se puede estilar, pero la
// lista de opciones abierta la dibuja el sistema operativo/navegador y ningún
// CSS la toca — por eso se arma a mano con divs, para que combine con el
// resto de la app en vez de verse como un control de otro sitio.
const Select = ({ label, id, options = [], value, onChange, required, disabled, placeholder = 'Seleccione una opción' }) => {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const opcionSeleccionada = options.find((opt) => String(opt.value) === String(value));

  const handleSeleccionar = (opt) => {
    onChange({ target: { value: opt.value } });
    setAbierto(false);
  };

  return (
    <div className="mb-5 text-left" ref={ref}>
      <label htmlFor={id} className="block text-[13px] font-normal text-scout-primary mb-1.5">
        {label}{required && <span className="text-scout-accent"> *</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setAbierto((prev) => !prev)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-scout-border rounded-md bg-scout-bg-card focus:outline-none focus:border-scout-primary transition-colors text-[14px] text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={opcionSeleccionada ? 'text-scout-ink' : 'text-scout-muted'}>
            {opcionSeleccionada ? opcionSeleccionada.label : placeholder}
          </span>
          <ChevronDown size={15} className={`text-scout-muted shrink-0 transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`} />
        </button>

        {abierto && (
          <div className="absolute z-20 mt-1.5 w-full max-h-60 overflow-y-auto bg-scout-bg-card border border-scout-border rounded-xl shadow-lg py-1">
            {options.length === 0 ? (
              <p className="px-3 py-2 text-[13px] text-scout-muted font-medium">Sin opciones disponibles.</p>
            ) : (
              options.map((opt) => {
                const seleccionada = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSeleccionar(opt)}
                    className={`w-full text-left px-3 py-2 text-[14px] transition-colors cursor-pointer ${
                      seleccionada ? 'bg-scout-primary/10 text-scout-primary font-semibold' : 'text-scout-ink hover:bg-scout-bg-panel'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
