import bgr2 from '../../assets/bgr2.jpeg';

const ManifestSection = () => (
  <section className="relative group bg-[#0a0c12] border border-white/5 overflow-hidden">
    
   
    <div className="absolute inset-0 bg-loft-grid opacity-20 group-hover:opacity-40 transition-opacity" />
    
    
    <div 
      className="absolute inset-0 z-0 opacity-[0.37] mix-blend-screen pointer-events-none transition-all duration-1000 group-hover:opacity-[0.47]"
      style={{ 
        backgroundImage: `url(${bgr2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        
        maskImage: 'linear-gradient(to left, black 30%, transparent 60%)',
        WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 60%)'
      }} 
    />

  
    <div className="relative z-10 grid grid-cols-12 gap-10 p-16">
       
      
       <div className="col-span-5 flex flex-col justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-[2px] bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Project: VOIDCORE</span>
          </div>
          
          <h3 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mt-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
             Singularity <span className="text-cyan-400 text-glow-cyan">Node</span>
          </h3>
          
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-6">
             * Loft Project Customs, Leiden Branch
          </div>
       </div>
       
  
       <div className="col-span-7 space-y-8 text-slate-300 font-medium tracking-wide relative z-10">
          <p className="border-l-2 border-cyan-500/30 pl-6 py-2 bg-gradient-to-r from-cyan-500/5 to-transparent">
             <span className="text-white font-bold">VOIDCORE</span> — это централизованная система управления Direct Memory Access (DMA), разработанная в лабораториях <span className="text-white font-bold">Loft Project Customs</span>. Это не просто лоадер; это ваша точка доступа в саму бездну кода.
          </p>
          
          <p className="pl-6">
             Мы создали его для тех, кто понимает: <span className="text-white font-bold">контроль начинается там, где заканчиваются стандартные разрешения</span>. Стабильный байпас, динамическое маппинг смещений и облачная синхронизация конфигов в один клик. Продуктивность в стиле Лофт.
          </p>
          
       
          <div className="h-[2px] w-1/2 bg-gradient-to-r from-cyan-500 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)] mt-10" />
       </div>
    </div>


    <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
  </section>
);

export default ManifestSection;