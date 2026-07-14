// src/components/ui/ActivityItem.jsx
const ActivityItem = ({ title, desc, time }) => (
    <div className="flex justify-between items-start gap-4 text-left text-xs">
        <div className="space-y-0.5">
            <p className="font-bold text-scout-primary uppercase tracking-tight">{title}</p>
            <p className="text-scout-muted leading-snug">{desc}</p>
        </div>
        <span className="text-[9px] font-black uppercase text-scout-muted tracking-wider whitespace-nowrap pt-0.5">{time}</span>
    </div>
);

export default ActivityItem;