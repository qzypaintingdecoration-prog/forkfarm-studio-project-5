/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, FastForward, Sparkles, Volume2, VolumeX, Eye, EyeOff, X, Compass, RotateCcw } from 'lucide-react';
import { SceneId, DestinationId } from './types';
import { DESTINATIONS, getDestinationById, getDestinationByRoute } from './services/destinationRegistry';
import { soundEngine } from './services/soundEngine';
import { UniverseCanvas } from './components/3d/UniverseCanvas';
import { TopBar } from './components/navigation/TopBar';

// Destination Workspaces
import { ServicesWorkspace } from './components/destinations/ServicesWorkspace';
import { ShowcaseWorkspace } from './components/destinations/ShowcaseWorkspace';
import { SocialStudioWorkspace } from './components/destinations/SocialStudioWorkspace';
import { FoodCostCalculatorWorkspace } from './components/destinations/FoodCostCalculatorWorkspace';
import { BriefingWorkspace } from './components/destinations/BriefingWorkspace';
import { KnowledgeArchiveWorkspace } from './components/destinations/KnowledgeArchiveWorkspace';
import { StudioObservatoryWorkspace } from './components/destinations/StudioObservatoryWorkspace';
import { ContactGatewayWorkspace } from './components/destinations/ContactGatewayWorkspace';
import { AdminWorkspace } from './components/destinations/AdminWorkspace';
import { HubQuickActionsSidebar } from './components/hub/HubQuickActionsSidebar';
import { OmniSearchModal } from './components/search/OmniSearchModal';

export default function App() {
  const [scene, setScene] = useState<SceneId>('VOID');
  const [activeDestination, setActiveDestination] = useState<DestinationId | null>(null);
  const [inspectedStation, setInspectedStation] = useState<DestinationId | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isAudioMuted());
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [reportDownloaded, setReportDownloaded] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Instant export of sample culinary margin report directly from Hub
  const handleInstantDownloadReport = useCallback(() => {
    soundEngine.playArrivalChime();
    const timestamp = new Date().toUTCString();
    const sample = `
================================================================================
FORKFRAME STUDIO · THE INFINITE DIMENSION
EXECUTIVE CULINARY MARGIN & PRICING BENCHMARK REPORT
Generated from Orbital Hub Quick Actions on: ${timestamp}
Location: United Kingdom Food & Hospitality Standard
================================================================================

1. KEY INDUSTRY BENCHMARKS (UK 2026):
- Fine Dining / Cellar: 20% - 25% target food cost
- Gastro-Pubs & Bistros: 26% - 30% target food cost
- Fast Casual & Burger Craft: 28% - 34% target food cost
- Artisan Bakery & Viennoiserie: 18% - 22% target food cost

2. FORMULAS ENFORCED IN FORKFRAME TOOLS:
- Line Cost = (Pack Purchase Price ÷ Pack Quantity) × Quantity Used in Recipe
- Prime Portion Cost = Total Batch Prime Cost ÷ Portions Yielded
- Suggested Net Price = (Portion Cost + Packaging Allowance) ÷ (Target Cost % ÷ 100)
- Retail Price (Gross) = Suggested Net Price × (1 + 20% UK VAT)
- Gross Profit Margin = (Net Selling Price - Effective Portion Cost) ÷ Net Selling Price

3. CONTACT & BESPOKE DISCOVERY:
Direct Channel: studioforkframe@gmail.com
For tailored recipe audits or digital ordering systems, open the Briefing Chamber.
================================================================================
    `.trim();

    const blob = new Blob([sample], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forkframe-hub-margin-benchmark-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 3000);
  }, []);

  // Cross-workspace prefill state
  const [transferredScope, setTransferredScope] = useState<string[]>([]);
  const [transferredBudgetTier, setTransferredBudgetTier] = useState<string>('£6,000 - £12,000');

  // Direct URL routing & browser history sync on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;

      if (pathname === '/admin' || pathname === '/admin/login') {
        setActiveDestination('admin');
        setScene('TERMINAL');
        return;
      }

      const match = getDestinationByRoute(pathname);
      if (match) {
        setActiveDestination(match.id);
        setScene('TERMINAL');
      } else if (pathname === '/hub') {
        setScene('HUB');
        setActiveDestination(null);
      } else {
        setScene('VOID');
        setActiveDestination(null);
      }

      // Check prefers-reduced-motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }
    }
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname === '/admin') {
        setActiveDestination('admin');
        setScene('TERMINAL');
      } else {
        const match = getDestinationByRoute(pathname);
        if (match) {
          setActiveDestination(match.id);
          setScene('TERMINAL');
        } else if (pathname === '/hub') {
          setActiveDestination(null);
          setScene('HUB');
        } else {
          setActiveDestination(null);
          setScene('VOID');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize browser URL bar without page reload
  const updateRoute = (dest: DestinationId | 'hub' | 'void') => {
    if (typeof window === 'undefined') return;
    let path = '/';
    if (dest === 'hub') path = '/hub';
    else if (dest === 'void') path = '/';
    else if (dest === 'admin') path = '/admin';
    else {
      const meta = getDestinationById(dest);
      path = meta ? meta.route : '/';
    }

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  // Step Inside / Activate laptop portal
  const handleSelectLaptop = useCallback(() => {
    soundEngine.playLaptopActivate();
    setScene('LAPTOP_ACTIVE');

    setTimeout(() => {
      soundEngine.startTunnelSound(reducedMotion ? 0.8 : 1.8);
      setScene('TUNNEL');

      setTimeout(() => {
        soundEngine.playArrivalChime();
        setScene('HUB');
        setActiveDestination(null);
        updateRoute('hub');
      }, reducedMotion ? 400 : 1900);
    }, 600);
  }, [reducedMotion]);

  // Navigate to a destination via tunnel transition
  const handleSelectDestination = useCallback((dest: DestinationId) => {
    soundEngine.playSelectClick();

    if (reducedMotion) {
      soundEngine.playArrivalChime();
      setActiveDestination(dest);
      setScene('TERMINAL');
      updateRoute(dest);
      return;
    }

    // Tunnel travel
    soundEngine.startTunnelSound(1.2);
    setScene('TUNNEL');

    setTimeout(() => {
      soundEngine.playArrivalChime();
      setActiveDestination(dest);
      setScene('TERMINAL');
      updateRoute(dest);
    }, 1300);
  }, [reducedMotion]);

  // Return to Orbital Hub
  const handleReturnToHub = useCallback(() => {
    soundEngine.playSelectClick();
    setActiveDestination(null);
    setScene('HUB');
    updateRoute('hub');
  }, []);

  // Top Bar Navigation & OmniSearch
  const handleTopBarNavigate = (target: DestinationId | 'hub' | 'admin') => {
    if (target === 'hub') {
      handleReturnToHub();
    } else if (target === 'admin') {
      setActiveDestination('admin');
      setScene('TERMINAL');
      updateRoute('admin');
    } else {
      handleSelectDestination(target as DestinationId);
    }
  };

  // Keyboard shortcut listener (Esc to return to hub, M to toggle mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && scene === 'TERMINAL') {
        handleReturnToHub();
      } else if (e.key === 'm' || e.key === 'M') {
        const newMute = soundEngine.toggleMute();
        setIsMuted(newMute);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, handleReturnToHub]);

  return (
    <div className="relative w-screen min-h-screen bg-[#101113] text-[#F4F0E8] overflow-x-hidden select-none">
      {/* Real-Time Three.js Spatial Universe Canvas */}
      <div className="fixed inset-0 z-0">
        <UniverseCanvas
          scene={scene}
          activeDestination={activeDestination}
          onSelectLaptop={handleSelectLaptop}
          onSelectDestination={handleSelectDestination}
          onInspectDestination={(dest) => setInspectedStation(dest)}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Top Bar Navigation */}
      <TopBar
        scene={scene}
        activeDestination={activeDestination}
        onNavigate={handleTopBarNavigate}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* ======================================================== */}
      {/* SCENE 01: ARRIVAL IN THE INFINITE VOID HUD               */}
      {/* ======================================================== */}
      {scene === 'VOID' && (
        <div className="relative z-10 min-h-screen flex flex-col justify-between items-center p-6 pt-24 pb-14 pointer-events-none">
          {/* Top Opening Message with Official Logo */}
          <div className="text-center animate-fadeIn max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/70 border border-[#FF6A2A]/50 p-1 mb-4 shadow-[0_0_35px_rgba(255,106,42,0.35)]">
              <img
                src="/images/brand/logo.jpeg"
                alt="Forkframe Studio Official Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#FF6A2A] font-semibold block mb-2">
              Forkframe Studio · The Infinite Dimension
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#F4F0E8] tracking-tight leading-tight">
              WHAT IF YOUR NEXT IDEA HAD ITS OWN WORLD?
            </h1>
            <p className="text-sm md:text-base text-[#A7A39B] mt-4 max-w-xl mx-auto leading-relaxed">
              Explore a digital studio built to help food businesses transform ideas into useful digital experiences.
            </p>
          </div>

          {/* Bottom Interactive Entry Button */}
          <div className="text-center pointer-events-auto flex flex-col items-center gap-4 animate-fadeIn">
            <button
              onClick={handleSelectLaptop}
              className="group px-8 py-4 rounded-2xl bg-[#191A1D]/85 border border-[#FF6A2A]/50 hover:border-[#FF6A2A] backdrop-blur-xl shadow-[0_0_35px_rgba(255,106,42,0.25)] transition-all flex items-center gap-3.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A2A] animate-ping" />
              <span className="text-sm font-bold tracking-wider text-[#F4F0E8] uppercase group-hover:text-white transition-colors">
                Step Inside
              </span>
              <ArrowRight className="w-4 h-4 text-[#FF6A2A] group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                soundEngine.playArrivalChime();
                setScene('HUB');
                updateRoute('hub');
              }}
              className="text-xs text-[#A7A39B] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FastForward className="w-3.5 h-3.5 text-[#FF6A2A]" />
              <span>Direct Jump to Orbital Hub</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 02: LAPTOP SCREEN PORTAL ACTIVATION                */}
      {/* ======================================================== */}
      {scene === 'LAPTOP_ACTIVE' && (
        <div className="relative z-10 min-h-screen flex items-center justify-center pointer-events-none">
          <div className="p-4 rounded-xl bg-black/85 border border-[#FF6A2A]/60 backdrop-blur-md text-center animate-pulse">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6A2A]">
              Entering Dimensional Portal...
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 03: HIGH-SPEED 3D WARP TUNNEL                      */}
      {/* ======================================================== */}
      {scene === 'TUNNEL' && (
        <div className="relative z-10 min-h-screen flex flex-col justify-between items-center p-6 pt-24 pb-12 pointer-events-none">
          <div className="text-center animate-fadeIn">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF6A2A] block mb-1">
              Hyper-Dimensional Passage
            </span>
            <span className="text-sm text-[#F4F0E8]">
              {activeDestination ? `Accelerating to ${activeDestination.toUpperCase()}` : 'Entering Orbital Hub Rotunda'}
            </span>
          </div>

          <div className="pointer-events-auto">
            <button
              onClick={() => {
                soundEngine.playArrivalChime();
                if (activeDestination) {
                  setScene('TERMINAL');
                  updateRoute(activeDestination);
                } else {
                  setScene('HUB');
                  updateRoute('hub');
                }
              }}
              className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-black/80 border border-white/20 rounded-xl backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5 text-[#FF6A2A]" />
              <span>Skip Travel</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 04: THE ORBITAL HUB                                */}
      {/* ======================================================== */}
      {scene === 'HUB' && (
        <>
          {/* Quick Actions Sidebar */}
          <HubQuickActionsSidebar
            onTriggerAction={(dest) => handleSelectDestination(dest)}
            onInstantDownloadReport={handleInstantDownloadReport}
            reportDownloaded={reportDownloaded}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          <div className="relative z-10 min-h-screen flex flex-col justify-between p-6 pt-24 pb-10 pointer-events-none">
            {/* Central Header */}
            <div className="text-center animate-fadeIn max-w-xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
                Central Navigation World
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#F4F0E8]">
                The Orbital Hub
              </h2>
              <p className="text-xs md:text-sm text-[#A7A39B] mt-1">
                Drag in 3D space to rotate the stations, or select below:
              </p>
            </div>

            {/* Interactive Station Inspection Card when an orbital station is hovered or tapped */}
            {inspectedStation && (() => {
              const station = getDestinationById(inspectedStation);
              if (!station) return null;
              const imgMap: Record<string, string> = {
                services: '/images/forge/01_bespoke_restaurant_web.svg',
                portfolio: '/images/portfolio/01_osteria_mayfair_fine_dining.svg',
                'social-studio': '/images/social-studio/01_social_wagyu_burger.svg',
                tools: '/images/calculators/01_food_cost_margin_formula.svg',
                briefing: '/images/briefing/01_discovery_call_architecture.svg',
                insights: '/images/knowledge/01_digital_menu_psychology.svg',
                about: '/images/observatory/01_founding_philosophy_monolith.svg',
                contact: '/images/contact/01_direct_inbox_concierge.svg'
              };
              const thumb = imgMap[station.id] || '/images/forge/01_bespoke_restaurant_web.svg';

              return (
                <div className="pointer-events-auto absolute top-28 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-30 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-[#191A1D]/95 border border-[#FF6A2A]/70 shadow-[0_0_35px_rgba(255,106,42,0.3)] backdrop-blur-xl flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF6A2A]/20 text-[#FF6A2A] border border-[#FF6A2A]/40">
                          {station.number}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-[#F4F0E8] leading-tight">
                            {station.title}
                          </h3>
                          <span className="text-[11px] text-[#A7A39B]">{station.tagline}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setInspectedStation(null)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-full h-28 rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                      <img
                        src={thumb}
                        alt={station.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] text-neutral-300 line-clamp-1">
                          {station.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundEngine.playSelectClick();
                          handleSelectDestination(station.id);
                          setInspectedStation(null);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6A2A] to-[#ff844f] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,106,42,0.4)] transition-all cursor-pointer"
                      >
                        <span>Explore Destination</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setInspectedStation(null)}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Quick Terminal Dock (All 8 destinations) */}
            <div className="pointer-events-auto max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 animate-fadeIn">
              {DESTINATIONS.map((station) => (
                <button
                  key={station.id}
                  onClick={() => handleSelectDestination(station.id)}
                  className="p-3 rounded-xl bg-[#191A1D]/85 hover:bg-[#191A1D] border border-white/10 hover:border-[#FF6A2A]/80 backdrop-blur-md text-left transition-all group cursor-pointer shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="w-2 h-2 rounded-full transition-shadow group-hover:shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: station.themeColor, color: station.themeColor }}
                    />
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#FF6A2A] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#A7A39B] block">
                    {station.number}
                  </span>
                  <h4 className="text-xs font-bold text-[#F4F0E8] group-hover:text-white transition-colors truncate">
                    {station.title}
                  </h4>
                  <span className="text-[10px] text-[#A7A39B] block truncate mt-0.5">
                    {station.tagline}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* DESTINATION WORKSPACE CONTAINER                          */}
      {/* ======================================================== */}
      {scene === 'TERMINAL' && activeDestination && (
        <div className="relative z-10 min-h-screen pt-20 pb-16 px-4 md:px-8">
          {/* Breadcrumb / Return to Hub Affordance */}
          <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between text-xs text-[#A7A39B]">
            <button
              onClick={handleReturnToHub}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6A2A]" />
              <span>Return to Orbital Hub</span>
            </button>

            <span className="hidden sm:inline-block font-mono text-neutral-500 text-[11px]">
              Press [ESC] to return to hub · [M] toggle sound
            </span>
          </div>

          {/* All 9 Destination Workspaces */}
          {activeDestination === 'services' && (
            <ServicesWorkspace
              onNavigateToScoper={() => handleSelectDestination('tools')}
              onNavigateToBriefing={() => handleSelectDestination('briefing')}
            />
          )}

          {activeDestination === 'portfolio' && <ShowcaseWorkspace />}

          {activeDestination === 'social-studio' && <SocialStudioWorkspace />}

          {activeDestination === 'tools' && <FoodCostCalculatorWorkspace />}

          {activeDestination === 'briefing' && (
            <BriefingWorkspace
              initialScope={transferredScope}
              initialBudgetTier={transferredBudgetTier}
              onNavigateToHub={handleReturnToHub}
            />
          )}

          {activeDestination === 'insights' && <KnowledgeArchiveWorkspace />}

          {activeDestination === 'about' && (
            <StudioObservatoryWorkspace
              onNavigateToBriefing={() => handleSelectDestination('briefing')}
              onNavigateToContact={() => handleSelectDestination('contact')}
            />
          )}

          {activeDestination === 'contact' && (
            <ContactGatewayWorkspace
              onNavigateToBriefing={() => handleSelectDestination('briefing')}
            />
          )}

          {activeDestination === 'admin' && <AdminWorkspace />}
        </div>
      )}

      {/* Global OmniSearch Modal */}
      <OmniSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleTopBarNavigate}
      />
    </div>
  );
}
