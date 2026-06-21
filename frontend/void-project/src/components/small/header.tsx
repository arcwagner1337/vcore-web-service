import { useState } from "react";
import ProfileSection from "../containers/profile/profile";

interface HeaderProps {
    perf: boolean;
    setPerf: (val: boolean) => void;
    user: any; 
    onAuthClick: () => void; 
    onProfileClick: () => void;
}

const Header = ({ perf, setPerf, user, onAuthClick, onProfileClick }: HeaderProps) => (
    <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between bg-black/10 backdrop-blur-sm relative z-20 select-none">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Live System Stable</span>

            <button
                onClick={() => setPerf(!perf)}
                className={`group flex items-center gap-3 px-4 py-2 border transition-all duration-300 ${perf
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
            >
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${perf ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-600'}`} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                    Performance Mode: {perf ? 'ON' : 'OFF'}
                </span>
            </button>
        </div>

        <div className="flex items-center gap-6">
            {user ? (
             
                <div
                    onClick={onProfileClick} 
                    className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-all active:scale-95"
                >
                    <div className="text-right">
                        <h4 className="text-xs font-black uppercase tracking-wider text-white leading-none group-hover:text-cyan-400 transition-colors">
                            {user.username}
                        </h4>
                        <p className="text-[9px] font-bold text-cyan-400 uppercase mt-1">
                            {user.role || 'User Access'}
                        </p>
                    </div>

                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center font-black text-xs bg-white/5 relative overflow-hidden group-hover:border-cyan-400 transition-colors">
                        <span className="group-hover:text-cyan-400 z-10 transition-colors">
                            {user?.username?.substring(0, 2).toUpperCase() || '??'}
                        </span>
                      
                        <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors" />
                    </div>
                </div>
            ) : (
                
                <button
                    onClick={onAuthClick}
                    className="flex items-center gap-4 group cursor-pointer"
                >
                    <div className="text-right transition-transform group-hover:-translate-x-1">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-cyan-400 transition-colors leading-none">
                            Login
                        </h4>
                        <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">Or Register</p>
                    </div>
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/[0.02] group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5 transition-all duration-500">
                        <svg className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                </button>
            )}
        </div>
    </header>
);

export default Header;