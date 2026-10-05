import React, { useEffect, useRef } from 'react';

export type AriseOrbState = 'idle' | 'thinking' | 'speaking';

interface AriseOrbVisualizerProps {
  state: AriseOrbState;
  size?: number; // width & height in px
}

export const AriseOrbVisualizer: React.FC<AriseOrbVisualizerProps> = ({
  state,
  size = 56
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    let pulse = 0;

    const render = () => {
      angle += state === 'thinking' ? 0.08 : state === 'speaking' ? 0.05 : 0.02;
      pulse += 0.05;

      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const baseRadius = (size / 2) * 0.75;

      // Color palette based on state
      const colors = {
        idle: {
          core: '#10b981',
          ring1: '#059669',
          ring2: '#06b6d4',
          glow: 'rgba(16, 185, 129, 0.35)'
        },
        thinking: {
          core: '#06b6d4',
          ring1: '#3b82f6',
          ring2: '#10b981',
          glow: 'rgba(6, 182, 212, 0.5)'
        },
        speaking: {
          core: '#10b981',
          ring1: '#34d399',
          ring2: '#38bdf8',
          glow: 'rgba(52, 211, 153, 0.6)'
        }
      }[state];

      // Ambient radial glow behind orb
      const glowGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, baseRadius * 1.3);
      glowGrad.addColorStop(0, colors.glow);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Outer dashed/particle orbital ring 1
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = colors.ring1;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Counter-rotating ring 2
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 1.3);
      ctx.strokeStyle = colors.ring2;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Speaking audio-wave arcs or thinking spikes
      if (state === 'speaking') {
        const waveCount = 8;
        for (let i = 0; i < waveCount; i++) {
          const a = (i / waveCount) * Math.PI * 2 + angle;
          const waveLen = Math.sin(pulse * 3 + i) * 5 + 6;
          const x1 = cx + Math.cos(a) * (baseRadius * 0.88);
          const y1 = cy + Math.sin(a) * (baseRadius * 0.88);
          const x2 = cx + Math.cos(a) * (baseRadius * 0.88 + waveLen);
          const y2 = cy + Math.sin(a) * (baseRadius * 0.88 + waveLen);

          ctx.strokeStyle = colors.ring2;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // Central glowing core orb
      const corePulse = Math.sin(pulse) * 1.5;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.42 + corePulse);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.5, colors.core);
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.42 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Core rim highlight
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx - 2, cy - 2, (baseRadius * 0.38), -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [state, size]);

  return (
    <div
      className="relative flex items-center justify-center shrink-0 cursor-pointer"
      style={{ width: size, height: size }}
      title={`ARISE State: ${state.toUpperCase()}`}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
