import React from 'react';

const MetricCard = ({ icon, title, value, sub, color }) => (
  <div className={`bg-white p-6 rounded-[2rem] border-l-4 ${color} border border-y-neutral-100 border-r-neutral-100 shadow-sm flex flex-col justify-between h-40`}>
    <div className="flex justify-between items-start">
      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 max-w-[80%]">{title}</span>
      <div className="text-neutral-900 opacity-20">{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-black tracking-tight uppercase leading-none mb-1">{value}</p>
      <p className="text-[10px] text-neutral-400 font-medium">{sub}</p>
    </div>
  </div>
);

export default MetricCard;