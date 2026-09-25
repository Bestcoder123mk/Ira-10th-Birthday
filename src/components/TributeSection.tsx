import React, { useState } from 'react';
import { Crown, Heart, Sparkles, Flame } from 'lucide-react';
import { triggerConfettiBurst } from './SparkleCanvas';

export const TributeSection: React.FC = () => {
  // 10 candles for 10 years old!
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(10).fill(true));
  const [hasCelebratedAll, setHasCelebratedAll] = useState(false);

  const toggleCandle = (index: number) => {
    const updated = [...litCandles];
    updated[index] = !updated[index];
    setLitCandles(updated);

    const allLit = updated.every(Boolean);
    if (allLit && !hasCelebratedAll) {
      setHasCelebratedAll(true);
      triggerConfettiBurst();
    }
  };

  const lightAll = () => {
    setLitCandles(Array(10).fill(true));
    setHasCelebratedAll(true);
    triggerConfettiBurst();
  };

  return (
    <section id="tribute" className="relative py-16 lg:py-24 bg-[#0a0a0f] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ffd15c] mb-2">
            <Crown className="h-3.5 w-3.5 text-[#ffd15c]" />
            <span>Royal Milestone Tribute</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>A Decade of Sunshine</span>
          </div>
        </div>

        {/* Interactive "10 Birthday Wishes Candles" */}
        <div className="rounded-2xl border border-white/[0.1] bg-[#0d0d16]/90 p-6 sm:p-8 max-w-4xl mx-auto backdrop-blur-md shadow-xl text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ffd15c] mb-2">
            <Flame className="h-4 w-4 text-[#ffd15c]" />
            <span>Interactive Birthday Tradition</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white mb-3">
            Light All 10 Birthday Candles for Ira
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto mb-6 font-['Plus_Jakarta_Sans']">
            Tap each candle to light a wish for Shrestha's 10th year: health, joy, big adventures, confidence, and sisterly love!
          </p>

          {/* Candles Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6">
            {litCandles.map((isLit, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCandle(idx)}
                className="group flex flex-col items-center focus:outline-none transition-transform active:scale-95"
                title={`Candle Year ${idx + 1}: ${isLit ? 'Lit' : 'Tap to light'}`}
              >
                {/* Flame */}
                <div
                  className={`h-6 w-4 rounded-full transition-all duration-300 ${
                    isLit
                      ? 'bg-gradient-to-t from-[#ffd15c] via-[#ff70a6] to-white shadow-[0_0_12px_#ffd15c] animate-bounce scale-110'
                      : 'bg-neutral-800 scale-75 opacity-40'
                  }`}
                  style={{ animationDuration: `${1.2 + (idx % 3) * 0.2}s` }}
                />
                {/* Wick */}
                <div className="h-1.5 w-0.5 bg-neutral-600" />
                {/* Candle Body */}
                <div
                  className={`h-12 w-4 sm:w-5 rounded-t-sm shadow-inner transition-colors ${
                    idx % 2 === 0
                      ? 'bg-gradient-to-b from-[#ff2d78] to-[#be123c]'
                      : 'bg-gradient-to-b from-[#ffd15c] to-[#d97706]'
                  }`}
                >
                  <span className="text-[10px] font-bold text-black/70 flex h-full items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={lightAll}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd15c] to-[#f59e0b] px-5 py-2.5 text-xs font-bold text-neutral-950 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#ffd15c]/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>Make a Wish & Light All 10!</span>
            </button>
          </div>
        </div>

        {/* Deeply Personal Sibling & Family Birthday Letter */}
        <div className="mt-12 rounded-2xl border border-[#ff2d78]/25 bg-gradient-to-br from-[#160c18] via-[#0d0d16] to-[#0a0a0f] p-8 sm:p-12 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#ff2d78]/10 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff70a6] uppercase tracking-wider mb-4">
            <Heart className="h-4 w-4 fill-[#ff2d78] text-[#ff2d78]" />
            <span>From Big Brother & Family</span>
          </div>

          <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white mb-4">
            To Our Dearest Shrestha (Ira), On Your 10th Birthday
          </h3>

          <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-['Plus_Jakarta_Sans'] leading-relaxed">
            <p>
              Happy 10th Birthday, Ira! Today marks your entrance into the wonderful world of double digits. It feels like just yesterday you were a tiny ball of energy, and now you have blossomed into a smart, fiercely confident, and wonderfully compassionate young queen.
            </p>
            <p>
              Whether you are singing along to your favorite Blackpink songs, lighting up our living room with your impromptu dance moves, or greeting us with that contagious smile that brightens even the gloomiest days—you make our entire family so remarkably proud.
            </p>
            <p>
              As your brother and family, we made this special anthem just for you. Never forget who you are: unstoppable, kind-hearted, and destined for greatness.
            </p>
            <p className="font-medium text-white italic pt-2">
              "Our queen is here, and she is unstoppable. Ten years of fire... we love you to the moon and beyond!"
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
            <span>With all our love, forever and always</span>
            <span className="font-['Syne'] font-bold text-[#ffd15c]">Team Ira 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};
