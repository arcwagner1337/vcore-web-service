import React from 'react';
import bgr2 from '../../assets/bgr7.jpeg';


const RadarBgr = () => (
    <div className="relative w-72 h-72 flex items-center justify-center opacity-70 filter drop-shadow-[0_0_2px_rgba(6,182,212,0.15)] pointer-events-none select-none">
   
        <div 
            className="absolute inset-0 rounded-full animate-[spin_5s_linear_infinite]"
            style={{ 
                backgroundImage: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.25) 0deg, transparent 120deg)' 
            }} 
        />
        
     
        <div className="absolute w-full h-[1px] bg-cyan-500/20" />
        <div className="absolute h-full w-[1px] bg-cyan-500/20" />
        
   
        <div className="absolute w-full h-full rounded-full border border-cyan-500/20 animate-pulse duration-1000" />
        <div className="absolute w-[70%] h-[70%] rounded-full border border-cyan-500/25" />
        <div className="absolute w-[40%] h-[40%] rounded-full border border-cyan-500/30" />
        <div className="absolute w-[15%] h-[15%] rounded-full border border-cyan-500/40 bg-cyan-500/[0.03]" />

     
        <div className="absolute top-[28%] left-[25%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-ping [animation-duration:1.5s]" />
        <div className="absolute bottom-[32%] right-[22%] w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
    </div>
);

const DownloadSection = () => (
 
    <section className="relative pt-16 pb-80 bg-[#07090d] border-t border-white/5 overflow-hidden group/down flex items-center justify-center">

        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen transition-opacity duration-1000 group-hover/down:opacity-[0.07]" />


        <div className="absolute left-[8%] top-[38%] -translate-y-1/2 hidden lg:block z-0">
            <RadarBgr />
        </div>

       
        <div className="max-w-4xl mx-auto px-6 relative z-10 mt-20">
            <div className="flex flex-col items-center">
          
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-24 bg-gradient-to-l from-cyan-500 to-transparent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-cyan-500/60 animate-pulse">
                        Final Deployment Phase
                    </span>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-cyan-500 to-transparent" />
                </div>
            
                <div className="relative p-2 border border-white/5 bg-black/40 group/btn-container">
                    <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-cyan-500 shadow-[0_0_15px_#22d3ee]" />
                    <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-cyan-500 shadow-[0_0_15px_#22d3ee]" />

                    <button className="relative px-20 py-10 bg-black border border-white/5 hover:border-cyan-500/50 transition-all active:scale-90 duration-700 overflow-hidden group/btn">
                    
                        <div
                            className="absolute inset-0 opacity-0 group-hover/btn:opacity-20 transition-all duration-1000 scale-125 group-hover/btn:scale-100 mix-blend-screen pointer-events-none"
                            style={{
                                backgroundImage: `url(${bgr2})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'contrast(1.2) brightness(0.8)'
                            }}
                        />

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <span className="text-4xl font-black italic uppercase text-white/90 tracking-tighter group-hover/btn:text-white transition-colors">
                                Download <span className="text-cyan-500">.exe</span>
                            </span>
                        </div>
                      
                        <div className="absolute inset-y-0 w-[2px] bg-cyan-500/50 shadow-[0_0_15px_#22d3ee] -left-full group-hover/btn:left-[150%] transition-all duration-1000 ease-in-out" />
                    </button>
                </div>

            </div>
        </div>

        
        <div className="absolute right-[8%] top-[38%] -translate-y-1/2 hidden lg:block z-0 rotate-90">
            <RadarBgr />
        </div>

    </section>
);

export default DownloadSection;