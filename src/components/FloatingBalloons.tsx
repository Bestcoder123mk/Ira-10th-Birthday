import React, { useEffect, useRef } from 'react';

interface Balloon {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  speedY: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  color: {
    hue: number;
    sat: number;
    light: number;
    alpha: number;
  };
  stringLength: number;
  stringPoints: { x: number; y: number }[];
}

export const FloatingBalloons: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Festive Color Palette: Pink, Gold, Yellow, Lavender, Coral
    const balloonColors = [
      { hue: 335, sat: 90, light: 65, alpha: 0.38 }, // Vivid celebration pink
      { hue: 345, sat: 85, light: 72, alpha: 0.35 }, // Soft pastel pink
      { hue: 45,  sat: 95, light: 68, alpha: 0.40 }, // Radiant golden yellow
      { hue: 52,  sat: 90, light: 65, alpha: 0.38 }, // Warm yellow
      { hue: 280, sat: 80, light: 75, alpha: 0.32 }, // Soft lavender
      { hue: 15,  sat: 90, light: 70, alpha: 0.36 }, // Coral celebration
      { hue: 40,  sat: 90, light: 75, alpha: 0.35 }, // Champagne gold
    ];

    const balloonCount = Math.min(24, Math.max(12, Math.floor(width / 70)));
    const balloons: Balloon[] = [];

    for (let i = 0; i < balloonCount; i++) {
      const radiusX = Math.random() * 20 + 16; // 16px to 36px width
      const radiusY = radiusX * (Math.random() * 0.2 + 1.25); // Slightly elongated oval
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const stringLength = radiusY * (Math.random() * 0.8 + 1.6);

      balloons.push({
        x: Math.random() * width,
        y: Math.random() * (height + 300) + 50,
        radiusX,
        radiusY,
        speedY: Math.random() * 0.45 + 0.25, // Gentle slow upward drift
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.008,
        wobbleAmp: Math.random() * 16 + 10,
        color,
        stringLength,
        stringPoints: [],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      balloons.forEach((b) => {
        b.y -= b.speedY;
        b.wobble += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobble) * b.wobbleAmp;

        // Reset when floating completely above the screen
        if (b.y < -b.radiusY * 2 - b.stringLength) {
          b.y = height + b.radiusY * 2 + Math.random() * 100;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(currentX, b.y);

        // 1. Balloon Tied Knot at base
        const knotY = b.radiusY + 2;
        ctx.beginPath();
        ctx.moveTo(-3, knotY);
        ctx.lineTo(3, knotY);
        ctx.lineTo(4, knotY + 5);
        ctx.lineTo(-4, knotY + 5);
        ctx.closePath();
        ctx.fillStyle = `hsla(${b.color.hue}, ${b.color.sat}%, ${b.color.light - 10}%, ${b.color.alpha * 0.8})`;
        ctx.fill();

        // 2. Trailing Wavy Balloon String
        ctx.beginPath();
        ctx.moveTo(0, knotY + 4);
        const wave1X = Math.sin(b.wobble * 2) * 6;
        const wave2X = -Math.sin(b.wobble * 2 + 1) * 8;
        const wave3X = Math.sin(b.wobble * 2 + 2) * 5;
        ctx.bezierCurveTo(
          wave1X, knotY + b.stringLength * 0.33,
          wave2X, knotY + b.stringLength * 0.66,
          wave3X, knotY + b.stringLength
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.color.alpha * 0.45})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // 3. Translucent Colorful Balloon Body (Smooth Oval with Gradient)
        ctx.beginPath();
        ctx.ellipse(0, 0, b.radiusX, b.radiusY, 0, 0, Math.PI * 2);

        // Spherical translucent gradient
        const grad = ctx.createRadialGradient(
          -b.radiusX * 0.35,
          -b.radiusY * 0.35,
          b.radiusX * 0.08,
          0,
          0,
          b.radiusY
        );
        grad.addColorStop(0, `hsla(0, 0%, 100%, ${b.color.alpha * 0.75})`); // Specular center
        grad.addColorStop(0.35, `hsla(${b.color.hue}, ${b.color.sat}%, ${b.color.light}%, ${b.color.alpha * 0.85})`);
        grad.addColorStop(0.85, `hsla(${b.color.hue}, ${b.color.sat}%, ${b.color.light - 5}%, ${b.color.alpha * 0.55})`);
        grad.addColorStop(1, `hsla(${b.color.hue}, ${b.color.sat}%, ${b.color.light - 15}%, ${b.color.alpha * 0.3})`);

        ctx.fillStyle = grad;
        ctx.fill();

        // 4. Subtle Outer Translucent Rim
        ctx.strokeStyle = `hsla(${b.color.hue}, ${b.color.sat}%, ${b.color.light + 10}%, ${b.color.alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 5. Crescent Specular Highlight (Top Left Reflection)
        ctx.beginPath();
        ctx.ellipse(
          -b.radiusX * 0.4,
          -b.radiusY * 0.4,
          b.radiusX * 0.26,
          b.radiusY * 0.16,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${b.color.alpha * 0.9})`;
        ctx.fill();

        // 6. Secondary Subtle Bottom-Right Reflection
        ctx.beginPath();
        ctx.ellipse(
          b.radiusX * 0.35,
          b.radiusY * 0.35,
          b.radiusX * 0.18,
          b.radiusY * 0.1,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${b.color.alpha * 0.3})`;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2] h-full w-full"
      aria-hidden="true"
    />
  );
};
