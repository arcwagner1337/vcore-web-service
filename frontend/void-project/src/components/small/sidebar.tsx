

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
    <aside className="shrink-0 w-full md:w-20 border-t md:border-t-0 md:border-r border-[var(--color-border-soft)] bg-black/60 md:bg-black/40 backdrop-blur-lg flex flex-row md:flex-col items-center md:py-8 pb-[env(safe-area-inset-bottom)] md:pb-0 relative z-30 select-none">
      <div className="hidden md:flex mb-20 w-12 h-12 border-2 border-white rotate-45 items-center justify-center font-black text-sm hover:border-accent-cyan transition-colors cursor-pointer group">
        <span className="-rotate-45 group-hover:text-accent-cyan">VC</span>
      </div>

      <nav className="flex w-full md:w-auto flex-1 md:block md:space-y-6">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex-1 md:flex-none h-16 md:h-14 md:w-14 flex items-center justify-center cursor-pointer transition-all relative group
              ${active === item.id ? 'text-accent-cyan' : 'text-slate-600 hover:text-slate-300'}`}
          >
            <span className="text-[9px] md:text-[10px] font-black uppercase md:-rotate-90 tracking-wider md:tracking-widest">
              {item.label}
            </span>
            {active === item.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] md:top-1/2 md:left-[-24px] md:translate-x-0 md:-translate-y-1/2 md:w-[3px] md:h-10 bg-accent-cyan shadow-[0_0_15px_#22d3ee]" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;