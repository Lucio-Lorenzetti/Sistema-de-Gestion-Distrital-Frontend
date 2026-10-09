// src/pages/Dashboard/Dashboard.jsx
import { useUserRole } from '../../hooks/useUserRole';
import { RESUMEN_ACCESS, canAccess, ROLES } from './dashboard.permissions';
import DashboardLayout from '../../components/layouts/DashboardLayout';

import GeneralPanel from './Panels/General/GeneralPanel';
import NoticiasResumenCard from './Resumen/NoticiasResumenCard';
import CursosResumenCard from './Resumen/CursosResumenCard';
import DocumentacionResumenCard from './Resumen/DocumentacionResumenCard';
import EducadorResumenCard from './Resumen/EducadorResumenCard';
import ProgramasAprobacionResumen from './Resumen/ProgramasAprobacionResumen';
import ComentariosPendientesResumenCard from './Resumen/ComentariosPendientesResumenCard';
import MiGrupoCard from './Resumen/MiGrupoCard';

const RESUMEN_COMPONENTS = {
    noticias: NoticiasResumenCard,
    cursos: CursosResumenCard,
    documentacion: DocumentacionResumenCard,
    miPerfilPrograma: EducadorResumenCard,
    programasAprobacion: ProgramasAprobacionResumen,
    comentariosPendientes: ComentariosPendientesResumenCard,
};

const Dashboard = () => {
    const { user, role, roleLabel } = useUserRole();

    // Va aparte del RESUMEN_ACCESS: useUserRole() resuelve UN rol principal
    // (Director gana sobre Jefe de Grupo), pero un Director que además es
    // Jefe de Grupo también tiene que poder editar su grupo — abajo de todo.
    const esJefeDeGrupo = (user?.roles ?? []).some((r) => r.nombre.toLowerCase() === 'jefe de grupo');

    const visibleResumenes = Object.keys(RESUMEN_ACCESS).filter(
        (key) => canAccess(RESUMEN_ACCESS, key, role) && RESUMEN_COMPONENTS[key]
    );

    return (
        <DashboardLayout user={user} role={role} roleLabel={roleLabel}>
            {role === ROLES.DIRECTOR && <GeneralPanel />}

            {/* Resumen de 3 columnas: noticias, cursos, documentación, Educador, Aux Programa */}
            {visibleResumenes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:col-span-3 mb-16 pb-6">
                    {visibleResumenes.map((key) => {
                        const ResumenCard = RESUMEN_COMPONENTS[key];
                        return <ResumenCard key={key} />;
                    })}
                </div>
            )}

            {esJefeDeGrupo && (
                <div className="lg:col-span-3 mb-16 pb-6">
                    <MiGrupoCard />
                </div>
            )}
        </DashboardLayout>
    );
};

export default Dashboard;