import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Download, Menu, X, ArrowRight, Search } from 'lucide-react';
import { DestinationId } from '../../types';
import { DESTINATIONS } from '../../services/destinationRegistry';
import { soundEngine } from '../../services/soundEngine';

interface TopBarProps {
  scene: string;
  activeDestination: DestinationId | null;
  onNavigate: (dest: DestinationId | 'hub' | 'admin') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenSearch?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  scene,
  activeDestination,
  onNavigate,
  isMuted,
  onToggleMute,
  reducedMotion,
  onToggleReducedMotion,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-[#101113]/90 backdrop-blur-md">
        {/* Zone 1: Official Logo & Wordmark */}
        <button
          onClick={() => {
            soundEngine.playSelectClick();
            onNavigate('hub');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer shrink-0"
        >
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-black/70 border border-[#FF6A2A]/50 flex items-center justify-center p-0.5 shadow-[0_0_18px_rgba(255,106,42,0.35)] shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/images/brand/logo.jpeg"
              alt="Forkframe Studio Official Logo"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // Graceful fallback to styled monogram if path fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#F4F0E8] group-hover:text-[#FF6A2A] transition-colors whitespace-nowrap">
                Forkframe Studio
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#FF6A2A]/15 text-[#FF6A2A] font-mono font-bold border border-[#FF6A2A]/30">
                UK
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-[#A7A39B] tracking-wider uppercase font-medium">
              The Infinite Dimension
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-[#A7A39B]">
          <button
            onClick={() => {
              soundEngine.playSelectClick();
              onNavigate('hub');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              scene === 'HUB' && !activeDestination ? 'text-[#FF6A2A] font-bold' : ''
            }`}
          >
            Orbital Hub
          </button>

          {DESTINATIONS.filter((d) => ['services', 'portfolio', 'social-studio', 'tools', 'insights', 'about', 'contact'].includes(d.id)).map((dest) => (
            <button
              key={dest.id}
              onClick={() => {
                soundEngine.playSelectClick();
                onNavigate(dest.id);
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeDestination === dest.id ? 'text-[#FF6A2A] font-bold' : ''
              }`}
            >
              {dest.shortLabel}
            </button>
          ))}

          <button
            onClick={() => {
              soundEngine.playSelectClick();
              onNavigate('admin');
            }}
            className={`hover:text-white text-[11px] text-neutral-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeDestination === 'admin' ? 'text-[#FF6A2A] font-bold' : ''
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* OmniSearch Global Search */}
          {onOpenSearch && (
            <button
              onClick={() => {
                soundEngine.playSelectClick();
                onOpenSearch();
              }}
              title="Search anything (⌘K or Ctrl+K)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-[#FF6A2A] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden lg:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-neutral-400 border border-white/10">
                ⌘K
              </kbd>
            </button>
          )}


          {/* Sound FX toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Toggle Sound"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-[#FF6A2A]" />}
          </button>

          {/* Reduced motion toggle */}
          <button
            onClick={onToggleReducedMotion}
            title={reducedMotion ? 'Enable High-Speed Transitions' : 'Enable Reduced Motion'}
            aria-label="Toggle Reduced Motion"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            {reducedMotion ? <EyeOff className="w-4 h-4 text-[#FF6A2A]" /> : <Eye className="w-4 h-4 text-neutral-400" />}
          </button>

          {/* Start Brief CTA */}
          <button
            onClick={() => {
              soundEngine.playSelectClick();
              onNavigate('briefing');
            }}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-black bg-gradient-to-r from-[#FF6A2A] to-[#ff844f] hover:from-[#ff7e47] hover:to-[#ffa275] rounded-xl shadow-[0_0_15px_rgba(255,106,42,0.3)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Brief
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => {
              soundEngine.playSelectClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Navigation Menu"
            className="xl:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#101113]/95 backdrop-blur-xl pt-20 px-6 pb-8 overflow-y-auto xl:hidden animate-fadeIn flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF6A2A] font-bold block mb-2">
              Navigation Corridors
            </span>
            <button
              onClick={() => {
                soundEngine.playSelectClick();
                onNavigate('hub');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-3 rounded-xl text-left flex items-center justify-between border ${
                scene === 'HUB' && !activeDestination
                  ? 'bg-[#FF6A2A]/10 border-[#FF6A2A] text-white font-bold'
                  : 'bg-white/5 border-white/10 text-neutral-300'
              }`}
            >
              <span>Orbital Hub Rotunda</span>
              <ArrowRight className="w-4 h-4 text-[#FF6A2A]" />
            </button>

            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => {
                  soundEngine.playSelectClick();
                  onNavigate(dest.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left flex items-center justify-between border ${
                  activeDestination === dest.id
                    ? 'bg-[#FF6A2A]/10 border-[#FF6A2A] text-white font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-300'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-[#FF6A2A] block">{dest.number}</span>
                  <span className="text-sm font-semibold">{dest.title}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </button>
            ))}

            <button
              onClick={() => {
                soundEngine.playSelectClick();
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full p-3 rounded-xl text-left flex items-center justify-between border bg-white/5 border-white/10 text-neutral-400 text-xs font-mono"
            >
              <span>Terminal Admin [Staff Only]</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 space-y-3">
            <div className="text-center text-[10px] text-neutral-500 font-mono">
              Forkframe Studio · studioforkframe@gmail.com
            </div>
          </div>
        </div>
      )}
    </>
  );
};
