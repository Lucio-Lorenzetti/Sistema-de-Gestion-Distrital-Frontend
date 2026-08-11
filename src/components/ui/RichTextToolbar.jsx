// src/components/ui/RichTextToolbar.jsx
import React from 'react';
import { Bold, List, ListOrdered } from 'lucide-react';

// preventDefault en mousedown evita que el botón le robe el foco/selección
// al contentEditable antes de que execCommand pueda aplicarse sobre ella.
const aplicar = (comando) => (e) => {
    e.preventDefault();
    document.execCommand(comando);
};

const RichTextToolbar = () => (
    <div className="flex items-center gap-1 mb-2 shrink-0">
        <button
            type="button"
            onMouseDown={aplicar('bold')}
            title="Negrita"
            className="p-2 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
        >
            <Bold size={13} />
        </button>
        <button
            type="button"
            onMouseDown={aplicar('insertUnorderedList')}
            title="Lista con viñetas"
            className="p-2 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
        >
            <List size={13} />
        </button>
        <button
            type="button"
            onMouseDown={aplicar('insertOrderedList')}
            title="Lista numerada"
            className="p-2 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
        >
            <ListOrdered size={13} />
        </button>
    </div>
);

export default RichTextToolbar;
