const Sidebar = ({ active, setActive }: any) => {
  const items = [
    { id: 'HOME', label: 'Main' },
    { id: 'PRICES', label: 'SHOP' },
    { id: 'GUIDE', label: 'Guide' },
    { id: 'FAQ', label: 'Info' },
    { id: 'DOWNLOAD', label: 'Download' },
    { id: 'PREVIEW', label: 'Preview' },


  ];

  return (
    <aside className="w-20 border-r border-[var(--color-border-soft)] bg-black/40 backdrop-blur-lg flex flex-col items-center py-8 relative z-20 select-none">
      <div className="mb-20 w-12 h-12 border-2 border-white rotate-45 flex items-center justify-center font-black text-sm hover:border-accent-cyan transition-colors cursor-pointer group">
        <span className="-rotate-45 group-hover:text-accent-cyan">VC</span>
      </div>
      
      <nav className="flex-1 space-y-6">
        {items.map(item => (
          <div 
            key={item.id}
            onClick={() => setActive(item.id)}
            
            className={`w-14 h-14 flex items-center justify-center cursor-pointer transition-all relative group
              ${active === item.id ? 'text-accent-cyan' : 'text-slate-600 hover:text-slate-300'}`}
          >
            <span className="text-[10px] font-black uppercase -rotate-90 tracking-widest">{item.label}</span>
            {active === item.id && (
              <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-[3px] h-10 bg-accent-cyan shadow-[0_0_15px_#22d3ee]" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;