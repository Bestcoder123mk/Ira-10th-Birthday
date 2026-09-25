import React from 'react';
import { Sparkles, Play, Pause, PartyPopper } from 'lucide-react';
import { triggerConfettiBurst } from './SparkleCanvas';

interface NavbarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onCelebrate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPlaying,
  onTogglePlay,
  activeSection,
  onNavigate,
  onCelebrate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0a0a0e]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="font-['Syne'] text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90 sm:text-xl flex items-center gap-1.5"
        >
          <span className="text-white">IRA</span>
          <span className="text-[#ff2d78]">.</span>
          <span className="text-[#ffd15c]">10</span>
        </a>

        {/* Clean text navigation links */}
        <nav className="hidden items-center gap-7 md:flex text-sm font-medium">
          <button
            onClick={() => onNavigate('lyrics')}
            className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer ${
              activeSection === 'lyrics' ? 'text-[#ff2d78] font-semibold' : 'text-neutral-400'
            }`}
          >
            Song & Lyrics
          </button>
          <button
            onClick={() => onNavigate('tribute')}
            className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer ${
              activeSection === 'tribute' ? 'text-[#ff2d78] font-semibold' : 'text-neutral-400'
            }`}
          >
            Royal Milestone
          </button>
          <button
            onClick={() => onNavigate('wishes')}
            className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer ${
              activeSection === 'wishes' ? 'text-[#ff2d78] font-semibold' : 'text-neutral-400'
            }`}
          >
            Birthday Wishes
          </button>
        </nav>

        {/* Primary Actions: Celebrate & Play */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent Celebrate Button */}
          <button
            type="button"
            onClick={onCelebrate}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-[#ffd15c]/40 bg-gradient-to-r from-[#ffd15c]/20 via-[#ff2d78]/20 to-[#ffd15c]/20 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#ffd15c] shadow-lg shadow-[#ffd15c]/10 transition-all hover:bg-[#ffd15c]/30 hover:border-[#ffd15c]/70 hover:scale-105 active:scale-95 whitespace-nowrap"
            title="Trigger Fullscreen Confetti Celebration!"
          >
            <PartyPopper className="h-4 w-4 text-[#ffd15c] animate-bounce" />
            <span>Celebrate Ira!</span>
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition-all active:scale-95 whitespace-nowrap ${
              isPlaying
                ? 'bg-neutral-800 border border-[#ff2d78]/40 hover:bg-neutral-700 text-[#ff70a6]'
                : 'bg-gradient-to-r from-[#ff2d78] to-[#e11d48] hover:from-[#ff4088] hover:to-[#f43f5e] shadow-[#ff2d78]/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play Song</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
