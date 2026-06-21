import bgr2 from '../../assets/bgr4.jpeg'




const getIcon = (label: string, colorClass: string) => {
  const textColor = colorClass.replace('bg-', 'text-');
  const className = `w-4 h-4 opacity-60 group-hover:opacity-100 transition-all duration-300 ${textColor}`;

  switch (label.toLowerCase()) {
    case 'cheat status':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/>
        </svg>
      );
    case 'active users':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case 'current version':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l8-8a1 1 0 0 0 0-1.41L12 2z"/>
          <path d="m7 7-.01.01"/>
        </svg>
      );
    case 'last update':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      );
    case 'server latency':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      );
    default:
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" x2="12" y1="8" y2="12"/>
          <line x1="12" x2="12.01" y1="16" y2="16"/>
        </svg>
      );
  }
};

const StatusPulse = ({ label, value, color = "bg-cyan-500" }: any) => {
 
const shadowConfig: Record<string, { base: string; hover: string; border: string }> = {
    'bg-cyan-500': {
      base: '0 0 20px 1px rgba(6, 182, 212, 0.18)',
      hover: '0 15px 35px -10px rgba(0,0,0,0.8), 0 0 30px 4px rgba(6, 182, 212, 0.4)',
      border: 'border-cyan-500/35 hover:border-cyan-500/60'
    },
    'bg-green-500': {
      base: '0 0 20px 1px rgba(34, 197, 94, 0.18)',
      hover: '0 15px 35px -10px rgba(0,0,0,0.8), 0 0 30px 4px rgba(34, 197, 94, 0.4)',
      border: 'border-green-500/35 hover:border-green-500/60'
    },
    'bg-purple-500': {
      base: '0 0 20px 1px rgba(168, 85, 247, 0.18)',
      hover: '0 15px 35px -10px rgba(0,0,0,0.8), 0 0 30px 4px rgba(168, 85, 247, 0.4)',
      border: 'border-purple-500/35 hover:border-purple-500/60'
    },
    'bg-red-500': {
      base: '0 0 20px 1px rgba(239, 68, 68, 0.18)',
      hover: '0 15px 35px -10px rgba(0,0,0,0.8), 0 0 30px 4px rgba(239, 68, 68, 0.4)',
      border: 'border-red-500/35 hover:border-red-500/60'
    }
  };

  const currentStyle = shadowConfig[color] || shadowConfig['bg-cyan-500'];

  return (
    <div 
      className={`flex-shrink-0 min-w-[280px] bg-[#070a0e] border p-6 relative overflow-hidden group rounded-md transition-all duration-300 ease-out hover:-translate-y-1 ${currentStyle.border}`}
      style={{
        boxShadow: currentStyle.base,
        '--hover-shadow': currentStyle.hover,
      } as React.CSSProperties}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = e.currentTarget.style.getPropertyValue('--hover-shadow')}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = currentStyle.base}
    >
      
  
      <div
        className="absolute inset-0 z-0 opacity-[0.04] group-hover:opacity-[0.1] mix-blend-screen scale-105 group-hover:scale-100 transition-all duration-500 pointer-events-none grayscale contrast-150"
        style={{
          backgroundImage: `url(${bgr2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

     
      <div className={`absolute -right-16 -top-16 w-36 h-36 ${color} opacity-[0.08] group-hover:opacity-[0.22] group-hover:scale-110 transition-all duration-500 rounded-full blur-3xl`} />

     
      <div className="absolute inset-0 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

  
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {getIcon(label, color)}
            
         
            <span className="relative flex h-1.5 w-1.5 ml-0.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${color}`}></span>
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-300 transition-colors duration-300">
              {label}
            </span>
          </div>

        
          <div className="text-2xl font-black italic uppercase tracking-tight text-white/90 group-hover:text-white transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPulse;


