import React from 'react';

const MetricCard = ({ icon, title, value, sub, color }) => (
  <div className={`bg-scout-bg-card p-6 rounded-[2rem] border-l-4 ${color} border border-scout-border shadow-sm flex flex-col justify-between h-30`}>
    <div className="flex justify-between items-start">
      <span className="text-[9px] font-black uppercase tracking-widest text-scout-muted max-w-[80%]">{title}</span>
      <div className="text-scout-primary opacity-20">{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-black tracking-tight uppercase leading-none mb-1 text-scout-primary">{value}</p>
      <p className="text-[10px] text-scout-muted font-medium">{sub}</p>
    </div>
  </div>
);

export default MetricCard;
