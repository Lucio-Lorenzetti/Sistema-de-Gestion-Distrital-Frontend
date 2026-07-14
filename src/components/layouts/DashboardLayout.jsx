// src/components/layouts/DashboardLayout.jsx
const FULL_HEIGHT_ROLES = ['auxiliar_comunicacion', 'auxiliar_programa', 'director'];

const DashboardLayout = ({ user, role, roleLabel, children }) => {
    const isFullHeight = FULL_HEIGHT_ROLES.includes(role);
    const userName = user?.name || '-';

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={
                isFullHeight
                    ? { height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }
                    : { minHeight: '100%', padding: '2.5rem' }
            }
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
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10"
                style={isFullHeight ? { flex: 1, minHeight: 0, alignItems: 'stretch' } : { alignItems: 'start' }}
            >
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;