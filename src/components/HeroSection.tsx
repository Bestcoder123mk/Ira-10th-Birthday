import React from 'react';
import { Play, Pause, Crown, PartyPopper } from 'lucide-react';
import heroStageImage from '../assets/images/hero_birthday_stage_1790304223519.jpg';

interface HeroSectionProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onCelebrate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isPlaying,
  onTogglePlay,
  onCelebrate,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20">
      {/* Background Hero Stage Image with Sophisticated Dark Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroStageImage}
          alt="10th Birthday celebration festival stage with glowing golden 10 emblem and pink arches"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-30 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff2d78]/15 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Elegant Top Kicker */}
          <div className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-[#ffd15c] uppercase">
            <Crown className="h-4 w-4 text-[#ffd15c]" />
            <span>Royal 10th Birthday Milestone</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>Double Digits Era</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] text-balance">
            Happy 10th Birthday, <br />
            <span className="font-['Syne'] bg-gradient-to-r from-[#ff2d78] via-[#ff70a6] to-[#ffd15c] bg-clip-text text-transparent">
              Queen Shrestha
            </span>
          </h1>

          {/* Subtitle with Nickname Ira & Warm Birthday Greeting */}
          <p className="mt-5 text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto text-balance font-['Plus_Jakarta_Sans']">
            Ten years of brilliance, boundless confidence, and heart-melting smiles. Dedicated with endless love to <strong className="text-white font-semibold">Ira</strong>—our unstoppable superstar shining brighter than ever.
          </p>

          {/* Primary Action Buttons: Celebrate & Play */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* The Big Celebrate Button */}
            <button
              type="button"
              onClick={onCelebrate}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border-2 border-[#ffd15c] bg-gradient-to-r from-[#ffd15c] via-[#f59e0b] to-[#ffd15c] px-8 py-3.5 text-base font-extrabold text-neutral-950 shadow-xl shadow-[#ffd15c]/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#ffd15c]/40 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <PartyPopper className="h-5 w-5 text-neutral-950" />
              <span>Celebrate Ira!</span>
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#ff2d78] via-[#f43f5e] to-[#fb7185] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff2d78]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#ff2d78]/40 active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 fill-current" />
                  <span>Pause Song</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                  <span>Play Birthday Song</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Celebratory Highlights Bar */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl mx-auto">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
            <div className="font-['Syne'] text-2xl sm:text-3xl font-bold text-[#ffd15c] tabular-nums">10</div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">Double Digits Milestone</div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
            <div className="font-['Syne'] text-2xl sm:text-3xl font-bold text-[#ff2d78]">Our Queen</div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">Shrestha's Kingdom</div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
            <div className="font-['Syne'] text-2xl sm:text-3xl font-bold text-white">100%</div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">Confidence & Charm</div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
            <div className="font-['Syne'] text-2xl sm:text-3xl font-bold text-[#ffd15c]">Iconic</div>
            <div className="mt-1 text-xs text-neutral-400 font-medium">Tonight & Forever</div>
          </div>
        </div>
      </div>
    </section>
  );
};
