import { useEffect, useRef } from 'react';

interface MeasuredImpactNetworkProps {
  disabled?: boolean;
}

export function MeasuredImpactNetwork({ disabled = false }: MeasuredImpactNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let lastPulse = performance.now();
    let pulsePhase = 0;

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      if (time - lastPulse > 7000) {
        lastPulse = time;
        pulsePhase = 1;
      }

      if (pulsePhase > 0) {
        pulsePhase = Math.max(0, pulsePhase - 0.012);
      }

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.phase += 0.004;
        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = (particles[i].x - particles[j].x) * width;
          const dy = (particles[i].y - particles[j].y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const pulseBoost = pulsePhase * (1 - dist / 140) * 0.35;
            const alpha = Math.min(0.07, (0.035 + pulseBoost) * (1 - dist / 140));
            ctx.strokeStyle = `rgba(255, 169, 77, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x * width, particles[i].y * height);
            ctx.lineTo(particles[j].x * width, particles[j].y * height);
            ctx.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        const twinkle = 0.045 + Math.sin(particle.phase) * 0.015 + pulsePhase * 0.02;
        ctx.fillStyle = `rgba(255, 169, 77, ${Math.min(0.075, twinkle)})`;
        ctx.beginPath();
        ctx.arc(particle.x * width, particle.y * height, 1.1, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [disabled]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.85]"
      aria-hidden="true"
    />
  );
}
