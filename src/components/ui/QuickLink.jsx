// src/components/ui/QuickLink.jsx
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const QuickLink = ({ to, label }) => (
    <Link
        to={to}
        className="w-full bg-scout-bg-panel border border-scout-border hover:bg-scout-primary hover:text-white text-scout-primary transition-all px-5 py-3.5 rounded-xl flex items-center justify-between group"
    >
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </Link>
);

export default QuickLink;