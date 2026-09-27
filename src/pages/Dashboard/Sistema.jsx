// src/pages/Dashboard/Sistema.jsx
import React from 'react';
import { Settings } from 'lucide-react';
import { useRoles } from './Panels/Sistema/useRoles';
import RolesMetadataTable from './Panels/Sistema/RolesMetadataTable';

const Sistema = () => {
    const { roles, isLoading, refetch } = useRoles();

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Solo Developer
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase flex items-center gap-2">
                    <Settings size={20} /> Sistema
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-8 overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
                <RolesMetadataTable roles={roles} isLoading={isLoading} onGuardado={refetch} />
            </div>
        </div>
    );
};

export default Sistema;
