import React, { useEffect, useRef } from 'react';

interface CircularSphereVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  drift: number;
}

export const CircularSphereVisualizer: React.FC<CircularSphereVisualizerProps> = ({
  analyser,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smoothedBinsRef = useRef<number[]>(new Array(72).fill(0));
  const smoothedBassRef = useRef(0);
  const smoothedAvgRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Seed a gentle ring of ambient sparkle particles
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 26 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 0.55 + Math.random() * 0.6,
        speed: 0.0025 + Math.random() * 0.004,
        size: 0.8 + Math.random() * 1.8,
        drift: Math.random() * Math.PI * 2,
      }));
    }

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.24;

      ctx.clearRect(0, 0, width, height);

      const numSpikes = 72;
      let dataArray: Uint8Array = new Uint8Array(new ArrayBuffer(64));
      let avgLevel = 0;
      let bassLevel = 0;
      let midLevel = 0;

      if (isPlaying && analyser) {
        const freqBuffer = new ArrayBuffer(analyser.frequencyBinCount);
        const freqArray = new Uint8Array(freqBuffer);
        analyser.getByteFrequencyData(freqArray);
        dataArray = freqArray;

        let sum = 0;
        let bassSum = 0;
        let midSum = 0;
        const bassCount = Math.min(8, dataArray.length);
        const midStart = bassCount;
        const midEnd = Math.min(40, dataArray.length);

        for (let i = 0; i < bassCount; i++) bassSum += dataArray[i];
        bassLevel = bassSum / (bassCount * 255);

        for (let i = midStart; i < midEnd; i++) midSum += dataArray[i];
        midLevel = midEnd > midStart ? midSum / ((midEnd - midStart) * 255) : 0;

        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        avgLevel = sum / (dataArray.length * 255);
      } else {
        bassLevel = Math.sin(time * 1.5) * 0.08 + 0.12;
        avgLevel = Math.sin(time * 2) * 0.06 + 0.1;
        midLevel = Math.sin(time * 1.8 + 1) * 0.05 + 0.1;
      }

      // Smooth values frame-to-frame to avoid jitter
      smoothedBassRef.current += (bassLevel - smoothedBassRef.current) * 0.35;
      smoothedAvgRef.current += (avgLevel - smoothedAvgRef.current) * 0.25;
      const sBass = smoothedBassRef.current;
      const sAvg = smoothedAvgRef.current;

      const pulseRadius = baseRadius + sBass * 26;
      rotationRef.current += 0.0016 + sAvg * 0.004;

      // 1. Ambient particles drifting around the sphere
      ctx.save();
      particlesRef.current.forEach((p) => {
        p.angle += p.speed * (1 + sAvg * 2);
        const wobble = Math.sin(time * 1.2 + p.drift) * 6;
        const r = pulseRadius * (1.35 + p.radius * 0.55) + wobble;
        const px = centerX + Math.cos(p.angle) * r;
        const py = centerY + Math.sin(p.angle) * r * 0.94;
        const twinkle = 0.35 + Math.abs(Math.sin(time * 2 + p.drift)) * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, p.size + sBass * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 225, 170, ${twinkle * (0.4 + sAvg)})`;
        ctx.shadowColor = '#ffd15c';
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.restore();

      // 2. Outer ambient backlight glow
      const glowGrad = ctx.createRadialGradient(
        centerX, centerY, pulseRadius * 0.6,
        centerX, centerY, pulseRadius * 1.9
      );
      glowGrad.addColorStop(0, `rgba(255, 209, 92, ${0.16 + sBass * 0.28})`);
      glowGrad.addColorStop(0.5, `rgba(255, 45, 120, ${0.08 + sAvg * 0.18})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius * 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Dual-layer radiating equalizer spikes (smoothed, rotating)
      const angleStep = (Math.PI * 2) / numSpikes;
      const bins = smoothedBinsRef.current;

      for (let i = 0; i < numSpikes; i++) {
        const binIndex = Math.floor((i / numSpikes) * Math.min(48, dataArray.length));
        const rawVal = isPlaying && analyser
          ? (dataArray[binIndex] || 0) / 255
          : Math.sin(time * 3 + i * 0.3) * 0.2 + 0.2;
        bins[i] += (rawVal - bins[i]) * 0.4;
      }

      for (let i = 0; i < numSpikes; i++) {
        const angle = i * angleStep - Math.PI / 2 + rotationRef.current;
        const freqVal = bins[i];
        const spikeLength = Math.max(4, freqVal * 46 + sBass * 16);

        const innerR = pulseRadius + 4;
        const spikeStartX = centerX + Math.cos(angle) * innerR;
        const spikeStartY = centerY + Math.sin(angle) * innerR;
        const spikeEndX = centerX + Math.cos(angle) * (innerR + spikeLength);
        const spikeEndY = centerY + Math.sin(angle) * (innerR + spikeLength);

        const spikeGrad = ctx.createLinearGradient(spikeStartX, spikeStartY, spikeEndX, spikeEndY);
        spikeGrad.addColorStop(0, '#ffd15c');
        spikeGrad.addColorStop(0.6, '#ff5c9a');
        spikeGrad.addColorStop(1, '#ff2d78');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(spikeStartX, spikeStartY);
        ctx.lineTo(spikeEndX, spikeEndY);
        ctx.strokeStyle = spikeGrad;
        ctx.lineWidth = Math.max(1.5, Math.min(3, width / 200));
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ff5c9a';
        ctx.shadowBlur = 6 + freqVal * 10;
        ctx.stroke();
        ctx.restore();

        // Fine inner echo spike for extra depth
        const echoLen = spikeLength * 0.4;
        const echoAngle = angle + angleStep * 0.5;
        const echoStartX = centerX + Math.cos(echoAngle) * (innerR - 2);
        const echoStartY = centerY + Math.sin(echoAngle) * (innerR - 2);
        const echoEndX = centerX + Math.cos(echoAngle) * (innerR - 2 + echoLen);
        const echoEndY = centerY + Math.sin(echoAngle) * (innerR - 2 + echoLen);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(echoStartX, echoStartY);
        ctx.lineTo(echoEndX, echoEndY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Glowing golden rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffd15c';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#ffd15c';
      ctx.shadowBlur = 18 + sBass * 22;
      ctx.stroke();
      ctx.restore();

      // 5. Secondary concentric neon ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius + 9 + sBass * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 45, 120, ${0.45 + sBass * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#ff2d78';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // 6. Third faint rotating dashed ring for extra texture
      ctx.save();
      ctx.setLineDash([2, 6]);
      ctx.lineDashOffset = -rotationRef.current * 120;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius + 16, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 234, 167, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 7. Central 3D golden glowing sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);

      const sphereGrad = ctx.createRadialGradient(
        centerX - pulseRadius * 0.35, centerY - pulseRadius * 0.35, pulseRadius * 0.08,
        centerX, centerY, pulseRadius
      );
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.2, '#ffeaa7');
      sphereGrad.addColorStop(0.55, '#ffd15c');
      sphereGrad.addColorStop(0.85, '#e59d12');
      sphereGrad.addColorStop(1, '#663b00');

      ctx.fillStyle = sphereGrad;
      ctx.shadowColor = '#ffd15c';
      ctx.shadowBlur = 25 + sBass * 28;
      ctx.fill();
      ctx.restore();

      // 8. Horizontal center soundwave ribbon, mirrored top & bottom
      ctx.save();
      const waveWidth = width * 0.88;
      const waveStartX = (width - waveWidth) / 2;
      const segments = 60;
      const segWidth = waveWidth / segments;

      [1, -1].forEach((dir) => {
        ctx.beginPath();
        ctx.moveTo(waveStartX, centerY);
        for (let i = 0; i <= segments; i++) {
          const segX = waveStartX + i * segWidth;
          const normDistFromCenter = Math.abs(segX - centerX) / (waveWidth / 2);
          const binIdx = Math.floor(i % Math.min(32, dataArray.length));
          const val = isPlaying && analyser
            ? (dataArray[binIdx] || 0) / 255
            : Math.sin(time * 4 + i * 0.4) * 0.3;
          const amp = dir * Math.abs((val * 22 + sBass * 10) * Math.sin(i * 0.5 + time * 3) * (1 - normDistFromCenter * 0.4));
          ctx.lineTo(segX, centerY + amp);
        }
        ctx.strokeStyle = dir > 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = dir > 0 ? 2.2 : 1.4;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.stroke();
      });
      ctx.restore();

      // 9. Center crest: "IRA · 10" with crown
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = '16px serif';
      ctx.fillText('👑', centerX, centerY - pulseRadius * 0.28);

      ctx.font = `bold ${Math.max(14, pulseRadius * 0.24)}px "Syne", sans-serif`;
      ctx.fillStyle = '#1a1001';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText('IRA · 10', centerX, centerY + pulseRadius * 0.05);

      ctx.font = `600 ${Math.max(9, pulseRadius * 0.12)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#3a2300';
      ctx.fillText(isPlaying ? '♪ ON AIR ♪' : 'QUEEN OF THE NIGHT', centerX, centerY + pulseRadius * 0.34);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [analyser, isPlaying]);

  return (
    <div className="relative flex items-center justify-center w-full max-w-[420px] aspect-square mx-auto my-2">
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(255,209,92,0.35)]"
      />
    </div>
  );
};
