import React from 'react';

export const PartnerBranding: React.FC = () => {
    return (
        <div className="flex items-center gap-2 justify-center mt-2 animate-in fade-in duration-500">
            <span className="text-[10px] font-bold italic text-slate-400">En alianza con:</span>
            <div className="flex items-center gap-1.5 opacity-80 mix-blend-multiply">
                <span className="material-symbols-outlined text-primary text-sm">local_hospital</span>
                <span className="text-xs font-black italic tracking-tighter text-secondary">Hospital Metropolitano</span>
            </div>
        </div>
    );
};
