// src/pages/Dashboard/Panels/Usuarios/DesignarDirectorModal.jsx
// Designación directa: reemplaza al Director actual por el usuario elegido —
// nunca hay dos Directores a la vez en todo el distrito.
import React, { useState } from 'react';
import { X, Crown } from 'lucide-react';
import Select from '../../../../components/ui/Select';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

const DesignarDirectorModal = ({ usuarios, onClose, onDesignado }) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [userId, setUserId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await authorizedFetch('/distrito/director', {
                method: 'PATCH',
                body: { user_id: userId },
            });
            await onDesignado?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-scout-bg-card w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-scout-border animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer">
                    <X size={16} />
                </button>

                <div className="flex items-center gap-2 mb-1">
                    <Crown size={16} className="text-scout-primary" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-scout-ink">Designar Director</h2>
                </div>
                <p className="text-xs text-scout-muted font-medium mb-5">
                    Reemplaza al Director actual del distrito — vos vas a dejar de serlo.
                </p>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-scout-accent-light border border-scout-accent/20 rounded-xl text-xs font-bold text-scout-accent">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Select
                        label="Nuevo Director"
                        id="user_id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        options={usuarios.filter((u) => u.activo).map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }))}
                        required
                    />

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!userId || isSubmitting}
                            className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                        >
                            {isSubmitting ? 'Designando...' : 'Designar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DesignarDirectorModal;
