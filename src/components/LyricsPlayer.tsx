import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Crown,
  Flame,
  Sparkles,
  Sliders,
  ChevronRight,
  ListMusic,
  Tv,
} from 'lucide-react';
import { SONG_SECTIONS, SONG_DURATION, LyricLine, SongSection } from '../data/lyrics';
import { audioEngine, AudioState } from '../utils/audioEngine';
import { triggerConfettiBurst } from './SparkleCanvas';
import { CircularSphereVisualizer } from './CircularSphereVisualizer';

export const LyricsPlayer: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: SONG_DURATION,
    volume: 0.85,
    isMuted: false,
    playbackRate: 1.0,
    isReady: false,
  });

  // Stage Spotlight is now the DEFAULT & primary view as requested!
  const [spotlightMode, setSpotlightMode] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);

  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState(state);
    });
    return () => unsubscribe();
  }, []);

  // Determine current active section and active line
  const { currentSection, currentLine, prevLine, nextLine } = useMemo(() => {
    const t = audioState.currentTime;
    let foundSec: SongSection | null = null;
    let foundLine: LyricLine | null = null;
    let prev: LyricLine | null = null;
    let next: LyricLine | null = null;

    for (let sIdx = 0; sIdx < SONG_SECTIONS.length; sIdx++) {
      const sec = SONG_SECTIONS[sIdx];
      if (t >= sec.start && t <= sec.end) {
        foundSec = sec;
        for (let lIdx = 0; lIdx < sec.lines.length; lIdx++) {
          const line = sec.lines[lIdx];
          if (t >= line.start && t <= line.end) {
            foundLine = line;
            prev = lIdx > 0 ? sec.lines[lIdx - 1] : null;
            next = lIdx < sec.lines.length - 1 ? sec.lines[lIdx + 1] : null;
            break;
          }
        }
        if (!foundLine && sec.lines.length > 0) {
          foundLine = sec.lines.find((l) => t >= l.start) || sec.lines[0];
        }
        break;
      }
    }

    return { currentSection: foundSec, currentLine: foundLine, prevLine: prev, nextLine: next };
  }, [audioState.currentTime]);

  // Smooth auto-scroll for full lyrics list
  useEffect(() => {
    if (!autoScroll || !activeLineRef.current || !lyricsContainerRef.current) return;
    const container = lyricsContainerRef.current;
    const activeEl = activeLineRef.current;

    const containerHeight = container.clientHeight;
    const activeOffsetTop = activeEl.offsetTop;
    const activeHeight = activeEl.clientHeight;

    const targetScroll = activeOffsetTop - containerHeight / 2 + activeHeight / 2;
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  }, [currentLine?.id, autoScroll]);

  // Trigger celebration confetti on Chorus drops
  const prevTimeRef = useRef(0);
  useEffect(() => {
    const t = audioState.currentTime;
    const prev = prevTimeRef.current;
    prevTimeRef.current = t;

    if ((prev < 45.8 && t >= 45.8) || (prev < 126.0 && t >= 126.0)) {
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.35, 'mega');
    }
  }, [audioState.currentTime]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isDanceBreak = audioState.currentTime >= 76.0 && audioState.currentTime <= 107.5;
  const analyser = audioEngine.getAnalyser();

  return (
    <section id="lyrics" className="relative py-8 lg:py-14 bg-[#08080c] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Stage Container */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#0c0c14]/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-9 max-w-4xl mx-auto">
          {/* Top Bar with Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffd15c] via-[#ff5c9a] to-[#ff2d78] text-neutral-950 font-bold shadow-md shadow-[#ffd15c]/25">
                <Crown className="h-6 w-6 text-neutral-950" />
              </div>
              <div>
                <h3 className="font-['Syne'] text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Ten Years of Awesome</span>
                  <span className="text-xs text-[#ffd15c] font-sans font-semibold">★ Official Anthem ★</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Synchronized to the beat of Queen Shrestha (Ten_Years_of_Awesome.mp3)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSpotlightMode(!spotlightMode)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  spotlightMode
                    ? 'border-[#ffd15c]/60 bg-[#ffd15c]/15 text-[#ffd15c] shadow-sm'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:text-white'
                }`}
                title="Switch between Spotlight & Full Lyrics List"
              >
                {spotlightMode ? (
                  <>
                    <ListMusic className="h-4 w-4" />
                    <span className="hidden sm:inline">Show Full List</span>
                  </>
                ) : (
                  <>
                    <Tv className="h-4 w-4 text-[#ffd15c]" />
                    <span className="hidden sm:inline">Stage Spotlight</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Yellow Glowing Sphere Visualizer (Beat Responsive) */}
          <div className="my-4">
            <CircularSphereVisualizer analyser={analyser} isPlaying={audioState.isPlaying} />
          </div>

          {/* Scrubber Progress Slider */}
          <div className="space-y-1.5 mt-3">
            <div className="relative">
              <input
                type="range"
                min="0"
                max={audioState.duration || SONG_DURATION}
                step="0.1"
                value={audioState.currentTime}
                onChange={(e) => audioEngine.seek(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ffd15c]"
                aria-label="Song progress scrubber"
              />
            </div>
            <div className="flex justify-between text-xs font-mono tabular-nums text-neutral-400">
              <span className="text-white font-medium">{formatTime(audioState.currentTime)}</span>
              <span className="text-[#ffd15c] font-sans font-medium">
                {currentSection ? `[${currentSection.title}]` : 'Ready'}
              </span>
              <span>{formatTime(audioState.duration || SONG_DURATION)}</span>
            </div>
          </div>

          {/* Central Playback Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const rates = [1.0, 1.25, 0.85];
                  const next = rates[(rates.indexOf(audioState.playbackRate) + 1) % rates.length];
                  audioEngine.setPlaybackRate(next);
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Playback Speed"
              >
                {audioState.playbackRate}x
              </button>

              {!spotlightMode && (
                <button
                  type="button"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    autoScroll
                      ? 'border-[#ff2d78]/40 bg-[#ff2d78]/10 text-[#ff70a6]'
                      : 'border-white/10 bg-white/5 text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Toggle Auto-Scroll to Active Lyrics"
                >
                  Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
                </button>
              )}
            </div>

            {/* Play, Pause, Jump Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => audioEngine.seek(audioState.currentTime - 5)}
                className="p-2 text-neutral-300 hover:text-white transition-colors hover:scale-105 active:scale-95 cursor-pointer"
                title="Rewind 5 seconds"
                aria-label="Rewind 5 seconds"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => audioEngine.togglePlay()}
                className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-r from-[#ffd15c] via-[#ff5c9a] to-[#ff2d78] text-neutral-950 shadow-xl shadow-[#ffd15c]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title={audioState.isPlaying ? 'Pause' : 'Play'}
                aria-label={audioState.isPlaying ? 'Pause' : 'Play'}
              >
                {audioState.isPlaying ? (
                  <Pause className="h-6 w-6 fill-current text-neutral-950" />
                ) : (
                  <Play className="h-6 w-6 fill-current text-neutral-950 ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => audioEngine.seek(audioState.currentTime + 5)}
                className="p-2 text-neutral-300 hover:text-white transition-colors hover:scale-105 active:scale-95 cursor-pointer"
                title="Forward 5 seconds"
                aria-label="Forward 5 seconds"
              >
                <RotateCw className="h-5 w-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => audioEngine.toggleMute()}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={audioState.isMuted ? 'Unmute' : 'Mute'}
                aria-label={audioState.isMuted ? 'Unmute' : 'Mute'}
              >
                {audioState.isMuted || audioState.volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-red-400" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioState.isMuted ? 0 : audioState.volume}
                onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ffd15c]"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* Section Jump Tabs */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-neutral-500 shrink-0 mr-1 flex items-center gap-1">
              <Sliders className="h-3 w-3" /> Jump:
            </span>
            {SONG_SECTIONS.map((sec) => {
              const isCurrent = currentSection?.id === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => audioEngine.seek(sec.start)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#ffd15c] to-[#f59e0b] text-neutral-950 font-bold shadow-md scale-105'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {sec.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dance Break Animated Alert Banner */}
        {isDanceBreak && (
          <div className="my-6 max-w-4xl mx-auto rounded-2xl border border-[#ff2d78]/40 bg-gradient-to-r from-[#ff2d78]/20 via-[#ffd15c]/15 to-[#ff2d78]/20 p-4 text-center backdrop-blur-md animate-pulse">
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-['Syne'] font-bold text-white">
              <Flame className="h-5 w-5 text-[#ffd15c]" />
              <span>DANCE BREAK! DROP THE BEAT FOR QUEEN IRA!</span>
              <Crown className="h-5 w-5 text-[#ff2d78]" />
            </div>
            <p className="text-xs text-neutral-300 mt-1 font-['Plus_Jakarta_Sans']">
              Ten years of fire, double-digit swagger & choreography rhythm!
            </p>
          </div>
        )}

        {/* Stage Spotlight Main Lyrics Viewer */}
        <div className="mt-8 max-w-4xl mx-auto">
          {spotlightMode ? (
            /* Primary Stage Spotlight Mode */
            <div className="relative rounded-3xl border border-[#ffd15c]/30 bg-gradient-to-b from-[#16121c] via-[#0d0d16] to-[#08080e] p-8 sm:p-14 text-center shadow-2xl overflow-hidden min-h-[360px] flex flex-col items-center justify-center">
              {/* Background ambient stage spotlight beam */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-gradient-to-b from-[#ffd15c]/15 via-[#ff2d78]/10 to-transparent blur-2xl pointer-events-none" />

              <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-semibold text-[#ffd15c] tracking-widest uppercase">
                <Crown className="h-4 w-4" />
                <span>{currentSection?.title || 'Ira 10th Birthday Anthem'}</span>
              </div>
              <div className="absolute top-4 right-6 text-xs font-mono text-neutral-400">
                {formatTime(audioState.currentTime)} / {formatTime(audioState.duration || SONG_DURATION)}
              </div>

              {/* Previous Line (Faded) */}
              {prevLine && (
                <div className="text-xs sm:text-sm text-neutral-500 font-medium mb-3 opacity-60 line-clamp-1">
                  {prevLine.text}
                </div>
              )}

              {/* Main Active Spotlight Line */}
              <div className="my-auto py-4">
                <div className="font-['Syne'] text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-snug transition-all duration-300 text-balance">
                  {currentLine ? (
                    <span className="inline-block animate-fade-in bg-gradient-to-r from-white via-[#ffd15c] to-[#ff70a6] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,209,92,0.4)]">
                      {currentLine.text}
                    </span>
                  ) : (
                    <span className="text-neutral-500 font-normal text-xl">
                      ♪ Turn up the volume! Ira's celebration anthem is playing... ♪
                    </span>
                  )}
                </div>

                {currentLine?.koreanNotes && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs text-[#ffd15c] font-medium backdrop-blur-sm animate-fade-in border border-[#ffd15c]/20">
                    <Sparkles className="h-3 w-3 text-[#ffd15c]" />
                    <span>{currentLine.koreanNotes}</span>
                  </div>
                )}
              </div>

              {/* Next Line (Upcoming Preview) */}
              {nextLine && (
                <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-3 opacity-60 line-clamp-1">
                  Next: {nextLine.text}
                </div>
              )}

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => audioEngine.togglePlay()}
                  className="rounded-full bg-gradient-to-r from-[#ffd15c] to-[#f59e0b] px-6 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-[#ffd15c]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {audioState.isPlaying ? 'Pause Song' : 'Play Song'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpotlightMode(false)}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer transition-colors"
                >
                  View All Lyrics
                </button>
              </div>
            </div>
          ) : (
            /* Full Synchronized Scrollable Lyrics List */
            <div
              ref={lyricsContainerRef}
              className="max-h-[580px] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0c0c12]/80 backdrop-blur-md p-4 sm:p-7 space-y-8 scroll-smooth"
            >
              {SONG_SECTIONS.map((section) => (
                <div key={section.id} className="space-y-3">
                  <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#0c0c12]/95 py-2 px-1 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="font-['Syne'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ffd15c]">
                        [{section.title}]
                      </span>
                      {section.type === 'chorus' && (
                        <span className="text-[10px] text-[#ff2d78] font-semibold tracking-wide">
                          CHORUS DROP
                        </span>
                      )}
                      {section.type === 'dance-break' && (
                        <span className="text-[10px] text-amber-400 font-semibold tracking-wide">
                          DANCE BREAK
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => audioEngine.seek(section.start)}
                      className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Jump to this section"
                    >
                      <span>Jump</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {section.lines.map((line) => {
                      const isActive = currentLine?.id === line.id;
                      return (
                        <div
                          key={line.id}
                          ref={isActive ? activeLineRef : null}
                          onClick={() => {
                            audioEngine.seek(line.start);
                            if (!audioState.isPlaying) {
                              audioEngine.play();
                            }
                          }}
                          className={`group relative flex flex-col rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 ease-out ${
                            isActive
                              ? 'bg-gradient-to-r from-[#ffd15c]/20 via-[#ff2d78]/15 to-transparent border-l-4 border-[#ffd15c] shadow-lg shadow-[#ffd15c]/10 translate-x-1 pl-4'
                              : 'hover:bg-white/[0.04] border-l-4 border-transparent text-neutral-400'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <span
                              className={`text-base sm:text-lg font-['Plus_Jakarta_Sans'] transition-all duration-300 ease-out ${
                                isActive
                                  ? 'font-bold text-white scale-[1.015] tracking-wide text-shadow-glow'
                                  : 'font-medium group-hover:text-neutral-200'
                              } ${line.isHighlight && !isActive ? 'text-neutral-300' : ''}`}
                            >
                              {line.text}
                            </span>
                            <span className="shrink-0 text-[11px] font-mono tabular-nums text-neutral-500 opacity-60 group-hover:opacity-100">
                              {formatTime(line.start)}
                            </span>
                          </div>

                          {line.koreanNotes && (
                            <div
                              className={`mt-1 text-xs font-sans italic flex items-center gap-1 transition-colors duration-200 ${
                                isActive ? 'text-[#ffd15c] font-medium' : 'text-neutral-500'
                              }`}
                            >
                              <span>↳</span>
                              <span>{line.koreanNotes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
