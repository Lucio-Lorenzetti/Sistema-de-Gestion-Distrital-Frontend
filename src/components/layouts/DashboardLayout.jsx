const FULL_HEIGHT_ROLES = ['auxiliar_comunicacion', 'auxiliar_programa', 'director'];

const DashboardLayout = ({ user, role, roleLabel, children }) => {
    const isFullHeight = FULL_HEIGHT_ROLES.includes(role);
    const userName = user?.name || '-';

    // En desktop (lg) los roles "full height" ocupan el alto del <main> y
    // scrollean por dentro; en mobile todo fluye y scrollea la página entera,
    // porque las tarjetas apiladas no entran en una sola pantalla.
    return (
        <div
            className={`bg-scout-bg-panel text-left relative min-h-full p-4 sm:p-6 lg:p-10 ${
                isFullHeight ? 'flex flex-col lg:h-full lg:overflow-y-auto' : ''
            }`}
        >
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Rol Asignado: {roleLabel}
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                    Buen día <span className="text-scout-muted">{userName.split(' ')[0]}</span>
                </h1>
            </div>

            <div
                className={`grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-10 ${
                    isFullHeight ? 'lg:flex-1 lg:min-h-0 lg:items-stretch' : 'items-start'
                }`}
            >
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
