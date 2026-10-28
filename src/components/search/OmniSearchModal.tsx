import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ExternalLink, Sparkles, Utensils, Compass, BookOpen, Calculator, Calendar, Mail, FileDown, Layers } from 'lucide-react';
import { DestinationId } from '../../types';
import { DESTINATIONS } from '../../services/destinationRegistry';
import { soundEngine } from '../../services/soundEngine';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Destination' | 'Service' | 'Case Study' | 'Tool' | 'Knowledge' | 'Action';
  icon: React.ComponentType<{ className?: string }>;
  destinationTarget?: DestinationId | 'hub' | 'admin';
  action?: () => void;
  badge?: string;
}

interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (dest: DestinationId | 'hub' | 'admin') => void;
}

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Full unified index
  const SEARCH_ITEMS: SearchResultItem[] = [
    // Destinations
    ...DESTINATIONS.map((d) => ({
      id: `dest-${d.id}`,
      title: `${d.number} · ${d.title}`,
      subtitle: d.description,
      category: 'Destination' as const,
      icon: Compass,
      destinationTarget: d.id,
      badge: 'Portal'
    })),
    // Services
    {
      id: 'srv-1',
      title: 'Bespoke Website Design & WebGL Experiences',
      subtitle: 'Cinema-grade websites engineered specifically for hospitality and dining groups.',
      category: 'Service',
      icon: Utensils,
      destinationTarget: 'services',
      badge: 'Flagship'
    },
    {
      id: 'srv-2',
      title: 'Continuous Website Management & Menus Update',
      subtitle: 'Same-day menu and price adjustments, uptime surveillance, and speed optimization.',
      category: 'Service',
      icon: Layers,
      destinationTarget: 'services',
      badge: 'Retainer'
    },
    {
      id: 'srv-3',
      title: 'Digital QR Menus & Allergen Disclosure Systems',
      subtitle: 'Mobile-first interactive menus with 14 FSA allergen flags and sommelier pairings.',
      category: 'Service',
      icon: Utensils,
      destinationTarget: 'services',
      badge: 'In-Venue'
    },
    {
      id: 'srv-4',
      title: 'Luxury Print Menus & Tactile Production',
      subtitle: 'Textured cardstock, embossed foil covers, and trade printer logistics across the UK.',
      category: 'Service',
      icon: BookOpen,
      destinationTarget: 'services',
      badge: 'Print'
    },
    {
      id: 'srv-5',
      title: 'Food-Business Apps & Direct Ordering Tools',
      subtitle: 'Progressive web apps that eliminate commission fees from food aggregators.',
      category: 'Service',
      icon: Sparkles,
      destinationTarget: 'services',
      badge: '0% Commission'
    },
    // Case Studies
    {
      id: 'cs-osteria',
      title: 'L’Osteria Della Luna — Mayfair, London',
      subtitle: 'Fine dining digital sanctuary with 3D table selection & +215% direct bookings.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '+215% Bookings'
    },
    {
      id: 'cs-kuro',
      title: 'Kuro Matcha & Buns — Soho & NQ',
      subtitle: '15-second re-order express progressive web app with zero aggregator fees.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '0% Aggregator'
    },
    {
      id: 'cs-prime',
      title: 'Prime Fire Grills — Manchester & Leeds',
      subtitle: 'Unified group web portal with digital dry-aging room tour generating £280k/mo.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '£280k/mo'
    },
    {
      id: 'cs-mirabelle',
      title: 'Maison Mirabelle — Edinburgh & Cotswolds',
      subtitle: 'Luxury temperature-controlled postal pastry drop store with 4.9★ satisfaction.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '4.9★ Rating'
    },
    {
      id: 'cs-botanical',
      title: 'The Botanical Glasshouse — Chelsea, London',
      subtitle: 'Atmospheric living menu adapting to sunrise and weather (+180% weekend brunch).',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '+180% Covers'
    },
    {
      id: 'cs-smoke',
      title: 'Smoke & Barrel BBQ — Bristol & Cardiff',
      subtitle: 'Ultra-fast QR order-and-pay web app with real-time meat smoker stock meters.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '+£1.40 Spend'
    },
    {
      id: 'cs-veloce',
      title: 'Veloce Street Piadina — Covent Garden',
      subtitle: 'High-volume kiosk and click-and-collect web app with sub-45s turnaround.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '<45s Queue'
    },
    {
      id: 'cs-flour',
      title: 'Flour & Hearth Guild — Oxford & Bath',
      subtitle: 'Heritage sourdough subscription club handling 2,400 weekly loaf drops.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '2,400 Loaves'
    },
    {
      id: 'cs-stjudes',
      title: 'St. Jude’s Taproom & Cellars — Bermondsey',
      subtitle: 'Historic railway arch taproom portal with live keg tap status (+94% event inquiries).',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '+94% Inquiries'
    },
    {
      id: 'cs-neptune',
      title: 'Neptune & Pearl Oyster House — Cornwall',
      subtitle: 'Tidal catch logs and oyster salinity profiles linked with Cornish harbour tides.',
      category: 'Case Study',
      icon: Sparkles,
      destinationTarget: 'portfolio',
      badge: '98% Freshness'
    },
    // Tools & Calculators
    {
      id: 'tool-cost',
      title: 'Food Cost & Menu Margin Calculator',
      subtitle: 'Live mathematical simulator for ingredient cost %, gross margin, and vat pricing.',
      category: 'Tool',
      icon: Calculator,
      destinationTarget: 'tools',
      badge: 'Interactive'
    },
    {
      id: 'tool-scoper',
      title: 'Project Investment Scoper & Budget Planner',
      subtitle: 'Calculate transparent pricing tiers and build a bespoke proposal scope.',
      category: 'Tool',
      icon: Calculator,
      destinationTarget: 'tools',
      badge: 'Planner'
    },
    {
      id: 'tool-social',
      title: 'Social Studio Visual Asset Generator',
      subtitle: 'Export branded story frames, menu highlights, and announcement graphics.',
      category: 'Tool',
      icon: Sparkles,
      destinationTarget: 'social-studio',
      badge: 'Canvas'
    },
    {
      id: 'tool-briefing',
      title: 'Client Briefing & Discovery Chamber',
      subtitle: 'Submit project requirements, venue parameters, and culinary brand goals.',
      category: 'Tool',
      icon: Calendar,
      destinationTarget: 'briefing',
      badge: 'Onboarding'
    },
    // Actions
    {
      id: 'act-download',
      title: 'Download Project Source & Assets (.ZIP)',
      subtitle: 'Complete source code, 80 visual assets, audio engine, and 4K photographs.',
      category: 'Action',
      icon: FileDown,
      action: () => {
        window.location.href = '/download/forkframe-studio-infinite-dimension.zip';
      },
      badge: 'Source Code'
    },
    {
      id: 'act-contact',
      title: 'Direct Hospitality Concierge',
      subtitle: 'Submit an immediate enquiry with guaranteed 24-hour turnaround response.',
      category: 'Action',
      icon: Mail,
      destinationTarget: 'contact',
      badge: '24h SLA'
    }
  ];

  // Filter items
  const filteredItems = SEARCH_ITEMS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item: SearchResultItem) => {
    soundEngine.playSelectClick();
    onClose();
    if (item.action) {
      item.action();
    } else if (item.destinationTarget) {
      onNavigate(item.destinationTarget);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#141518] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#191A1D]">
          <Search className="w-5 h-5 text-[#FF6A2A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search destinations, services, case studies, calculators, or actions..."
            className="w-full bg-transparent text-[#F4F0E8] placeholder-[#A7A39B]/60 text-sm md:text-base outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-400">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for 'Mayfair', 'QR', 'Calculator', 'Pricing', or 'Briefing'.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#FF6A2A]/20 border border-[#FF6A2A]/50 text-white'
                      : 'hover:bg-white/5 border border-transparent text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#FF6A2A] text-black font-bold'
                          : 'bg-white/5 text-neutral-400 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold truncate text-[#F4F0E8] group-hover:text-white">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-[#FF6A2A] border border-[#FF6A2A]/30 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#A7A39B] truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-400 hidden sm:inline-block">
                      {item.category}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'translate-x-1 text-[#FF6A2A]' : 'text-neutral-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#101113] border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-sans text-[10px]">
              ⌘K
            </kbd>
            <span>anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
