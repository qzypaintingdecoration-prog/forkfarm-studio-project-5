import React, { useState } from 'react';
import { Compass, Settings, Globe, UtensilsCrossed, Printer, Smartphone, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, X, FileSearch, MonitorDot, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface ServicesWorkspaceProps {
  onNavigateToScoper: () => void;
  onNavigateToBriefing: () => void;
}

interface ServiceExhibit {
  number: string;
  id: string;
  title: string;
  category: string;
  isPaid: boolean;
  pricingNote: string;
  summary: string;
  deliverables: string[];
  idealFor: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES_CATALOG: ServiceExhibit[] = [
  {
    number: '01',
    id: 'bespoke-web',
    title: 'Bespoke Website Design & Development',
    category: 'Digital Flagship',
    isPaid: true,
    pricingNote: 'Fixed-Price Quotation · Tailored Scope',
    summary: 'Cinema-grade websites engineered specifically for dining venues. We capture your physical lighting, culinary ethos, and dining room atmosphere through high-performance WebGL and responsive typography.',
    deliverables: [
      'Custom art direction tailored to venue interiors & identity',
      '60 FPS smooth interactions with sub-second page loads',
      'Seamless table reservation integration (OpenTable, SevenRooms, Resy)',
      'Rich multi-lingual menu displays with dietary filters'
    ],
    idealFor: 'Fine dining, destination eateries, and culinary groups aiming for unforgettable brand presence',
    image: '/images/forge/01_bespoke_restaurant_web.svg',
    icon: Globe
  },
  {
    number: '02',
    id: 'web-management',
    title: 'Website Management & Continuous Support',
    category: 'Ongoing Operations',
    isPaid: true,
    pricingNote: 'Monthly Retainer · Transparent Fixed Scope',
    summary: 'Never worry about broken links, outdated opening hours, sudden menu price changes, or server downtimes. We keep your venue’s digital front door pristine and secure month after month.',
    deliverables: [
      'Same-day menu and price adjustments',
      'Weekly security updates, SSL monitoring & cloud backups',
      'Hosting speed optimization & uptime surveillance',
      'Monthly traffic, booking & online ordering analytics review'
    ],
    idealFor: 'Busy venue managers and head chefs who lack time to maintain websites',
    image: '/images/forge/02_continuous_web_management.svg',
    icon: Settings
  },
  {
    number: '03',
    id: 'digital-menu',
    title: 'Digital Menu Design & QR Systems',
    category: 'In-Venue Operations',
    isPaid: true,
    pricingNote: 'One-off or Tiered Menu Service',
    summary: 'High-craft digital menus designed to tantalize guest appetites. Rich food photography framing, sommelier cellar pairings, allergen disclosures, and instant price adjustments without reprinting costs.',
    deliverables: [
      'Mobile-first responsive layout with category navigation',
      'High-resolution dish photography & signature callouts',
      'Strict 14-allergen UK Food Standards Agency compliance',
      'Sommelier vintage notes & cocktail recipe highlights'
    ],
    idealFor: 'Venues with seasonal, rotating, or wine-forward menus',
    image: '/images/forge/03_digital_qr_menu_system.svg',
    icon: UtensilsCrossed
  },
  {
    number: '04',
    id: 'menu-print',
    title: 'Menu Printing Services & Print Coordination',
    category: 'Physical Production',
    isPaid: true,
    pricingNote: 'Coordinated Print Orders · Trade Pricing',
    summary: 'Bridging the physical and digital dining experience. We design and coordinate luxury tactile print runs—from embossed leather folders and foiled cardstock to wipeable waterproof laminates.',
    deliverables: [
      'Print-ready vector typography & color-calibrated CMYK proofs',
      'Premium paper stock sourcing (textured, recycled, soft-touch)',
      'Direct trade printer coordination and courier dispatch across the UK',
      'Matching bill presenter cards & table talkers'
    ],
    idealFor: 'Venues opening new locations or undergoing seasonal identity refreshes',
    image: '/images/forge/04_luxury_print_menus.svg',
    icon: Printer
  },
  {
    number: '05',
    id: 'food-apps',
    title: 'Food-Business Apps & Digital Ordering Tools',
    category: 'Custom Software',
    isPaid: true,
    pricingNote: 'Custom Engineering Specification',
    summary: 'Eliminate 25%–35% third-party aggregator commissions with your own direct ordering web and mobile app. Includes Apple Pay, Stripe, kitchen display system (KDS) sync, and loyalty mechanics.',
    deliverables: [
      'Zero commission takeaway click-and-collect ordering',
      'Kitchen printer / thermal ticket auto-dispatch',
      'Delivery radius validation with custom delivery charges',
      'Customer account wallet with re-order in under 15 seconds'
    ],
    idealFor: 'High-volume takeaways, ghost kitchens, and multi-unit hospitality operators',
    image: '/images/forge/05_direct_food_ordering_app.svg',
    icon: Smartphone
  },
  {
    number: '06',
    id: 'social-studio',
    title: 'Social Promotion & Creative Production',
    category: 'Social Studio Engine',
    isPaid: true,
    pricingNote: 'Software Included · Production Packs Available',
    summary: 'Turn food photos into scroll-stopping social announcements, weekend specials, and flash drops. Access our built-in Social Studio tool or commission bespoke motion graphics kits.',
    deliverables: [
      'Full access to the in-browser Social Studio canvas generator',
      'Bespoke social templates styled with your restaurant font & colors',
      'Weekly or monthly promotional story & feed asset packs',
      'High-converting promotional copy guidelines'
    ],
    idealFor: 'Hospitality brands looking to consistently fill covers across mid-week trading',
    image: '/images/forge/06_social_studio_creative_engine.svg',
    icon: Sparkles
  },
  {
    number: '07',
    id: 'free-guidance',
    title: 'Free Initial Guidance for Food Businesses',
    category: 'Consultation & Strategy',
    isPaid: false,
    pricingNote: '100% Free · 30-Minute Video or Phone Session',
    summary: 'Direct, honest technical appraisal of your current digital presence, ordering fees, and menu presentation. No sales pressure, no obligations—just actionable guidance from UK hospitality tech specialists.',
    deliverables: [
      'Audit of existing website speed and mobile usability',
      'Delivery commission breakdown & direct ordering potential',
      'Local Google Business & SEO quick-wins review',
      'Follow-up summary document with recommended priorities'
    ],
    idealFor: 'Independent restaurateurs and takeaway owners exploring their digital options',
    image: '/images/forge/07_free_advisory_audit.svg',
    icon: Compass
  },
  {
    number: '08',
    id: 'kitchen-display',
    title: 'Kitchen Display & Order Dispatch Link',
    category: 'Kitchen Hardware & POS',
    isPaid: true,
    pricingNote: 'Integration Setup · Hardware Provisioning',
    summary: 'Direct integration between online orders and back-of-house kitchen display systems (KDS) and ESC/POS thermal printers. Keep kitchen workflow organized without manual re-typing.',
    deliverables: [
      'Kitchen ticket formatting with allergen bolding',
      'Thermal receipt printing via Ethernet / Cloud Print',
      'Course firing timing and dispatch station routing',
      'POS terminal sync (Lightspeed, Square, Clover, Toast)'
    ],
    idealFor: 'High-speed prep kitchens and multi-station restaurants',
    image: '/images/forge/08_kitchen_display_integration.svg',
    icon: MonitorDot
  },
  {
    number: '09',
    id: 'allergen-compliance',
    title: 'Allergen Compliance & Dietary Engine',
    category: 'Regulatory Standards',
    isPaid: true,
    pricingNote: 'UK FSA Standard Included in Menus',
    summary: 'Strict alignment with the 14 major allergens mandated by the UK Food Standards Agency. Diners can filter menus by specific allergies, intolerances, and religious preferences.',
    deliverables: [
      'Interactive allergen matrix matrix filter in digital menu',
      'Instant cross-contamination risk disclosures',
      'Halal, Kosher, Vegan, and Coeliac certification badges',
      'Staff training documentation on digital allergen checks'
    ],
    idealFor: 'All UK food service operators complying with Natasha’s Law',
    image: '/images/forge/09_allergen_compliance_engine.svg',
    icon: ShieldCheck
  },
  {
    number: '10',
    id: 'continuous-support',
    title: 'Dedicated Account Director & Priority SLA',
    category: 'Enterprise Support',
    isPaid: true,
    pricingNote: 'Guaranteed 2-Hour Response Window',
    summary: 'Direct WhatsApp and phone access to your dedicated Forkframe digital director. Urgent menu changes before evening service, weekend surge monitoring, and seasonal campaign launches.',
    deliverables: [
      'Direct WhatsApp emergency dispatch line',
      'Sub-2-hour turnaround for weekend trading emergencies',
      'Quarterly digital strategy roadmap sessions',
      'Priority access to new experimental web & 3D features'
    ],
    idealFor: 'Flagship venues and multi-site hospitality founders',
    image: '/images/forge/10_continuous_support_workflow.svg',
    icon: CheckCircle2
  }
];

export const ServicesWorkspace: React.FC<ServicesWorkspaceProps> = ({
  onNavigateToScoper,
  onNavigateToBriefing
}) => {
  const [activeExhibit, setActiveExhibit] = useState<ServiceExhibit | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-2">
          Destination 01 · Creative Forge
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#F4F0E8] tracking-tight">
          Services Engineered for UK Food Businesses
        </h2>
        <p className="text-sm md:text-base text-[#A7A39B] mt-3 leading-relaxed">
          A monumental digital workshop where culinary ideas are assembled into practical commercial solutions. From free initial guidance to enterprise ordering infrastructure.
        </p>
      </div>

      {/* Services Grid (10 items with integrated high-quality assets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {SERVICES_CATALOG.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.id}
              onClick={() => {
                soundEngine.playSelectClick();
                setActiveExhibit(srv);
              }}
              className="p-5 rounded-2xl bg-[#191A1D]/85 border border-white/10 hover:border-[#FF6A2A]/60 transition-all duration-300 flex flex-col justify-between group shadow-xl cursor-pointer hover:-translate-y-1 overflow-hidden"
            >
              <div>
                {/* Visual Asset Thumbnail */}
                <div className="w-full h-36 rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-4 relative group-hover:border-[#FF6A2A]/40 transition-colors">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/75 text-[#FF6A2A] border border-[#FF6A2A]/30">
                      {srv.number}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    {!srv.isPaid ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                        FREE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 text-[#C8A879] border border-[#C8A879]/30 backdrop-blur-sm">
                        PAID
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-[#FF6A2A]" />
                  <span className="text-[11px] font-semibold text-[#A7A39B] uppercase tracking-wider">
                    {srv.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F4F0E8] mb-2 group-hover:text-white transition-colors leading-snug">
                  {srv.title}
                </h3>

                <p className="text-xs text-[#A7A39B] leading-relaxed line-clamp-2 mb-3">
                  {srv.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-[11px] text-[#FF6A2A]">{srv.pricingNote}</span>
                <span className="text-neutral-400 group-hover:text-white flex items-center gap-1">
                  Inspect <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {activeExhibit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#191A1D] border border-[#FF6A2A]/50 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveExhibit(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-48 rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-6">
              <img
                src={activeExhibit.image}
                alt={activeExhibit.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-[#FF6A2A] px-2 py-0.5 rounded bg-[#FF6A2A]/10 border border-[#FF6A2A]/30">
                EXHIBIT {activeExhibit.number}
              </span>
              <span className="text-xs font-medium text-[#A7A39B] uppercase tracking-wider">
                {activeExhibit.category}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-[#F4F0E8] mb-2">{activeExhibit.title}</h3>
            <p className="text-xs font-mono text-[#C8A879] mb-4">{activeExhibit.pricingNote}</p>

            <p className="text-sm text-[#A7A39B] leading-relaxed mb-6">{activeExhibit.summary}</p>

            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-widest text-[#F4F0E8] font-bold mb-3">
                Key Scope & Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeExhibit.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A2A] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10 mb-6">
              <span className="text-[11px] uppercase tracking-wider text-[#A7A39B] font-semibold block mb-1">
                Ideal Application
              </span>
              <p className="text-xs text-[#F4F0E8]">{activeExhibit.idealFor}</p>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  soundEngine.playSelectClick();
                  setActiveExhibit(null);
                  onNavigateToScoper();
                }}
                className="text-xs font-semibold text-[#A7A39B] hover:text-white transition-colors cursor-pointer"
              >
                Launch Calculator Suite →
              </button>

              <button
                onClick={() => {
                  soundEngine.playSelectClick();
                  setActiveExhibit(null);
                  onNavigateToBriefing();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A2A] to-[#ff844f] text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,106,42,0.4)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Request Scope in Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
