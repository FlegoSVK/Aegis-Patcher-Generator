import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface ParticleBurstProps {
  active: boolean;
  accentColor?: string;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({ active, accentColor = '#3E4B37' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = [accentColor, '#919B82', '#F5F7F2', '#E8A838', '#4ADE80'];
    const initialParticles: Particle[] = [];

    // Spawn 40 particles originating from bottom-right of preview card
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 5;
      initialParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }

    setParticles(initialParticles);

    const startTime = Date.now();
    const duration = 1200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        clearInterval(interval);
        setParticles([]);
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.18, // Gravity
          alpha: Math.max(0, 1 - progress),
        }))
      );
    }, 16);

    return () => clearInterval(interval);
  }, [active, accentColor]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden flex items-center justify-center">
      <div className="relative">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              transform: `translate(${p.x}px, ${p.y}px)`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.alpha,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
