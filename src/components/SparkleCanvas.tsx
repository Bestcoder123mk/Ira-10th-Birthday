import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  rotation: number;
  rotSpeed: number;
  type: 'circle' | 'star';
}

interface FloatingEmoji {
  x: number;
  y: number;
  emoji: string;
  size: number;
  speedY: number;
  speedX: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
}

interface TranslucentBubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  hue: number; // warm gold or celebration pink tint
  highlightAngle: number;
}

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'streamer' | 'heart' | 'star';
  aspectRatio: number;
}

export function triggerConfettiBurst(x?: number, y?: number, intensity: 'normal' | 'mega' = 'normal') {
  const event = new CustomEvent('ira-confetti-burst', {
    detail: {
      x: x ?? window.innerWidth / 2,
      y: y ?? window.innerHeight * 0.45,
      intensity,
    },
  });
  window.dispatchEvent(event);
}

export const SparkleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Festive Color Palette
    const colors = [
      '#ff2d78',
      '#ff5c9a',
      '#ffd15c',
      '#ffeaa7',
      '#ffffff',
      '#f43f5e',
      '#ff85b3',
      '#f59e0b',
    ];

    // 1. Translucent Floating Bubbles (varying sizes 12px - 56px drifting slowly upwards)
    const bubbleCount = Math.min(38, Math.max(18, Math.floor(width / 45)));
    const bubbles: TranslucentBubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * (height + 300),
        radius: Math.random() * 38 + 12, // 12px to 50px translucent bubbles
        speedY: Math.random() * 0.45 + 0.22, // gentle slow upward drift
        speedX: (Math.random() - 0.5) * 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.018 + 0.008,
        opacity: Math.random() * 0.38 + 0.22, // translucent ethereal sheen
        hue: Math.random() > 0.5 ? 335 : 45, // pink (~335) or golden (~45)
        highlightAngle: Math.random() * 0.6 - 0.3,
      });
    }

    // 2. Ambient floating sparkles
    const particleCount = Math.min(38, Math.floor(width / 38));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.45 - 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        maxAlpha: Math.random() * 0.5 + 0.4,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        type: Math.random() > 0.4 ? 'star' : 'circle',
      });
    }

    // 3. Whimsical Floating Emojis (balloons, cakes, stars, party poppers, crowns)
    const emojiList = ['🎈', '🎂', '⭐', '✨', '👑', '🎉', '💖', '🧁', '🌟'];
    const emojiCount = Math.min(14, Math.max(8, Math.floor(width / 90)));
    const floatingEmojis: FloatingEmoji[] = [];
    for (let i = 0; i < emojiCount; i++) {
      floatingEmojis.push({
        x: Math.random() * width,
        y: Math.random() * (height + 200),
        emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
        size: Math.random() * 12 + 18,
        speedY: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.35 + 0.25,
        rotation: (Math.random() - 0.5) * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      });
    }

    // 4. Confetti pieces pool
    const confettiPieces: ConfettiPiece[] = [];

    const onConfettiEvent = (e: Event) => {
      const custom = e as CustomEvent<{ x?: number; y?: number; intensity?: 'normal' | 'mega' }>;
      const isMega = custom.detail?.intensity === 'mega';
      const burstCount = isMega ? 220 : 75;

      const shapes: ('rect' | 'circle' | 'streamer' | 'heart' | 'star')[] = [
        'rect',
        'rect',
        'streamer',
        'circle',
        'star',
        'heart',
      ];

      const origins = isMega
        ? [
            { x: width * 0.15, y: height * 0.35 },
            { x: width * 0.5, y: height * 0.25 },
            { x: width * 0.85, y: height * 0.35 },
            { x: width * 0.3, y: height * 0.15 },
            { x: width * 0.7, y: height * 0.15 },
          ]
        : [{ x: custom.detail?.x ?? width / 2, y: custom.detail?.y ?? height * 0.45 }];

      origins.forEach((orig) => {
        const countPerOrigin = Math.floor(burstCount / origins.length);
        for (let i = 0; i < countPerOrigin; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = (Math.random() * 12 + 6) * (isMega ? 1.3 : 1);
          confettiPieces.push({
            x: orig.x + (Math.random() - 0.5) * 40,
            y: orig.y + (Math.random() - 0.5) * 40,
            size: Math.random() * 9 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
            speedY: Math.sin(angle) * speed - (isMega ? Math.random() * 7 + 2 : Math.random() * 5),
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 16,
            wobble: Math.random() * 10,
            wobbleSpeed: Math.random() * 0.12 + 0.06,
            opacity: 1,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            aspectRatio: Math.random() * 1.5 + 0.8,
          });
        }
      });
    };

    window.addEventListener('ira-confetti-burst', onConfettiEvent);

    const drawStar = (cx: number, cy: number, spikes: number, outerR: number, innerR: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerR);
      ctx.closePath();
      ctx.fill();
    };

    const drawHeart = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(cx, cy + topCurveHeight);
      ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
      ctx.bezierCurveTo(cx - size / 2, cy + (size + topCurveHeight) / 2, cx, cy + size, cx, cy + size * 1.2);
      ctx.bezierCurveTo(cx, cy + size, cx + size / 2, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + topCurveHeight);
      ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);
      ctx.closePath();
      ctx.fill();
    };

    let animationTimer = 0;

    const render = () => {
      animationTimer += 0.02;
      ctx.clearRect(0, 0, width, height);

      // A. Render Translucent Floating Bubbles (Iridescent Ethereal Spheres)
      bubbles.forEach((b) => {
        b.y -= b.speedY;
        b.wobble += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobble) * 18;

        if (b.y < -b.radius * 2) {
          b.y = height + b.radius * 2 + Math.random() * 40;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(currentX, b.y);

        // Outer iridescent border ring
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${b.hue}, 90%, 75%, ${b.opacity * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Soft gradient fill
        const grad = ctx.createRadialGradient(
          -b.radius * 0.3,
          -b.radius * 0.3,
          b.radius * 0.1,
          0,
          0,
          b.radius
        );
        grad.addColorStop(0, `hsla(0, 0%, 100%, ${b.opacity * 0.45})`);
        grad.addColorStop(0.5, `hsla(${b.hue}, 85%, 65%, ${b.opacity * 0.18})`);
        grad.addColorStop(0.9, `hsla(${b.hue === 335 ? 45 : 335}, 80%, 60%, ${b.opacity * 0.12})`);
        grad.addColorStop(1, `hsla(${b.hue}, 90%, 70%, ${b.opacity * 0.35})`);

        ctx.fillStyle = grad;
        ctx.fill();

        // Primary reflection glint (top-left crescent)
        ctx.beginPath();
        ctx.ellipse(
          -b.radius * 0.35,
          -b.radius * 0.35,
          b.radius * 0.28,
          b.radius * 0.14,
          Math.PI / 4 + b.highlightAngle,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.75})`;
        ctx.fill();

        // Secondary subtle bottom reflection
        ctx.beginPath();
        ctx.ellipse(
          b.radius * 0.25,
          b.radius * 0.3,
          b.radius * 0.18,
          b.radius * 0.08,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.35})`;
        ctx.fill();

        ctx.restore();
      });

      // B. Render ambient subtle floating emojis (balloons, cakes, stars)
      floatingEmojis.forEach((em) => {
        em.y -= em.speedY;
        em.wobble += em.wobbleSpeed;
        const currentX = em.x + Math.sin(em.wobble) * 20;
        em.rotation += em.rotSpeed;

        if (em.y < -50) {
          em.y = height + Math.random() * 60 + 20;
          em.x = Math.random() * width;
          em.emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        }

        ctx.save();
        ctx.globalAlpha = em.opacity;
        ctx.font = `${em.size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(currentX, em.y);
        ctx.rotate(em.rotation + Math.sin(em.wobble) * 0.12);
        ctx.fillText(em.emoji, 0, 0);
        ctx.restore();
      });

      // C. Render ambient soft sparkles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(
          0.1,
          Math.min(p.maxAlpha, Math.sin(animationTimer * 2 + p.x) * 0.4 + 0.5)
        );

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;

        if (p.type === 'star') {
          drawStar(p.x, p.y, 4, p.size * 2, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // D. Render active confetti bursts with 3D wobble
      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const c = confettiPieces[i];
        c.x += c.speedX;
        c.y += c.speedY;
        c.speedY += 0.24;
        c.speedX *= 0.985;
        c.rotation += c.rotSpeed;
        c.wobble += c.wobbleSpeed;
        c.opacity -= 0.007;

        if (c.opacity <= 0 || c.y > height + 40) {
          confettiPieces.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, c.opacity));
        ctx.fillStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 3;
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);

        const wobbleScaleX = Math.sin(c.wobble);

        if (c.shape === 'circle') {
          ctx.beginPath();
          ctx.ellipse(0, 0, (c.size / 2) * Math.abs(wobbleScaleX), c.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (c.shape === 'streamer') {
          ctx.fillRect((-c.size * 1.6) / 2, (-c.size * 0.3) / 2, c.size * 1.6 * wobbleScaleX, c.size * 0.3);
        } else if (c.shape === 'star') {
          drawStar(0, 0, 5, c.size * 0.9 * Math.abs(wobbleScaleX), c.size * 0.4);
        } else if (c.shape === 'heart') {
          drawHeart(-c.size / 2, -c.size / 2, c.size * 0.8 * Math.abs(wobbleScaleX));
        } else {
          ctx.fillRect((-c.size / 2) * wobbleScaleX, -c.size / 3, c.size * wobbleScaleX, (c.size / 2) * c.aspectRatio);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('ira-confetti-burst', onConfettiEvent);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
      aria-hidden="true"
    />
  );
};
