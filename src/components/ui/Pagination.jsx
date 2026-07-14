// src/components/ui/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange, size = 'sm' }) => {
    if (totalPages <= 1) return null;

    const btnSize = size === 'lg' ? 'p-2 rounded-xl' : 'p-1.5 rounded-lg';
    const iconSize = size === 'lg' ? 16 : 14;

    return (
        <div className="flex items-center justify-end gap-3 pt-5 mt-auto shrink-0 border-t border-scout-border">
            <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                Pág. {page} / {totalPages}
            </span>
            <div className="flex gap-1">
                <button
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className={`${btnSize} border border-scout-border hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors`}
                >
                    <ChevronLeft size={iconSize} />
                </button>
                <button
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`${btnSize} border border-scout-border hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors`}
                >
                    <ChevronRight size={iconSize} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;