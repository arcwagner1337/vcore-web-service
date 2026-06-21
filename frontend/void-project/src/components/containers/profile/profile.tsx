import React, { useState, useEffect, useMemo } from 'react';
import bgr2 from '../../../assets/bgr5.jpeg';

interface ProfileProps {
    user: any;
    onBack: () => void;
    onLogout: () => void;
    isExternalClosing?: boolean;
    refreshUser: () => void;
    openPurchase: () => void
}

export default function ProfileSection({ user, onBack, onLogout, isExternalClosing, refreshUser, openPurchase }: ProfileProps) {
    if (!user) return null;

    const [isInternalClosing, setIsInternalClosing] = useState(false);
    const [isEntered, setIsEntered] = useState(false);
    const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

    useEffect(() => {
        setIsEntered(true);
        refreshUser();
        const timer = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
        return () => clearInterval(timer);
    }, []);

    const closing = isInternalClosing || isExternalClosing;

    const handleClose = (finalAction: () => void) => {
        setIsInternalClosing(true);
        setTimeout(finalAction, 400);
    };

    const sub = useMemo(() => {
        const start = user.sub_start || 0;
        const end = user.sub_end || 0;

        if (end === 0 || currentTime >= end) return { percent: 0, timeStr: "EXPIRED", active: false };

        const total = end - start;
        const remaining = end - currentTime;
        const percent = Math.max(0, Math.min(100, (remaining / total) * 100));

        const days = Math.floor(remaining / 86400);
        const hours = Math.floor((remaining % 86400) / 3600);
        const mins = Math.floor((remaining % 3600) / 60);
        const secs = remaining % 60;

        return {
            percent,
            timeStr: `${days}D ${hours}H ${mins}M ${secs}S`,
            active: true
        };
    }, [user.sub_end, user.sub_start, currentTime]);


    const [formData, setFormData] = useState({
        display_name: user.username,
        email: user.email || '',
        password: ''
    });

    useEffect(() => {
        setFormData({
            display_name: user.username,
            email: user.email || '',
            password: ''
        });
    }, [user]); 


    const handleSaveAll = async () => {
        const res = await fetch(import.meta.env.VITE_UPDATE_USR_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({
                current_username: user.username,
                ...formData
            })
        });

        if (res.ok) {
            
            refreshUser();
        }
    };


    const handleProfileInputChange = (field: string, value: string) => {
       
        const cleanValue = value.replace(/[а-яёА-ЯЁ]/gu, '');

        setFormData(prev => ({
            ...prev,
            [field]: cleanValue
        }));
    };



    return (
        <div className="relative w-full min-h-screen select-none">
          
            <div
                className="fixed inset-0 z-0 opacity-40 pointer-events-none"
                style={{ backgroundImage: `url(${bgr2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />

            <div className={`relative bg-white/[0.01] backdrop-blur-xl z-10 p-20 transition-all duration-1000 
                ${isEntered && !closing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                ${closing ? 'exit-animation' : ''}`}>

             
                <div className="flex items-center justify-between border-b border-white/10 pb-12">
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <div className="w-28 h-28 bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center text-5xl font-black text-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden">
                                {user.username.substring(0, 2).toUpperCase()}
                                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] cursor-pointer">CHANGE</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 bg-cyan-500 text-[9px] font-black text-black uppercase">
                                    {user.role || 'CORE_USER'}
                                </span>
                                <span className="text-[10px] font-mono text-white/30 tracking-[0.2em]">UID: {user.id?.toString().padStart(4, '0') || '0001'}</span>
                            </div>
                            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">{user.username}</h2>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => handleClose(onBack)} className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            Back
                        </button>
                        <button onClick={() => handleClose(onLogout)} className="px-8 py-3 border border-red-500/40 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                            Logout
                        </button>
                    </div>
                </div>

            
                <div className={`relative mb-6 p-8 border ${sub.active ? 'border-cyan-500/20 bg-cyan-500/[0.02]' : 'border-red-500/20 bg-red-500/[0.02]'} backdrop-blur-md`}>
                    <div className="flex justify-between items-end mb-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Access Expiration Timer</p>
                            <h3 className={`text-4xl font-mono font-black ${sub.active ? 'text-white' : 'text-red-500'}`}>{sub.timeStr}</h3>
                        </div>
                        <div className="text-right">
                            <span className={`text-[10px] font-black p-1 px-3 border ${sub.active ? 'border-cyan-500 text-cyan-400' : 'border-red-500 text-red-500'} animate-pulse`}>
                                {sub.active ? 'CONNECTION_STABLE' :
                                    <button className="p-4"
                                        onClick={openPurchase}>
                                        EXTEND SUBSCRIPTION
                                    </button>}
                            </span>
                        </div>
                    </div>
               
                    <div className="h-2 w-full bg-white/5 relative">
                        <div
                            className={`h-full transition-all duration-1000 ease-out ${sub.active ? 'bg-cyan-500 shadow-[0_0_20px_cyan]' : 'bg-red-500'}`}
                            style={{ width: `${sub.percent}%` }}
                        />
                    </div>
                </div>

            
                <div className="grid grid-cols-12 gap-8">
                  
                    <div className="col-span-7 space-y-6">
                        <div className="p-8 bg-white/[0.02] border border-white/5 backdrop-blur-sm space-y-8">
                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500/50 italic">Account Configuration</h4>

                            <div className="grid grid-cols-2 gap-8 text-[10px] uppercase font-bold tracking-widest text-white/60">
                                <div className="space-y-3">
                                    <label>Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.display_name}
                                        onChange={(e) => handleProfileInputChange('display_name', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-3 focus:border-cyan-500 outline-none transition-colors text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label>Email Address</label>
                                    <input
                                        type="text"
                                        inputMode="email"
                                        value={formData.email}
                                        onChange={(e) => handleProfileInputChange('email', e.target.value)}
                                        placeholder="not_set@void.com"
                                        className="w-full bg-white/5 border border-white/10 p-3 focus:border-cyan-500 outline-none transition-colors text-white"
                                    />
                                </div>
                                <div className="space-y-3 mt-6 col-span-2">
                                    <label>Security Key (New Password)</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleProfileInputChange('password', e.target.value)}
                                            placeholder="LEAVE EMPTY TO KEEP CURRENT"
                                            className="flex-1 bg-white/5 border border-white/10 p-3 text-white focus:border-cyan-500 outline-none"
                                        />
                                        <button
                                            onClick={handleSaveAll}
                                            className="px-6 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all font-black text-[10px]"
                                        >
                                            UPDATE_DATA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                 
                    <div className="col-span-5 space-y-6 text-[10px] uppercase font-bold tracking-widest">
                        <div className="p-8 bg-white/[0.02] border border-white/5 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-white/40 italic">Kernel HWID</span>
                                <span className="text-white font-mono">{btoa(user.username || 'anon').substring(0, 12).toUpperCase()}-XX</span>
                            </div>
                            <button className="w-full py-3 border border-white/10 hover:border-white/40 transition-all text-white/60 hover:text-white">
                                Reset Hardware Identity
                            </button>
                        </div>

                        <div className="p-8 bg-cyan-500/[0.03] border border-cyan-500/20 space-y-4">
                            <div className="flex justify-between items-center text-cyan-400/80">
                                <span>Security Level</span>
                                <span>Class-A (Encrypted)</span>
                            </div>
                            <div className="flex justify-between items-center text-white/40">
                                <span>Last Login</span>
                                <span>127.0.0.1 (Local)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}