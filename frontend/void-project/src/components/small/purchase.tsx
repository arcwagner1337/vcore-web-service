
import React, { useState, useMemo } from 'react';
import bgr2 from '../../assets/bgr7.jpeg'

export const CheckoutPage = ({ user, refreshUser, plan, onClose }: any) => {
    const initialDays = parseInt(plan?.period) || 30;
    const [days, setDays] = useState(initialDays);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [inviteCode, setInviteCode] = useState('');
    const [showStub, setShowStub] = useState(false);

    const checkoutData = useMemo(() => {
        const basePricePerDay = 15;
        let discount = 0;

        if (days >= 20) discount = 0.2;
        if (days >= 40) discount = 0.4;

        const totalPrice = Math.floor(days * basePricePerDay * (1 - discount));

        return {
            totalPrice,
            discount: Math.round(discount * 100),
            pricePerDay: (totalPrice / days).toFixed(1)
        };
    }, [days]);

    const handlePurchase = async () => {
       
        if (!inviteCode.trim()) {
            setShowStub(true);
            return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch(import.meta.env.VITE_PURCHASE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    planId: days >= 30 ? 3 : (days >= 7 ? 2 : 1),
                    customDays: days,
                    inviteCode: inviteCode.trim() 
                })
            });

            if (res.ok) {
                alert('ACCESS_GRANTED: Подписка успешно синхронизирована.');
                await refreshUser();
                onClose();
            } else {
               
                setShowStub(true);
            }
        } catch (e) {
            console.error(e);
           
            setShowStub(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto bg-[#050505] select-none">
            
           
            <div
                className="fixed inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: `url(${bgr2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[30%] w-full animate-scan" />
            </div>

            <div className="max-w-5xl w-full grid grid-cols-12 gap-1 border border-white/5 bg-white/[0.01] backdrop-blur-xl relative min-h-[550px]">
              
                <div className="absolute -top-[2px] -left-[2px] w-12 h-12 border-t-2 border-l-2 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse z-30" />
                <div className="absolute -bottom-[2px] -right-[2px] w-12 h-12 border-b-2 border-r-2 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse z-30" />

              
                {showStub && (
                    <div className="absolute inset-0 bg-[#05070b]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-200 border border-red-500/20">
                        <div className="w-16 h-16 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                            <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black italic text-white uppercase tracking-wider mb-2">GATEWAY_NOT_CONFIGURED</h3>
                        <p className="text-red-500/60 font-mono text-[10px] tracking-[0.2em] mb-6">ERROR_CODE: NO_ACTIVE_PAYMENT_METHOD</p>
                        
                        <div className="max-w-md bg-black/40 border border-white/5 p-6 font-mono text-xs text-slate-400 leading-relaxed uppercase mb-8">
                            Автоматический прием платежей временно отключен. Если у вас нет пригласительного инвайт-кода (Invite Code), вы не сможете завершить трансляцию сессии. Обратитесь к администратору для ручной верификации.
                        </div>

                        <button
                            onClick={() => setShowStub(false)}
                            className="px-8 py-4 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-xs font-bold tracking-widest transition-all duration-200"
                        >
                            [ RETURN_TO_TERMINAL ]
                        </button>
                    </div>
                )}

              
                <div className="col-span-7 p-16 space-y-12 border-r border-white/5">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Terminal_Checkout</h2>
                        <p className="text-cyan-500/50 font-mono text-[10px] tracking-[0.3em]">SELECT_DURATION_FOR_VOIDCORE_ACCESS</p>
                    </div>

                    <div className="space-y-6">
                        <div className="mt-6 group border border-white/5 bg-white/[0.02] backdrop-blur-md p-6 relative overflow-hidden transition-all hover:border-cyan-500/40">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-200 group-hover:text-cyan-400 transition-colors">
                                            Access Duration
                                        </h3>
                                        <p className="text-[9px] text-cyan-900 uppercase font-bold mt-0.5">
                                            Adjust subscription length
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]">
                                            {days} <span className="text-[10px] text-white/20 uppercase">Days</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="relative h-1.5 bg-white/60 border border-cyan-900/30 mt-2">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-150"
                                        style={{ width: `${((days - 1) / (60 - 1)) * 100}%` }}
                                    />

                                    <div
                                        className="absolute top-1/2 w-4 h-4 z-30 pointer-events-none transition-all duration-150"
                                        style={{
                                            left: `${((days - 1) / (60 - 1)) * 100}%`,
                                            transform: `translate(-50%, -50%)`
                                        }}
                                    >
                                        <div className="w-full h-full bg-white rotate-45 border border-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                                        <div className="absolute inset-1 bg-cyan-950 rotate-45 border border-cyan-400/50" />
                                    </div>

                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={days}
                                        onChange={(e) => setDays(Number(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
                                    />
                                </div>

                                <div className="flex justify-between mt-4 px-0.5 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                                    <span className={days === 1 ? "text-cyan-500" : ""}>1 Day (Trial)</span>
                                    <span className={days === 30 ? "text-cyan-500" : ""}>30 Days</span>
                                    <span className={days === 60 ? "text-cyan-500" : ""}>60 Days (Elite)</span>
                                </div>
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-900/20 group-hover:bg-cyan-500 transition-all duration-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                                <p className="text-[9px] text-white/30 uppercase mb-2">Price Per Day</p>
                                <p className="text-xl text-white font-bold">{checkoutData.pricePerDay}₽</p>
                            </div>
                            <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                                <p className="text-[9px] text-white/30 uppercase mb-2">Volume Discount</p>
                                <p className="text-xl text-green-500 font-bold">-{checkoutData.discount}%</p>
                            </div>
                        </div>
                    </div>
                </div>

               
                <div className="col-span-5 p-16 bg-cyan-500/[0.02] flex flex-col justify-between relative">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors font-mono text-sm z-10"
                    >
                        [ ESC_EXIT ]
                    </button>

                    <div className="space-y-8 mt-4">
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.5em]">Order_Summary</h3>

                        <div className="space-y-4 font-mono text-[11px]">
                            <div className="flex justify-between py-3 border-b border-white/5">
                                <span className="text-white/40 italic">License_Target:</span>
                                <span className="text-white">{user?.username}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-white/5">
                                <span className="text-white/40 italic">Node_Status:</span>
                                <span className="text-green-500">READY</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-white/5 text-lg font-bold mt-4">
                                <span className="text-white italic">Total_Amount:</span>
                                <span className="text-cyan-400">{checkoutData.totalPrice}₽</span>
                            </div>
                        </div>
                    </div>

                 
                    <div className="space-y-2 my-6">
                        <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
                            ENTER_INVITE_CODE
                        </label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="PROMO_OR_INVITE_CODE"
                            className="w-full bg-black/40 border border-white/5 p-4 text-sm font-mono text-cyan-400 placeholder-white/10 uppercase tracking-wider focus:outline-none focus:border-cyan-500/50 transition-colors duration-300"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="text-[9px] text-white/20 text-center uppercase leading-relaxed">
                            By clicking the button below, you initiate a secure hardware-locked session.
                        </div>
                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] transition-all
                                ${isProcessing
                                    ? 'bg-white/10 text-white/20 cursor-wait'
                                    : 'bg-cyan-500 text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                }`}
                        >
                            {isProcessing ? 'SYNCHRONIZING...' : 'INITIALIZE_PAYMENT'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};













