import React, { useState } from 'react';
import bgr2 from '../../assets/bgr3.jpeg'
import { CheckoutPage } from './purchase';


const CyberFrameNeon = () => (
    <div className="absolute inset-0 pointer-events-none z-0">

        <div 
            className="absolute inset-0 opacity-50 mix-blend-screen"
            style={{ 
                backgroundImage: `url(${bgr2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                
                maskImage: 'radial-gradient(circle, transparent 30%, black 100%)',
                WebkitMaskImage: 'radial-gradient(circle, transparent 30%, black 100%)'
            }} 
        />

        
        {[0, 90, 180, 270].map((rotation) => (
            <div
                key={rotation}
                className="absolute w-32 h-32 opacity-80"
                style={{
                    top: rotation < 180 ? 0 : 'auto',
                    bottom: rotation >= 180 ? 0 : 'auto',
                    left: rotation === 0 || rotation === 270 ? 0 : 'auto',
                    right: rotation === 90 || rotation === 180 ? 0 : 'auto',
                    transform: `rotate(${rotation}deg)`,
                }}
            >
             
                <div className="absolute top-0 left-0 w-full h-[3px] bg-cyan-500 shadow-[0_0_20px_#22d3ee,0_0_40px_rgba(34,211,238,0.5)] animate-pulse" />
               
                <div className="absolute top-0 left-0 h-full w-[3px] bg-cyan-500 shadow-[0_0_20px_#22d3ee,0_0_40px_rgba(34,211,238,0.5)] animate-pulse" />
           
                <div className="absolute top-[-4px] left-[-4px] w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
            </div>
        ))}

        

        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-black tracking-[0.8em] text-cyan-500/60 uppercase">
            Available Tiers System
            <div className="absolute left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_15px_#22d3ee] mt-1" />
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-black tracking-[0.8em] text-cyan-500/60 uppercase">
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 absolute left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_15px_#22d3ee] mt-1" />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 absolute left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_15px_#22d3ee] mt-1" />

    </div>
);




const PriceCarousel = ({ user, openAuthModal, openPurchase }: { user: any, openAuthModal: () => void, openPurchase: (plan: any) => void }) => {
    const [index, setIndex] = useState(1);
    const plans = [
        { id: 0, name: "Trial Access", price: "499₽", period: "24 HOURS", features: ["Full Access", "24/7 Support"] },
        { id: 1, name: "Standard Pro", price: "2499₽", period: "7 DAYS", features: ["Full Access", "Undetected", "Cloud Configs"] },
        { id: 2, name: "Ultimate Void", price: "5999₽", period: "30 DAYS", features: ["Full Access", "Early Access", "Special Role"] },
    ];

    const next = () => setIndex((index + 1) % plans.length);
    const prev = () => setIndex((index - 1 + plans.length) % plans.length);


    const handlePurchaseClick = (plan: any) => {
        if (!user) {
           
            openAuthModal();
        } else {
          
            openPurchase(plan);
        }
    };

    return (
        <section className="relative w-full h-[750px] flex items-center justify-center bg-[#07090d]/70 overflow-hidden border-y border-white/5 py-12">

            <CyberFrameNeon />

           
            <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20">
                <div className="flex items-center gap-3">
                   
                    <div className="flex flex-col gap-3">
                        {[...Array(12)].map((_, i) => <div key={i} className="h-[2px] w-6 bg-cyan-500 shadow-[0_0_10px_#22d3ee] animate-pulse" />)}
                    </div>
                </div>
            </div>

            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20">
                <div className="flex items-center gap-3 flex-row-reverse">
                    
                    <div className="flex flex-col gap-3 items-end">
                        {[...Array(12)].map((_, i) => <div key={i} className="h-[2px] w-6 bg-cyan-500 shadow-[0_0_10px_#22d3ee] animate-pulse" />)}
                    </div>
                </div>
            </div>

        
            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">

              
                <button
                    onClick={prev}
                    className="absolute left-0 z-50 p-6 border border-cyan-500/30 bg-black/40 hover:border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 transition-all active:scale-90"
                >
                    <span className="text-3xl font-black">{'<'}</span>
                </button>

           
                <div className="relative flex items-center justify-center w-full h-full">
                    {plans.map((plan, i) => {
                        let offset = i - index;
                        if (index === 0 && i === plans.length - 1) offset = -1;
                        if (index === plans.length - 1 && i === 0) offset = 1;
                        const isActive = i === index;

                        return (
                            <div
                                key={plan.id}
                                className={`absolute w-80 p-10 border transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between ${isActive
                                    ? 'z-40 scale-110 opacity-100 border-cyan-500 bg-[#0d1117] shadow-[0_0_60px_-15px_rgba(34,211,238,0.4)]'
                                    : 'z-10 scale-90 opacity-70 border-white/10 bg-black'
                                    }`}
                                style={{ transform: `translateX(${offset * 380}px) rotateY(${offset * -20}deg)` }}
                            >
                            
                                <div>
                                    <span className="text-[10px] font-black text-cyan-400 tracking-widest">{plan.period}</span>
                                    <h3 className="text-3xl font-black italic uppercase text-white mt-4 mb-6 leading-none">{plan.name}</h3>
                                    <ul className="space-y-2">
                                        {plan.features.map((f, idx) => (
                                            <li key={idx} className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                                <div className="w-1 h-1 bg-cyan-500" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <div className="text-4xl font-black italic text-white mb-6">{plan.price}</div>
                                    <button 
                                    onClick={() => handlePurchaseClick(plan)}
                                    className={`w-full py-4 text-[10px] transition-all active:scale-90 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all font-black uppercase tracking-[0.4em] transition-all ${isActive ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/20'
                                        }`}>
                                        Purchase
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

         
                <button
                    onClick={next}
                    className="absolute right-0 z-50 p-6 border border-cyan-500/30 bg-black/40 hover:border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 transition-all active:scale-90"
                >
                    <span className="text-3xl font-black">{'>'}</span>
                </button>

            </div>
        </section>
    );
};

export default PriceCarousel;