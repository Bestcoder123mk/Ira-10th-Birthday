import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';
import { triggerConfettiBurst } from './SparkleCanvas';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#060609] py-12 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand & Dedication */}
          <div className="text-center sm:text-left">
            <div className="font-['Syne'] text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>QUEEN IRA</span>
              <span className="text-[#ff2d78]">·</span>
              <span className="text-[#ffd15c]">10 YEARS ICONIC</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 font-['Plus_Jakarta_Sans']">
              Dedicated with boundless love to Shrestha on her 10th Birthday.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => triggerConfettiBurst()}
              className="flex items-center gap-1.5 text-xs text-[#ffd15c] hover:text-[#ffeaa7] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Shower Confetti</span>
            </button>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-[#ff2d78] text-[#ff2d78]" />
            <span>for Shrestha's 10th Birthday Milestone</span>
          </div>
          <div>Shrestha (Ira) · 10th Birthday Celebration</div>
        </div>
      </div>
    </footer>
  );
};
