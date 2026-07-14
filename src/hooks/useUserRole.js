// src/hooks/useUserRole.js
import { useAuthStore } from '../store/useAuthStore';

const ROLE_MAP = [
    { match: ['director'], role: 'director' },
    { match: ['jefe de grupo'], role: 'jefe_grupo' },
    { match: ['aux prog general', 'aux prog rama'], role: 'auxiliar_programa' },
    { match: ['aux comunicación', 'aux comunicacion'], role: 'auxiliar_comunicacion' },
];

export const useUserRole = () => {
    const { user } = useAuthStore();

    const roleNames = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());
    const found = ROLE_MAP.find(({ match }) => match.some((m) => roleNames.includes(m)));
    const role = found?.role ?? 'educador';

    const roleLabel = user?.roles?.length ? user.roles.map((r) => r.nombre).join(' / ') : 'Educador';

    return { user, role, roleLabel };
};