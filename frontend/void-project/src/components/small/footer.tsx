import { useMemo } from 'react';

interface FooterProps {
    isAtBottom: boolean;
}

const BARS = 80;

const Footer = ({ isAtBottom }: FooterProps) => {
    const bars = useMemo(
        () => [...Array(BARS)].map(() => ({
            duration: 0.7 + Math.random() * 0.9,
            delay: Math.random() * 0.7,
            height: 20 + Math.random() * 80,
        })),
        []
    );

    return (
        <footer className="relative h-12 md:h-16 shrink-0 bg-black border-t border-white/5 z-40 select-none">
            <div
                className={`absolute left-0 right-0 bottom-0 bg-black transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isAtBottom ? 'h-32 md:h-48 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]' : 'h-12 md:h-16'}`}
            >
                <div className="absolute top-0 inset-x-0 h-12 md:h-16 flex items-center justify-between px-4 md:px-10 z-20 border-b border-white/5 bg-black">
                    <div className="flex items-center gap-3 md:gap-8 relative min-w-0">
                        <div className="text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.4em] text-white/30 uppercase whitespace-nowrap">
                            Loft Project Customs <span className="text-cyan-500/50">© 2026</span>
                        </div>
                        <div className={`shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-500 ${isAtBottom ? 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-800'}`} />
                        <span className="hidden md:inline text-[9px] font-mono text-slate-600 tracking-widest uppercase">
                            {isAtBottom ? 'TERMINAL_EXPANDED' : 'IDLE'}
                        </span>
                    </div>
                    <div className="hidden sm:flex gap-6 text-[10px] font-black text-white/20 uppercase tracking-widest">
                        <span>Logs</span>
                        <span>Docs</span>
                    </div>
                </div>

                <div className={`absolute inset-x-0 top-12 md:top-16 bottom-0 z-10 flex items-end justify-center gap-[1px] px-4 transition-all duration-500
                    ${isAtBottom ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
                    {bars.map((b, i) => (
                        <div
                            key={i}
                            className="flex-1 min-w-[1px] bg-cyan-500/60 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-bar"
                            style={{
                                '--duration': `${b.duration}s`,
                                '--delay': `${b.delay}s`,
                                height: isAtBottom ? `${b.height}%` : '0%',
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