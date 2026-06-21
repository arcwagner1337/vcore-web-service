import { useState, useEffect, memo } from 'react';


const useAppPlaceholder = () => {
    return {
        
        authError: false,
    };
};


interface FooterProps {
    isAtBottom: boolean;
}



const Footer = ({ isAtBottom }: FooterProps) => {
    return (
        
        <footer className="relative h-16 bg-black border-t border-white/5 z-50 select-none">

          
            <div
                className={`absolute left-0 right-0 bottom-0 bg-black transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isAtBottom ? 'h-48 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]' : 'h-16'}`}
            >
                
                <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-10 z-20 border-b border-white/5 bg-black">
                    <div className="flex items-center gap-8 relative">
                        <div className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
                            Loft Project Customs <span className="text-cyan-500/50">© 2026</span>
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isAtBottom ? 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-800'}`} />
                        <span className="text-[9px] font-mono text-slate-600 tracking-widest uppercase">
                            {isAtBottom ? 'TERMINAL_EXPANDED' : 'IDLE'}
                        </span>
                    </div>
                    <div className="flex gap-6 text-[10px] font-black text-white/20 uppercase tracking-widest">
                        <span>Logs</span>
                        <span>Docs</span>
                    </div>
                </div>

             
                
                <div className={`absolute inset-x-0 top-16 bottom-0 z-10 flex items-end justify-center gap-[1px] px-4 transition-all duration-500
                    ${isAtBottom ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>

                    {[...Array(80)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 min-w-[1px] bg-cyan-500/60 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-bar"
                            style={{
                                '--duration': `${0.7 + Math.random() * 0.9}s`,
                                '--delay': `${Math.random() * 0.7}s`,
                                height: isAtBottom ? `${20 + Math.random() * 80}%` : '0%'
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes bar {
                    0%, 100% { transform: scaleY(1); opacity: 0.6; }
                    50% { transform: scaleY(1.2); opacity: 1; }
                }
                .animate-bar { animation: bar var(--duration) var(--delay) infinite ease-in-out; }
            `}</style>
        </footer>
    );
};

export default Footer;


