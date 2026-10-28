import React from 'react';
import { Eye, Shield, Target, Compass, HeartHandshake, ArrowRight, Sparkles, Building2, Terminal } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface StudioObservatoryWorkspaceProps {
  onNavigateToBriefing: () => void;
  onNavigateToContact: () => void;
}

const OBSERVATORY_EXHIBITS = [
  { id: '01', title: 'Founding Monolith', desc: 'Crafting digital universes tailored exclusively to culinary brands', img: '/images/observatory/01_founding_philosophy_monolith.svg' },
  { id: '02', title: 'Culinary DNA', desc: '100% specialized focus on food, drink, and hospitality operators', img: '/images/observatory/02_food_and_beverage_specialization.svg' },
  { id: '03', title: 'Spatial & Sensory Design', desc: 'Capturing venue lighting, ambient intimacy, and tactile physical atmosphere', img: '/images/observatory/03_spatial_and_sensory_design.svg' },
  { id: '04', title: 'Unit Economics First', desc: 'Protecting net margin, prime cost ratios, and cover revenue', img: '/images/observatory/04_unit_economics_first.svg' },
  { id: '05', title: 'Zero Bloat Code', desc: '60 FPS bespoke WebGL and modern reactive frameworks without heavy plugins', img: '/images/observatory/05_zero_bloat_code_architecture.svg' },
  { id: '06', title: 'Restaurateur Relationship', desc: 'Direct access to senior creative technologists, never junior account handlers', img: '/images/observatory/06_direct_restaurateur_relationship.svg' },
  { id: '07', title: 'UK Hospitality Standards', desc: 'Full alignment with Natasha’s Law allergen rules and UK VAT structures', img: '/images/observatory/07_uk_hospitality_standards.svg' },
  { id: '08', title: 'Sustainable Systems', desc: 'Cloud infrastructure engineered to scale smoothly during Friday evening rushes', img: '/images/observatory/08_sustainable_digital_infrastructure.svg' },
  { id: '09', title: 'Bespoke vs Generic', desc: 'Why cookie-cutter templates destroy dining room brand equity and pricing power', img: '/images/observatory/09_bespoke_vs_template_analysis.svg' },
  { id: '10', title: 'Operational SLA', desc: 'Continuous weekly maintenance, rapid price edits, and weekend uptime protection', img: '/images/observatory/10_long_term_operational_partnership.svg' }
];

export const StudioObservatoryWorkspace: React.FC<StudioObservatoryWorkspaceProps> = ({
  onNavigateToBriefing,
  onNavigateToContact
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn space-y-12">
      {/* Header with Official Logo */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/60 border border-[#FF6A2A]/40 p-1 mb-3 shadow-[0_0_25px_rgba(255,106,42,0.35)]">
          <img
            src="/images/brand/logo.jpeg"
            alt="Forkframe Studio Logo"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-2">
          Destination 07 · Studio Observatory
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#F4F0E8] tracking-tight">
          Where Culinary Passion Meets Digital Universe Engineering
        </h2>
        <p className="text-sm md:text-base text-[#A7A39B] mt-3 leading-relaxed">
          An exploration of our founding philosophy, our specialized focus on the UK hospitality sector, and how we build digital experiences that physically captivate diners.
        </p>
      </div>

      {/* 4 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 md:p-8 rounded-2xl bg-[#191A1D]/80 border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF6A2A]/10 border border-[#FF6A2A]/30 flex items-center justify-center text-[#FF6A2A]">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F4F0E8]">What Forkframe Studio Does</h3>
          <p className="text-xs md:text-sm text-[#A7A39B] leading-relaxed">
            Forkframe Studio is a bespoke creative technology practice dedicated entirely to food and beverage businesses. We design and build cinema-grade websites, commission-free online ordering systems, interactive digital menus, and social promotional engines.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-[#191A1D]/80 border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#C8A879]/10 border border-[#C8A879]/30 flex items-center justify-center text-[#C8A879]">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F4F0E8]">Who We Serve</h3>
          <p className="text-xs md:text-sm text-[#A7A39B] leading-relaxed">
            We partner with independent restaurateurs, artisan bakeries, cocktail lounges, cloud kitchen operators, fast-casual takeaways, and growing hospitality groups across the United Kingdom who want to build a distinctive brand and protect their operating margins.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-[#191A1D]/80 border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F4F0E8]">Why Our Focus Is Relevant</h3>
          <p className="text-xs md:text-sm text-[#A7A39B] leading-relaxed">
            Generic digital agencies do not understand food cost percentages, kitchen display ticket flows, split covers, or the 30% revenue drain of delivery aggregators. We build technology grounded in restaurant unit economics, ensuring every design decision drives guest desire and real profit.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-[#191A1D]/80 border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF6A2A]/10 border border-[#FF6A2A]/30 flex items-center justify-center text-[#FF6A2A]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F4F0E8]">Our Working Process</h3>
          <p className="text-xs md:text-sm text-[#A7A39B] leading-relaxed">
            1. Free Initial Guidance: A friendly 30-minute review of your venue’s digital bottlenecks.<br />
            2. Fixed Scope & Transparent Pricing: No hidden surprises or open-ended hourly billing.<br />
            3. Bespoke Real-Time Engineering: Real 3D and responsive interfaces crafted from zero.<br />
            4. Ongoing Operational Support: We stand by our clients long after launch.
          </p>
        </div>
      </div>

      {/* 4K Studio Architectural Workspace Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-[#FF6A2A]/40 shadow-2xl bg-black/60 group">
        <div className="w-full h-64 sm:h-96 relative">
          <img
            src="/images/photos/studio_workspace_4k.jpg"
            alt="Forkframe Creative Technologist Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF6A2A] text-black">
                PHYSICAL ATELIER
              </span>
              <span className="text-xs font-semibold text-neutral-300">
                UK Creative Technology Laboratory
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#F4F0E8]">
              Where Cinema-Grade Hospitality Software Is Engineered
            </h3>
            <p className="text-xs sm:text-sm text-[#A7A39B] max-w-2xl mt-1">
              Every curve, micro-interaction, and formula in the Forkframe universe is designed by senior hospitality engineers dedicated to culinary excellence.
            </p>
          </div>
        </div>
      </div>

      {/* 10 Visual Architecture & Philosophy Exhibits */}
      <div className="pt-8 border-t border-white/10">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
              Visual Philosophy Deck
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#F4F0E8]">
              The 10 Architectural Tenets of Forkframe
            </h3>
            <p className="text-xs text-[#A7A39B] mt-1 max-w-2xl">
              Visual foundations that guide our interface engineering, hospitality partnerships, and technical integrity.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#C8A879]">10 Visual Pillars</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {OBSERVATORY_EXHIBITS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#191A1D]/80 border border-white/10 hover:border-[#FF6A2A]/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-24 rounded-lg overflow-hidden bg-black/60 border border-white/10 mb-2 relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-[#FF6A2A]">
                      {item.id}
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#F4F0E8] group-hover:text-white truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[#A7A39B] line-clamp-2 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#191A1D] via-[#101113] to-[#191A1D] border border-[#FF6A2A]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div>
          <h4 className="text-xl font-bold text-[#F4F0E8]">Start a conversation with our directors</h4>
          <p className="text-xs text-[#A7A39B] mt-1">
            Reach out directly via email or submit a confidential project brief to begin.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundEngine.playSelectClick();
              onNavigateToContact();
            }}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
          >
            Direct Contact Gateway
          </button>
          <button
            onClick={() => {
              soundEngine.playSelectClick();
              onNavigateToBriefing();
            }}
            className="px-5 py-2.5 text-xs font-semibold text-black bg-[#FF6A2A] hover:bg-[#ff7e47] rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Start a Project Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
