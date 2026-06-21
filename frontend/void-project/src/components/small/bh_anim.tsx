import React, { memo } from 'react';





export const BlackHole = memo(() => {
    return (
        <div className="black-hole-layer pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70">

                <div className="relative flex items-center justify-center">

              
                    <div className="absolute flex items-center justify-center">
                        {[...Array(70)].map((_, i) => {
                            const rotation = (i * 360) / 70;
                            const randomDelay = Math.random() * -2;
                            const randomDuration = 0.8 + Math.random() * 0.7;

                            return (
                                <div
                                    key={i}
                                    className="absolute w-[5px] bg-cyan-500 shadow-[0_0_25px_rgba(34,211,238,0.5)] rounded-full animate-bh"
                                    style={{
                                        transformOrigin: 'center center',
                                        '--rotation': `${rotation}deg`,
                                        '--duration': `${randomDuration}s`,
                                        '--delay': `${randomDelay}s`,
                                       
                                        height: `${250 + Math.random() * 150}px`,
                                       
                                        transform: `rotate(${rotation}deg) translateY(-60px)`,
                                        opacity: 0.3 + Math.random() * 0.4
                                    } as React.CSSProperties}
                                />
                            );
                        })}
                    </div>

              
                    <div className="w-32 h-32 bg-black rounded-full shadow-[0_0_120px_rgba(34,211,238,0.6)] z-20 border-2 border-cyan-500/30 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_70%)] animate-pulse" />
                    </div>
                </div>

               
                <div className="absolute w-[1000px] h-[1000px] bg-cyan-500/[0.08] blur-[180px] rounded-full animate-pulse" />
            </div>
        </div>
    );
});
