/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { SparkleCanvas, triggerConfettiBurst } from './components/SparkleCanvas';
import { FloatingBalloons } from './components/FloatingBalloons';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LyricsPlayer } from './components/LyricsPlayer';
import { TributeSection } from './components/TributeSection';
import { BirthdayWishes } from './components/BirthdayWishes';
import { Footer } from './components/Footer';
import { audioEngine, AudioState } from './utils/audioEngine';

export default function App() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 182,
    volume: 0.85,
    isMuted: false,
    playbackRate: 1.0,
    isReady: false,
  });

  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const unsub = audioEngine.subscribe((state) => {
      setAudioState(state);
    });
    return () => unsub();
  }, []);

  const handleTogglePlay = () => {
    audioEngine.togglePlay();
  };

  const handleCelebrate = () => {
    // Trigger immersive fullscreen confetti burst with multi-point origins & heart/star shapes
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.35, 'mega');
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 font-['Plus_Jakarta_Sans'] selection:bg-[#ff2d78] selection:text-white relative">
      {/* Background Soft Ambient Sparkles & Fullscreen Confetti Canvas */}
      <SparkleCanvas />

      {/* Translucent Colorful Floating Balloons Background Animation */}
      <FloatingBalloons />

      {/* 3-Zone Clean Header with Celebrate button */}
      <Navbar
        isPlaying={audioState.isPlaying}
        onTogglePlay={handleTogglePlay}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onCelebrate={handleCelebrate}
      />

      <main className="relative z-20">
        {/* Hero Section */}
        <HeroSection
          isPlaying={audioState.isPlaying}
          onTogglePlay={handleTogglePlay}
          onCelebrate={handleCelebrate}
        />

        {/* Synchronized Lyrics & High-Res Visualizer Player Deck */}
        <LyricsPlayer />

        {/* 10-Year Royal Milestone Tribute */}
        <TributeSection />

        {/* Birthday Wishes Wall */}
        <BirthdayWishes />
      </main>

      {/* Refined Footer */}
      <Footer />
    </div>
  );
}
