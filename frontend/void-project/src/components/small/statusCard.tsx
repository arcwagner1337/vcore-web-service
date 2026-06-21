import bgr2 from '../../assets/bgr2.jpeg';

const StatusCard = ({ title, value, live }: any) => (
    <div className="border border-[var(--color-border-soft)] p-6 group transition-all duration-500 hover:border-accent-cyan/40 overflow-hidden relative bg-[#0d1117]/50 backdrop-blur-sm">
        
      
        <div
            className="absolute inset-0 opacity-[0.08] mix-blend-screen transition-all duration-1000 group-hover:scale-110 group-hover:opacity-15 pointer-events-none"
            style={{
                backgroundImage: `url(${bgr2})`,
                backgroundSize: '200% auto', 
                backgroundPosition: 'center',
                
                maskImage: 'radial-gradient(circle, transparent 20%, black 120%)',
                WebkitMaskImage: 'radial-gradient(circle, transparent 20%, black 120%)'
            }}
        />

      
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity z-20">
            <div className="text-[8px] font-black uppercase text-accent-cyan tracking-[0.2em] flex items-center gap-1">
                <div className="w-1 h-1 bg-accent-cyan animate-pulse" />
                Secure_Boot
            </div>
        </div>

       
        <div className="flex items-center gap-5 mb-2 relative z-10">
           
            <div className="h-14 w-14 border border-accent-cyan/20 bg-black/40 flex items-center justify-center relative flex-shrink-0">
             
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]" />
                <div className="absolute inset-1 border border-accent-cyan/10" />
                <div className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_15px_#22d3ee] animate-pulse" />
                
              
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-accent-cyan/40" />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-accent-cyan/40" />
            </div>

            <div>
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] leading-none mb-2">{title}</h3>
                <p className="text-2xl font-black italic uppercase text-white tracking-tighter group-hover:text-accent-cyan transition-colors">
                    {value}
                </p>
            </div>
        </div>

   
        {live && (
            <div className="flex items-center justify-end text-[9px] font-bold text-accent-cyan animate-pulse font-mono tracking-[0.3em] mt-2 relative z-10">
                <span className="opacity-50 mr-2 uppercase text-[8px]">Status:</span> ● LIVE
            </div>
        )}

       
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-accent-cyan group-hover:w-full transition-all duration-700 opacity-30" />
    </div>
);

export default StatusCard;