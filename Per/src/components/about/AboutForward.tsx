import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FORWARD } from '../../data/about-manifesto';
import { Button } from '../Button';
import { Container } from '../Container';
import { PageBreadcrumb } from '../PageBreadcrumb';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function AboutForward() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
    }));

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = (particles[i].x - particles[j].x) * width;
          const dy = (particles[i].y - particles[j].y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(254,163,39,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x * width, particles[i].y * height);
            ctx.lineTo(particles[j].x * width, particles[j].y * height);
            ctx.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        ctx.fillStyle = 'rgba(254,163,39,0.65)';
        ctx.beginPath();
        ctx.arc(particle.x * width, particle.y * height, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <section className="relative overflow-hidden bg-ink pt-[72px] text-white px-nav-x max-md:px-nav-x-mobile">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        aria-hidden="true"
      />

      <Container className="relative z-[3] py-12 md:py-16">
        <PageBreadcrumb current="About" />
      </Container>

      <div className="relative z-[2] flex min-h-[calc(90svh-10rem)] items-center justify-center pb-section-y max-md:pb-section-y-mobile">
        <div className="mx-auto max-w-[880px] text-center">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-snug tracking-tight text-white"
        >
          {FORWARD.statement}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.35em] text-accent">
            Per Aspera
          </p>
          <p className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold text-white">
            {FORWARD.tagline}
          </p>
          <div className="mt-10">
            <Button variant="yellow" href="/#contact">
              Start Building With Us ↗
            </Button>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
