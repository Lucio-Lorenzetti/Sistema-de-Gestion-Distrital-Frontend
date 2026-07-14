// src/pages/Dashboard/Dashboard.jsx
import { useUserRole } from '../../hooks/useUserRole';
import { RESUMEN_ACCESS, canAccess, ROLES } from './dashboard.permissions';
import DashboardLayout from '../../components/layouts/DashboardLayout';

import GeneralPanel from './Panels/General/GeneralPanel';
import NoticiasResumenCard from './Resumen/NoticiasResumenCard';
import CursosResumenCard from './Resumen/CursosResumenCard';
import DocumentacionResumenCard from './Resumen/DocumentacionResumenCard';

const RESUMEN_COMPONENTS = {
    noticias: NoticiasResumenCard,
    cursos: CursosResumenCard,
    documentacion: DocumentacionResumenCard,
};

const Dashboard = () => {
    const { user, role, roleLabel } = useUserRole();

    const visibleResumenes = Object.keys(RESUMEN_ACCESS).filter(
        (key) => canAccess(RESUMEN_ACCESS, key, role) && RESUMEN_COMPONENTS[key]
    );

    return (
        <DashboardLayout user={user} role={role} roleLabel={roleLabel}>
            {/* El director ve además su resumen general (actividad + accesos rápidos) */}
            {role === ROLES.DIRECTOR && <GeneralPanel />}

            {/* Resumen de 3 columnas: noticias, cursos, documentación */}
            {visibleResumenes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:col-span-3">
                    {visibleResumenes.map((key) => {
                        const ResumenCard = RESUMEN_COMPONENTS[key];
                        return <ResumenCard key={key} />;
                    })}
                </div>
            )}
        </DashboardLayout>
    );
};

export default Dashboard;