// src/components/ui/EmptyState.jsx
const EmptyState = ({ icon, message }) => (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
        <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted">
            {icon}
        </div>
        <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">{message}</p>
    </div>
);

export default EmptyState;