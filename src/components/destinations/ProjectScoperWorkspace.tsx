import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { ScopeOption } from '../../types';
import { soundEngine } from '../../services/soundEngine';

interface ProjectScoperWorkspaceProps {
  onTransferToBrief: (selectedScopeNames: string[], budgetTier: string) => void;
}

const SCOPE_OPTIONS: ScopeOption[] = [
  // Platform Type
  {
    id: 'flagship-site',
    category: 'platform',
    name: 'Flagship 3D Venue Experience & Website',
    description: 'Bespoke high-performance digital venue with rich photography, story, and bookings.',
    basePrice: 4800,
    estimatedWeeks: 4,
    recommendedFor: 'Single-venue luxury or fine dining destination'
  },
  {
    id: 'multi-unit-portal',
    category: 'platform',
    name: 'Multi-Unit Group Hub & Location Engine',
    description: 'Scalable multi-branch portal with localized menus, booking widgets, and branch analytics.',
    basePrice: 8400,
    estimatedWeeks: 6,
    recommendedFor: 'Growing 2–10 venue restaurant groups'
  },
  // Ordering & POS
  {
    id: 'direct-ordering',
    category: 'ordering',
    name: 'Direct Commission-Free Online Ordering',
    description: 'Custom web/mobile app ordering system with Apple Pay, Stripe, and delivery zone dispatch.',
    basePrice: 3200,
    estimatedWeeks: 3,
    recommendedFor: 'Quick-service, gourmet takeout, bakery drops'
  },
  {
    id: 'pos-integration',
    category: 'ordering',
    name: 'Live POS & Kitchen Display System (KDS) Link',
    description: 'Direct bi-directional sync with Toast, Lightspeed, Square, or Revel Systems.',
    basePrice: 1800,
    estimatedWeeks: 2
  },
  // 3D & Sensory Experience
  {
    id: 'interactive-3d-floorplan',
    category: 'design',
    name: 'Interactive 3D Floorplan & Table Reservation',
    description: 'Guests can explore real spatial dining areas, chef counter seats, and private dining rooms.',
    basePrice: 2600,
    estimatedWeeks: 3
  },
  {
    id: 'dish-3d-visualizer',
    category: 'design',
    name: '3D Photorealistic Signature Dish Visualizer',
    description: 'Interactive 360-degree inspection of signature culinary creations and tasting flights.',
    basePrice: 1900,
    estimatedWeeks: 2
  },
  // Digital Menu & Operations
  {
    id: 'dynamic-menu-qr',
    category: 'menu',
    name: 'Dynamic In-Venue QR Menu with Halal & Allergen Filters',
    description: 'Real-time multi-lingual digital menu with tasting notes, Natasha’s law allergen filtering, and botanical mocktail pairings.',
    basePrice: 1400,
    estimatedWeeks: 1.5
  },
  {
    id: 'social-studio-setup',
    category: 'menu',
    name: 'Custom Social Studio Brand Kit & Template Engine',
    description: 'Automated post generator configured specifically with your brand typography, logo, and palettes.',
    basePrice: 1200,
    estimatedWeeks: 1
  }
];

export const ProjectScoperWorkspace: React.FC<ProjectScoperWorkspaceProps> = ({
  onTransferToBrief
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'flagship-site',
    'direct-ordering',
    'dynamic-menu-qr'
  ]);

  const toggleOption = (id: string) => {
    soundEngine.playSelectClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedOptions = SCOPE_OPTIONS.filter((opt) => selectedIds.includes(opt.id));
  const totalPrice = selectedOptions.reduce((sum, opt) => sum + opt.basePrice, 0);
  const totalWeeks = Math.max(
    3,
    Math.round(selectedOptions.reduce((sum, opt) => sum + opt.estimatedWeeks, 0) * 0.65)
  ); // concurrency overlap calculation

  // Map total price to suggested budget tier
  const getBudgetTier = (price: number): string => {
    if (price < 6000) return '£3,000 - £6,000';
    if (price < 12000) return '£6,000 - £12,000';
    if (price < 25000) return '£12,000 - £25,000';
    return '£25,000+';
  };

  const handleTransfer = () => {
    soundEngine.playSelectClick();
    const names = selectedOptions.map((opt) => opt.name);
    const tier = getBudgetTier(totalPrice);
    onTransferToBrief(names, tier);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Real-Time Scope & Budget Estimator
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            Interactive Project Scoper
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Configure the exact digital capabilities required for your hospitality business. Pricing rules are completely transparent with itemized deliverable timelines.
          </p>
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Guaranteed fixed-scope quotations upon discovery</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configurable Options (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Select Desired Capabilities & Integrations:
          </span>

          {SCOPE_OPTIONS.map((opt) => {
            const isSelected = selectedIds.includes(opt.id);
            return (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400/80 shadow-md'
                    : 'bg-neutral-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'bg-amber-400 text-black' : 'border border-neutral-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{opt.name}</span>
                      {opt.recommendedFor && (
                        <span className="text-[10px] text-amber-300 font-normal hidden sm:inline">
                          ({opt.recommendedFor})
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-white block">
                    £{opt.basePrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    ~{opt.estimatedWeeks} wks
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Estimate Summary (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-gradient-to-b from-neutral-900 to-black rounded-2xl border border-amber-500/30 p-6 shadow-2xl space-y-6">
            <h3 className="text-sm uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Investment Summary</span>
            </h3>

            {/* Selected items list */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-white/5">
              {selectedOptions.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-2">No capabilities selected. Pick items on the left to build scope.</p>
              ) : (
                selectedOptions.map((opt) => (
                  <div key={opt.id} className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-neutral-300 truncate pr-2">{opt.name}</span>
                    <span className="font-mono font-semibold text-white shrink-0">
                      £{opt.basePrice.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Subtotals & timeline */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Delivery Sprint:</span>
                </span>
                <span className="font-mono font-semibold text-white">~{totalWeeks} weeks to launch</span>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Indicative Budget Tier:</span>
                <span className="font-semibold text-amber-400">{getBudgetTier(totalPrice)}</span>
              </div>

              <div className="p-4 bg-amber-500/15 rounded-xl border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
                    Estimated Project Total
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-white">
                    £{totalPrice.toLocaleString()}
                  </span>
                </div>
                <Sparkles className="w-6 h-6 text-amber-400/60" />
              </div>
            </div>

            {/* Transfer to Brief Action */}
            <button
              disabled={selectedOptions.length === 0}
              onClick={handleTransfer}
              className={`w-full py-3 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                selectedOptions.length === 0
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-black'
              }`}
            >
              <span>Transfer Scope to Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
