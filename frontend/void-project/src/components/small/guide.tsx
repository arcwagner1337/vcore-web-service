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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/5 border border-white/5 overflow-hidden shadow-2xl relative">

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

           
            <div className="md:col-span-2 md:border-r border-white/5 grid grid-cols-2 md:flex md:flex-col bg-black/20 relative z-10">
                {steps.map((step, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        onMouseEnter={() => setActiveStep(i)}
                        className={`md:flex-1 p-4 md:p-6 transition-all relative border-b border-white/5 text-left ${activeStep === i ? 'bg-cyan-500/5' : 'opacity-40 md:opacity-30 hover:opacity-100'
                            }`}
                    >
                        {activeStep === i && (
                            <div className="absolute left-0 top-0 w-full h-[3px] md:w-1 md:h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee]" />
                        )}
                        <span className="text-[9px] font-black text-cyan-500 block mb-1">0{i + 1}</span>
                        <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-wider md:tracking-widest text-white leading-tight break-words">
                            {step.title}
                        </h4>
                    </button>
                ))}
            </div>

          
            <div
                className="md:col-span-6 bg-black/40 relative md:border-r border-white/5 overflow-hidden flex items-center justify-center w-full z-10"
                style={{ aspectRatio: '16 / 9.6' }}
            >
                <img
                    key={activeStep + 'img'}
                    src={steps[activeStep].media}
                    className="w-full h-full object-cover opacity-80 md:opacity-60 hover:opacity-100 transition-opacity duration-500"
                    alt="Interface View"
                />
                <div className="absolute top-4 left-2 flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                </div>
            </div>

           
            <div className="md:col-span-4 bg-black/60 p-5 md:p-8 flex flex-col justify-between gap-6 min-h-[240px] md:min-h-[400px] relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest truncate">VoidCore_Terminal_v2.0</span>
                    </div>

                    <div key={activeStep} className="space-y-4">
                        <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                            {steps[activeStep].desc}
                        </p>

                        <div className="bg-black border border-white/5 p-4 rounded shadow-inner">
                            <code className="text-cyan-400 font-mono text-[11px] md:text-xs animate-typing block uppercase break-words">
                                {steps[activeStep].cmd}
                            </code>
                        </div>
                    </div>
                </div>

                <div className="text-[9px] font-mono text-slate-700 flex justify-between gap-2 border-t border-white/5 pt-4 uppercase">
                    <span>LOFT PROJECT // INSTRUCTIONS</span>
                    <span className="shrink-0">EST: 2026</span>
                </div>
            </div>
        </div>
    );
};

export default GuideSection;