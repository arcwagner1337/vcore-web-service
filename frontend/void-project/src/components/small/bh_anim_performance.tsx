import React, { useRef, useEffect, memo } from 'react';

export const BlackHolePerf = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    
    const rayCount = 70; 
    const rays = Array.from({ length: rayCount }, () => ({
      angle: 0, 
      baseHeight: 250 + Math.random() * 150,
      width: 2 + Math.random() * 2,
      speed: 0.05 + Math.random() * 0.1, 
      offset: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.4
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      rotation += 0.002; 

      rays.forEach((ray, i) => {
        const currentAngle = (i * Math.PI * 2) / rayCount + rotation;
        
        const pulse = Math.sin(Date.now() * 0.005 + ray.offset) * 40;
        const h = ray.baseHeight + pulse;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle);

        
        const grad = ctx.createLinearGradient(0, -60, 0, -60 - h);
        grad.addColorStop(0, `rgba(34, 211, 238, ${ray.opacity})`);
        grad.addColorStop(0.2, `rgba(34, 211, 238, ${ray.opacity * 0.5})`);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width;
        ctx.lineCap = 'round';

        
        const jitter = Math.random() * 2;
        
        ctx.beginPath();
        ctx.moveTo(jitter, -60);
        ctx.lineTo(0, -60 - h);
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
    
      <canvas ref={canvasRef} className="w-full h-full opacity-70" />
      
   
      <div className="absolute flex items-center justify-center">
      
         <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
         
  
         <div className="w-32 h-32 bg-black rounded-full shadow-[0_0_80px_rgba(34,211,238,0.5)] z-20 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_70%)] animate-pulse" />
         </div>
      </div>
    </div>
  );
});