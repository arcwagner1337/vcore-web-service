const ScreenshotCard = ({ src, title }: any) => (
  <div className="relative group">
    
    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-cyan-500 rounded-sm blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 z-0" />

   
    <div className="relative z-10 bg-[#07090d] border border-white/10 overflow-hidden">
      
      <img
        src={src}
        alt={title}
        className="w-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-500 scale-[1.01] group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
        <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">{title}</h4>
        <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mt-1">Direct Memory Access View</p>
      </div>
    </div>
  </div>
);

export default ScreenshotCard;