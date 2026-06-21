import React, { useState } from 'react';
import authGif from '../../assets/auth.gif';
import custimGif from '../../assets/customiz.gif';
import bgr2 from '../../assets/bgr4.jpeg'


const GuideSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "Authorization",
            desc: "Запустите VOIDCORE.exe. Вставьте ваш лицензионный ключ в поле ввода и нажмите Login.",
            cmd: "Action: Enter License Key",
            media: authGif,
        },
        {
            title: "Customization",
            desc: "Выберите и включите желаемые функции",
            cmd: "Action: Manual Map Driver",
            media: custimGif
        },
        {
            title: "Preparation",
            desc: "Отключите Windows Defender. Это необходимо для корректного маппинга драйвера в память системы.",
            cmd: "Action: Disable Real-time Protection",
            media: authGif
        },

        {
            title: "Injection",
            desc: "Нажмите кнопку 'LOAD'. Дождитесь статуса 'Success' в лаунчере перед запуском игры.",
            cmd: "Action: Manual Map Driver",
            media: authGif
        }
    ];

    return (


        <div className="grid grid-cols-12 gap-px bg-white/5 border border-white/5 overflow-hidden shadow-2xl relative">

        
            <div
                className="absolute inset-0 z-0 opacity-[0.39] mix-blend-screen pointer-events-none blur-[1px]"
                style={{
                    backgroundImage: `url(${bgr2})`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  
                    maskImage: 'radial-gradient(circle, transparent 40%, black 100%)',
                    WebkitMaskImage: 'radial-gradient(circle, transparent 40%, black 100%)'
                }}
            />

         
            <div className="col-span-2 border-r border-white/5 flex flex-col bg-black/20">
                {steps.map((step, i) => (
                    <button
                        key={i}
                        onMouseEnter={() => setActiveStep(i)}
                        className={`flex-1 p-6 transition-all relative border-b border-white/5 text-left ${activeStep === i ? 'bg-cyan-500/5' : 'opacity-30 hover:opacity-100'
                            }`}
                    >
                        {activeStep === i && <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee]" />}
                        <span className="text-[9px] font-black text-cyan-500 block mb-1">0{i + 1}</span>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white leading-tight">{step.title}</h4>
                    </button>
                ))}
            </div>

           

            <div className="col-span-6 bg-black/40 relative border-r border-white/5 overflow-hidden flex items-center justify-center
                w-full min-h-[500]"

                style={{ aspectRatio: '16 / 9.6' }}
            >
                <img
                    key={activeStep + 'img'}
                    src={steps[activeStep].media}
                    
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-500"
                    alt="Interface View"
                />
                <div className="absolute top-4 left-2 flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    
                </div>
            </div>

         
            <div className="col-span-4 bg-black/60 p-8 flex flex-col justify-between min-h-[400px]">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">VoidCore_Terminal_v2.0</span>
                    </div>

                    <div key={activeStep} className="space-y-4">
                     
                        <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                            {steps[activeStep].desc}
                        </p>

                     
                        <div className="bg-black border border-white/5 p-4 rounded shadow-inner">
                            <code className="text-cyan-400 font-mono text-xs animate-typing block uppercase">
                                {steps[activeStep].cmd}
                            </code>
                        </div>
                    </div>
                </div>

         
                <div className="text-[9px] font-mono text-slate-700 flex justify-between border-t border-white/5 pt-4 uppercase">
                    <span>LOFT PROJECT // INSTRUCTIONS</span>
                    <span>EST: 2026</span>
                </div>
            </div>

        </div>
    );
};

export default GuideSection;