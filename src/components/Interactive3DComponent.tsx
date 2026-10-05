import React, { useEffect, useRef, useState } from 'react';
import { Rotate3d, Play, Pause, Layers, Sparkles } from 'lucide-react';

interface Interactive3DComponentProps {
  initialType?: 'microcontroller' | 'resistor' | 'sensor' | 'motor';
}

export const Interactive3DComponent: React.FC<Interactive3DComponentProps> = ({
  initialType = 'microcontroller'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [componentType, setComponentType] = useState<'microcontroller' | 'resistor' | 'sensor' | 'motor'>(initialType);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [colorTheme, setColorTheme] = useState<'emerald' | 'amber' | 'cyan'>('emerald');
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);

  // 3D angles in radians
  const anglesRef = useRef<{ yaw: number; pitch: number; roll: number }>({
    yaw: 0.7,
    pitch: 0.45,
    roll: 0.1
  });
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulseTime = 0;

    const render = () => {
      // Auto rotation
      if (isRotating && !isDraggingRef.current) {
        anglesRef.current.yaw += 0.009;
        anglesRef.current.pitch = 0.45 + Math.sin(pulseTime * 0.015) * 0.1;
      }
      pulseTime++;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Center of canvas
      const cx = width / 2;
      const cy = height / 2;
      const focalLength = 320;

      // Color scheme
      const colors = {
        emerald: {
          accent: '#10b981',
          trace: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)',
          pin: '#e2e8f0',
          base: '#0f172a'
        },
        amber: {
          accent: '#f59e0b',
          trace: '#d97706',
          glow: 'rgba(245, 158, 11, 0.25)',
          pin: '#fcd34d',
          base: '#1c1917'
        },
        cyan: {
          accent: '#06b6d4',
          trace: '#0891b2',
          glow: 'rgba(6, 182, 212, 0.25)',
          pin: '#cffafe',
          base: '#082f49'
        }
      }[colorTheme];

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
      ctx.lineWidth = 1;
      const gridSpacing = 24;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3D rotation helper
      const project = (x: number, y: number, z: number) => {
        const { yaw, pitch, roll } = anglesRef.current;

        // Yaw (Y axis)
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        let x1 = x * cosY + z * sinY;
        let y1 = y;
        let z1 = -x * sinY + z * cosY;

        // Pitch (X axis)
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        let x2 = x1;
        let y2 = y1 * cosP - z1 * sinP;
        let z2 = y1 * sinP + z1 * cosP;

        // Roll (Z axis)
        const cosR = Math.cos(roll);
        const sinR = Math.sin(roll);
        let x3 = x2 * cosR - y2 * sinR;
        let y3 = x2 * sinR + y2 * cosR;
        let z3 = z2;

        // Camera distance translation
        const distance = 400;
        const scale = focalLength / (distance + z3);
        return {
          px: cx + x3 * scale,
          py: cy + y3 * scale,
          scale,
          zDepth: z3
        };
      };

      // Draw depending on model
      if (componentType === 'microcontroller') {
        // Draw IC Body: Dimensions W=160, H=30, D=90
        const hw = 75;
        const hh = 14;
        const hd = 45;

        const vertices = [
          [-hw, -hh, -hd],
          [hw, -hh, -hd],
          [hw, hh, -hd],
          [-hw, hh, -hd],
          [-hw, -hh, hd],
          [hw, -hh, hd],
          [hw, hh, hd],
          [-hw, hh, hd]
        ];

        const projected = vertices.map(v => project(v[0], v[1], v[2]));

        // Faces definitions
        const faces = [
          { indices: [0, 1, 2, 3], normalZ: -1, label: 'front' },
          { indices: [4, 5, 6, 7], normalZ: 1, label: 'back' },
          { indices: [0, 1, 5, 4], normalZ: -1, label: 'top' }, // IC top face
          { indices: [2, 3, 7, 6], normalZ: 1, label: 'bottom' },
          { indices: [0, 3, 7, 4], normalZ: -1, label: 'left' },
          { indices: [1, 2, 6, 5], normalZ: 1, label: 'right' }
        ];

        // Draw IC top face background
        if (!wireframeOnly) {
          const topFace = faces[2];
          ctx.beginPath();
          topFace.indices.forEach((idx, i) => {
            const p = projected[idx];
            if (i === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          });
          ctx.closePath();
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = colors.accent;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Notch circle on pin 1 end
          const notchPos = project(-hw + 14, -hh - 1, 0);
          ctx.beginPath();
          ctx.arc(notchPos.px, notchPos.py, 5 * notchPos.scale, 0, Math.PI * 2);
          ctx.fillStyle = colors.trace;
          ctx.fill();

          // Silicon Die text
          const textPos = project(0, -hh - 2, 0);
          ctx.save();
          ctx.font = `${Math.round(11 * textPos.scale)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = colors.accent;
          ctx.textAlign = 'center';
          ctx.fillText('ATMEGA328P · SALVAGED', textPos.px, textPos.py);
          ctx.font = `${Math.round(9 * textPos.scale)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('16MHz · 5V TTL', textPos.px, textPos.py + 14 * textPos.scale);
          ctx.restore();
        }

        // Draw IC Dual In-line Pins (14 pins on each side)
        const pinCount = 8;
        for (let i = 0; i < pinCount; i++) {
          const pxOffset = -hw + 16 + (i * (hw * 2 - 32) / (pinCount - 1));

          // Side 1 pins (+Z direction)
          const pin1Base = project(pxOffset, 0, hd);
          const pin1Out = project(pxOffset, 12, hd + 22);
          const pin1Down = project(pxOffset, 28, hd + 22);

          ctx.beginPath();
          ctx.moveTo(pin1Base.px, pin1Base.py);
          ctx.lineTo(pin1Out.px, pin1Out.py);
          ctx.lineTo(pin1Down.px, pin1Down.py);
          ctx.strokeStyle = colors.pin;
          ctx.lineWidth = 2.5 * pin1Base.scale;
          ctx.stroke();

          // Side 2 pins (-Z direction)
          const pin2Base = project(pxOffset, 0, -hd);
          const pin2Out = project(pxOffset, 12, -hd - 22);
          const pin2Down = project(pxOffset, 28, -hd - 22);

          ctx.beginPath();
          ctx.moveTo(pin2Base.px, pin2Base.py);
          ctx.lineTo(pin2Out.px, pin2Out.py);
          ctx.lineTo(pin2Down.px, pin2Down.py);
          ctx.strokeStyle = colors.pin;
          ctx.lineWidth = 2.5 * pin2Base.scale;
          ctx.stroke();
        }

        // Wireframe edges of the main box
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = wireframeOnly ? 1.5 : 1;
        edges.forEach(([start, end]) => {
          const p1 = projected[start];
          const p2 = projected[end];
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        });

      } else if (componentType === 'resistor') {
        // Draw Resistor Cylinder & Leads
        const bodyRadius = 18;
        const bodyLength = 90;

        // Long leads
        const leadLeft = project(-140, 0, 0);
        const leadLeftBody = project(-bodyLength / 2, 0, 0);
        const leadRightBody = project(bodyLength / 2, 0, 0);
        const leadRight = project(140, 0, 0);

        ctx.beginPath();
        ctx.moveTo(leadLeft.px, leadLeft.py);
        ctx.lineTo(leadLeftBody.px, leadLeftBody.py);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(leadRightBody.px, leadRightBody.py);
        ctx.lineTo(leadRight.px, leadRight.py);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Resistor body outline
        const segments = 16;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const y = Math.cos(angle) * bodyRadius;
          const z = Math.sin(angle) * bodyRadius;

          const pStart = project(-bodyLength / 2, y, z);
          const pEnd = project(bodyLength / 2, y, z);

          ctx.beginPath();
          ctx.moveTo(pStart.px, pStart.py);
          ctx.lineTo(pEnd.px, pEnd.py);
          ctx.strokeStyle = wireframeOnly ? colors.accent : '#fed7aa';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Color Bands: 220Ω (Red, Red, Brown, Gold)
        const bands = [
          { pos: -25, color: '#ef4444' }, // Red (2)
          { pos: -10, color: '#ef4444' }, // Red (2)
          { pos: 10, color: '#78350f' },  // Brown (x10)
          { pos: 28, color: '#eab308' }   // Gold (±5%)
        ];

        bands.forEach(band => {
          ctx.beginPath();
          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const y = Math.cos(angle) * (bodyRadius + 1);
            const z = Math.sin(angle) * (bodyRadius + 1);
            const p = project(band.pos, y, z);
            if (i === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          }
          ctx.closePath();
          ctx.fillStyle = band.color;
          ctx.fill();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

      } else if (componentType === 'sensor') {
        // Draw HC-SR04 Ultrasonic Sensor with twin acoustic transducers
        // PCB base plate
        const pcbCorners = [
          project(-75, 30, -30),
          project(75, 30, -30),
          project(75, 30, 30),
          project(-75, 30, 30)
        ];

        ctx.beginPath();
        pcbCorners.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        });
        ctx.closePath();
        ctx.fillStyle = '#064e3b';
        ctx.fill();
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Twin Transducer Cans (TX and RX)
        const centers = [-36, 36];
        centers.forEach((cxOffset, cIndex) => {
          const canRadius = 22;
          const canHeight = 45;

          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const x = cxOffset + Math.cos(angle) * canRadius;
            const z = Math.sin(angle) * canRadius;

            const pBase = project(x, 30, z);
            const pTop = project(x, 30 - canHeight, z);

            ctx.beginPath();
            ctx.moveTo(pBase.px, pBase.py);
            ctx.lineTo(pTop.px, pTop.py);
            ctx.strokeStyle = colors.pin;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          // Top mesh
          const pCenterTop = project(cxOffset, 30 - canHeight, 0);
          ctx.beginPath();
          ctx.arc(pCenterTop.px, pCenterTop.py, canRadius * pCenterTop.scale, 0, Math.PI * 2);
          ctx.fillStyle = cIndex === 0 ? '#1e293b' : '#334155';
          ctx.fill();
          ctx.strokeStyle = colors.accent;
          ctx.stroke();
        });

      } else if (componentType === 'motor') {
        // Draw DC Motor Cylindrical Canister & Shaft
        const motorRadius = 32;
        const motorLength = 70;

        // Front shaft
        const shaftBase = project(0, 0, -motorLength / 2);
        const shaftTip = project(0, 0, -motorLength / 2 - 35);
        ctx.beginPath();
        ctx.moveTo(shaftBase.px, shaftBase.py);
        ctx.lineTo(shaftTip.px, shaftTip.py);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 4 * shaftBase.scale;
        ctx.stroke();

        // Motor Canister ribs
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2;
          const x = Math.cos(angle) * motorRadius;
          const y = Math.sin(angle) * motorRadius;

          const pFront = project(x, y, -motorLength / 2);
          const pBack = project(x, y, motorLength / 2);

          ctx.beginPath();
          ctx.moveTo(pFront.px, pFront.py);
          ctx.lineTo(pBack.px, pBack.py);
          ctx.strokeStyle = colors.accent;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Back terminals
        const term1 = project(14, 0, motorLength / 2 + 12);
        const term2 = project(-14, 0, motorLength / 2 + 12);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(term1.px - 3, term1.py - 3, 6, 6);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(term2.px - 3, term2.py - 3, 6, 6);
      }

      // Draw subtle pulsed glow at center
      const centerPulse = project(0, 0, 0);
      const glowGrad = ctx.createRadialGradient(
        centerPulse.px,
        centerPulse.py,
        2,
        centerPulse.px,
        centerPulse.py,
        90 * centerPulse.scale
      );
      glowGrad.addColorStop(0, colors.glow);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerPulse.px, centerPulse.py, 90 * centerPulse.scale, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [componentType, isRotating, colorTheme, wireframeOnly]);

  // Mouse drag handlers for manual 3D tilt
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    anglesRef.current.yaw += deltaX * 0.01;
    anglesRef.current.pitch += deltaY * 0.01;

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;

    anglesRef.current.yaw += deltaX * 0.01;
    anglesRef.current.pitch += deltaY * 0.01;

    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-950/90 p-5 overflow-hidden backdrop-blur-md">
      {/* Header controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
            3D Salvage Component Visualizer
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            (Drag to rotate 360°)
          </span>
        </div>

        {/* Model Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setComponentType('microcontroller')}
            className={`px-2.5 py-1 rounded transition-colors ${componentType === 'microcontroller' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            IC Chip
          </button>
          <button
            onClick={() => setComponentType('resistor')}
            className={`px-2.5 py-1 rounded transition-colors ${componentType === 'resistor' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            Resistor
          </button>
          <button
            onClick={() => setComponentType('sensor')}
            className={`px-2.5 py-1 rounded transition-colors ${componentType === 'sensor' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            Ultrasonic
          </button>
          <button
            onClick={() => setComponentType('motor')}
            className={`px-2.5 py-1 rounded transition-colors ${componentType === 'motor' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            DC Motor
          </button>
        </div>
      </div>

      {/* 3D Canvas element */}
      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center bg-slate-900/40 rounded-xl border border-slate-800/80 cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={560}
          height={320}
          className="w-full h-full object-contain"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Bottom floating micro-controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 rounded text-xs transition-colors ${isRotating ? 'text-emerald-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-800'}`}
              title={isRotating ? 'Pause rotation' : 'Start rotation'}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setWireframeOnly(!wireframeOnly)}
              className={`p-1.5 rounded text-xs transition-colors ${wireframeOnly ? 'text-emerald-400 bg-slate-800' : 'text-slate-400 hover:bg-slate-800'}`}
              title="Toggle Wireframe Vector mode"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                anglesRef.current = { yaw: 0.7, pitch: 0.45, roll: 0.1 };
              }}
              className="p-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800"
              title="Reset 3D camera"
            >
              <Rotate3d className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color theme chips */}
          <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1">
            <button
              onClick={() => setColorTheme('emerald')}
              className={`w-3.5 h-3.5 rounded-full bg-emerald-500 transition-transform ${colorTheme === 'emerald' ? 'scale-125 ring-2 ring-emerald-400/50' : 'opacity-60'}`}
              title="Emerald Eco Theme"
            />
            <button
              onClick={() => setColorTheme('amber')}
              className={`w-3.5 h-3.5 rounded-full bg-amber-500 transition-transform ${colorTheme === 'amber' ? 'scale-125 ring-2 ring-amber-400/50' : 'opacity-60'}`}
              title="Industrial Amber Theme"
            />
            <button
              onClick={() => setColorTheme('cyan')}
              className={`w-3.5 h-3.5 rounded-full bg-cyan-500 transition-transform ${colorTheme === 'cyan' ? 'scale-125 ring-2 ring-cyan-400/50' : 'opacity-60'}`}
              title="High-Tech Cyan Theme"
            />
          </div>
        </div>
      </div>

      {/* Component Specification Strip */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-lg">
          <span className="text-slate-400 text-[10px] block uppercase">Repurpose Value</span>
          <span className="text-emerald-400 font-semibold">100% Salvageable</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-lg">
          <span className="text-slate-400 text-[10px] block uppercase">Hazard Prevention</span>
          <span className="text-white font-semibold">Zero Toxic Landfill</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-lg">
          <span className="text-slate-400 text-[10px] block uppercase">Desolder Skill</span>
          <span className="text-amber-400 font-semibold">Low Heat (260°C)</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-lg">
          <span className="text-slate-400 text-[10px] block uppercase">Typical Mass</span>
          <span className="text-slate-300 font-semibold tabular-nums">0.5g - 32g / unit</span>
        </div>
      </div>
    </div>
  );
};
