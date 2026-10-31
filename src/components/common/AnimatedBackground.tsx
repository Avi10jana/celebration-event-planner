import React, { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  alphaDir: number;
  vx: number;
  vy: number;
  pulse: number;
  pulseSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const COLORS = [
  'rgba(245, 158, 11,',   // warm amber gold
  'rgba(251, 191, 36,',   // bright champagne gold
  'rgba(217, 119, 6,',    // deep bronze gold
  'rgba(253, 230, 138,',  // soft pale champagne
  'rgba(180, 83, 9,',     // antique bronze
  'rgba(234, 179, 8,',    // metallic gold
  'rgba(254, 243, 199,',  // shimmering starlight gold
  'rgba(249, 115, 22,',   // warm sunset flame
];

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const orbsRef   = useRef<Orb[]>([]);
  const partsRef  = useRef<Particle[]>([]);
  const timeRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Spawn bokeh orbs ── */
    const spawnOrbs = () => {
      const count = Math.min(22, Math.floor(window.innerWidth / 80));
      orbsRef.current = Array.from({ length: count }, () => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
          x:          Math.random() * canvas.width,
          y:          Math.random() * canvas.height,
          radius:     60 + Math.random() * 160,
          color,
          alpha:      0.06 + Math.random() * 0.10,
          alphaDir:   Math.random() > 0.5 ? 1 : -1,
          vx:         (Math.random() - 0.5) * 0.28,
          vy:         (Math.random() - 0.5) * 0.22,
          pulse:      Math.random() * Math.PI * 2,
          pulseSpeed: 0.003 + Math.random() * 0.006,
        };
      });
    };
    spawnOrbs();

    /* ── Spawn sparkle particles ── */
    const spawnParticle = () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      partsRef.current.push({
        x:       Math.random() * canvas.width,
        y:       canvas.height + 10,
        size:    1 + Math.random() * 2.5,
        color,
        alpha:   0,
        vx:      (Math.random() - 0.5) * 0.6,
        vy:      -(0.5 + Math.random() * 1.2),
        life:    0,
        maxLife: 180 + Math.random() * 200,
      });
    };

    let particleTimer = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      timeRef.current++;
      particleTimer++;

      /* spawn new sparkle every ~18 frames */
      if (particleTimer % 18 === 0 && partsRef.current.length < 80) {
        spawnParticle();
      }

      /* full clear */
      ctx.clearRect(0, 0, W, H);

      /* ── deep background fill ── */
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0,   '#050608');
      bg.addColorStop(0.5, '#08090f');
      bg.addColorStop(1,   '#040507');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* ── bokeh orbs ── */
      orbsRef.current.forEach(orb => {
        orb.pulse += orb.pulseSpeed;
        const breathe   = Math.sin(orb.pulse) * 0.025;
        const curAlpha  = Math.max(0.02, Math.min(0.18, orb.alpha + breathe));
        const curRadius = orb.radius * (1 + Math.sin(orb.pulse * 0.7) * 0.08);

        orb.x += orb.vx;
        orb.y += orb.vy;

        /* wrap edges */
        if (orb.x < -orb.radius)  orb.x = W + orb.radius;
        if (orb.x > W + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius)  orb.y = H + orb.radius;
        if (orb.y > H + orb.radius) orb.y = -orb.radius;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, curRadius);
        g.addColorStop(0,   `${orb.color} ${curAlpha})`);
        g.addColorStop(0.5, `${orb.color} ${curAlpha * 0.45})`);
        g.addColorStop(1,   `${orb.color} 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, curRadius, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      /* ── film grain overlay ── */
      if (timeRef.current % 3 === 0) {
        const grainData = ctx.createImageData(W, H);
        const data = grainData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() - 0.5) * 18;
          data[i]   = 128 + v;
          data[i+1] = 128 + v;
          data[i+2] = 128 + v;
          data[i+3] = 6;   // very low alpha
        }
        ctx.putImageData(grainData, 0, 0);
      }

      /* ── sparkle particles ── */
      partsRef.current = partsRef.current.filter(p => p.life < p.maxLife);
      partsRef.current.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        /* fade in first 20%, then fade out last 30% */
        if (progress < 0.2)       p.alpha = progress / 0.2;
        else if (progress > 0.7)  p.alpha = (1 - progress) / 0.3;
        else                       p.alpha = 1;

        p.alpha *= 0.75; /* cap brightness */

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();

        /* tiny cross-sparkle on bigger particles */
        if (p.size > 2) {
          ctx.strokeStyle = `${p.color} ${p.alpha * 0.6})`;
          ctx.lineWidth   = 0.5;
          const arm = p.size * 2.5;
          ctx.beginPath();
          ctx.moveTo(p.x - arm, p.y);
          ctx.lineTo(p.x + arm, p.y);
          ctx.moveTo(p.x, p.y - arm);
          ctx.lineTo(p.x, p.y + arm);
          ctx.stroke();
        }
      });

      /* ── subtle vignette ── */
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.9);
      vig.addColorStop(0,   'rgba(0,0,0,0)');
      vig.addColorStop(0.6, 'rgba(0,0,0,0.08)');
      vig.addColorStop(1,   'rgba(0,0,0,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        display: 'block',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};
