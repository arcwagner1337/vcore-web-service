import React, { useState } from 'react';




const Terminal = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      title: "Preparation", 
      desc: "Disable Windows Defender and any third-party AV solutions to prevent driver block.",
      cmd: "> sc stop WinDefend && void_mapper.exe --init"
    },
    { 
      title: "Authentication", 
      desc: "Enter your unique license key in the VOIDCORE terminal to sync with cloud.",
      cmd: "> void_auth.exe --key XXXX-XXXX-XXXX-XXXX"
    },
    { 
      title: "Mapping", 
      desc: "Select the target process (e.g. cs2.exe) and wait for the manual map completion.",
      cmd: "> void_core.exe --inject --process cs2.exe"
    },
    { 
      title: "Singularity", 
      desc: "Press INSERT in-game to open the VOID menu. Enjoy the control.",
      cmd: "[SUCCESS] Singularity stabilized. GUI Rendered."
    }
  ];

  return (
    <div className="grid grid-cols-12 gap-8 bg-[#0a0c12] border border-white/5 p-1">
    
      <div className="col-span-4 border-r border-white/5 p-8 space-y-4">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`w-full text-left p-4 transition-all border ${
              activeStep === i 
              ? 'border-cyan-500/50 bg-cyan-500/5 translate-x-2' 
              : 'border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black ${activeStep === i ? 'text-cyan-400' : 'text-slate-600'}`}>0{i + 1}</span>
              <h4 className={`text-sm font-black uppercase tracking-widest ${activeStep === i ? 'text-white' : 'text-slate-500'}`}>
                {step.title}
              </h4>
            </div>
          </button>
        ))}
      </div>

     
      <div className="col-span-8 bg-black/60 p-8 flex flex-col justify-between min-h-[350px]">
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
               <code className="text-cyan-400 font-mono text-xs animate-typing block">
                 {steps[activeStep].cmd}
               </code>
            </div>
          </div>
        </div>

        <div className="text-[9px] font-mono text-slate-700 flex justify-between border-t border-white/5 pt-4">
           <span>LOFT PROJECT CUSTOMS // DMA_MAPPING</span>
           <span>ESTABLISHED: 2026</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;