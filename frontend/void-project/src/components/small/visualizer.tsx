import React, { memo } from 'react';

interface VisProps {
   authError: boolean;
    setAuthError: React.Dispatch<React.SetStateAction<boolean>>;
    
}


export const Visualizer = memo(({ authError }: VisProps) => {
    

    return (
        <div className={`absolute inset-x-0 bottom-[0px] z-10 pointer-events-none h-16 overflow-hidden transition-colors duration-500 bg-black/0`}>
            <div className="flex gap-[1px] w-full h-full items-end justify-center">
                {[...Array(80)].map((_, i) => (
                    <div
                        key={i}
                        
                        className={`flex-1 min-w-[1px] transition-all duration-300 animate-bar ${authError ? 'bg-red-600 shadow-[0_0_15px_red]' : 'bg-cyan-500/60 shadow-[0_0_15px_rgba(34,211,238,0.3)]'}`}
                        style={{
                            
                            '--duration': authError ? `${0.3 + Math.random() * 0.4}s` : `${0.7 + Math.random() * 0.9}s`,
                            '--delay': `${Math.random() * 0.7}s`,
                            height: `${20 + Math.random() * 80}%`
                        } as React.CSSProperties}
                    />
                ))}
            </div>
        </div>
    )
});