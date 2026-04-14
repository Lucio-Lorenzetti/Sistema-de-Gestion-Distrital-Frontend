const Select = ({ label, id, options = [], ...props }) => {
  return (
    <div className="mb-5 text-left">
      <label htmlFor={id} className="block text-[13px] font-normal text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        id={id}
        className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white focus:outline-none focus:border-black transition-colors text-[14px] text-gray-800 appearance-none"
        style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1em' }}
        {...props}
      >
        <option value="" disabled selected>Seleccione una opción</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;