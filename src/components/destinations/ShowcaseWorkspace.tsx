import React, { useState } from 'react';
import { ExternalLink, Star, Award, TrendingUp, Sparkles, Utensils, ArrowRight, CheckCircle2, Camera, Layers, Maximize2, X } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface ShowcaseProject {
  id: string;
  number: string;
  name: string;
  location: string;
  category: string;
  highlightMetric: string;
  metricLabel: string;
  summary: string;
  technologies: string[];
  features: string[];
  image: string; // vector schematic
  photoUrl: string; // 4K photorealistic image
  color: string;
}

const PROJECTS: ShowcaseProject[] = [
  {
    id: 'osteria',
    number: '01',
    name: 'L’Osteria Della Luna',
    location: 'Mayfair, London',
    category: 'Fine Dining & Private Cellar',
    highlightMetric: '+215%',
    metricLabel: 'Direct Table Bookings',
    summary: 'A dark, cinema-grade digital sanctuary featuring real-time 3D table selection, virtual wine cellar walkthrough, and private chef tasting reservations.',
    technologies: ['Three.js WebGL', 'Tailwind CSS', 'Stripe Payments', 'SevenRooms Sync'],
    features: ['Spatial Dining Room Inspection', 'Interactive Vintage Sommelier', 'High-Converting Tasting Flow'],
    image: '/images/portfolio/01_osteria_mayfair_fine_dining.svg',
    photoUrl: '/images/photos/osteria_mayfair_4k.jpg',
    color: '#FF6A2A'
  },
  {
    id: 'kuro',
    number: '02',
    name: 'Kuro Matcha & Buns',
    location: 'Soho & Northern Quarter',
    category: 'Fast-Casual Bakery Chain',
    highlightMetric: '0%',
    metricLabel: 'Aggregator Commissions',
    summary: 'Custom progressive web ordering app engineered to eliminate third-party takeaway fees. Scaled from 1 to 4 locations in 9 months.',
    technologies: ['React 19', 'Web Push Notifications', 'Square POS Link', 'Loyalty Engine'],
    features: ['15-Second Re-order Express', 'Live Kitchen Dispatch', 'Sticker Reward Wallet'],
    image: '/images/portfolio/02_kuro_matcha_buns_ordering.svg',
    photoUrl: '/images/photos/kuro_artisan_4k.jpg',
    color: '#34d399'
  },
  {
    id: 'prime-fire',
    number: '03',
    name: 'Prime Fire Grills',
    location: 'Manchester & Leeds',
    category: 'Premium Steakhouse Group',
    highlightMetric: '£280k',
    metricLabel: 'Monthly Direct Deliveries',
    summary: 'Unified group web portal featuring dynamic butcher cut inspection, digital dry-aging room tour, and master gift card portal.',
    technologies: ['React', 'WebGL Canvas', 'Lightspeed POS', 'Algolia Search'],
    features: ['3D Steak Cut Explorer', 'Multi-Venue Geolocation', 'Corporate Private Dining Portal'],
    image: '/images/portfolio/03_prime_fire_steakhouse_portal.svg',
    photoUrl: '/images/photos/prime_fire_4k.jpg',
    color: '#ef4444'
  },
  {
    id: 'mirabelle',
    number: '04',
    name: 'Maison Mirabelle',
    location: 'Edinburgh & Cotswolds',
    category: 'Artisanal Pâtisserie',
    highlightMetric: '4.9★',
    metricLabel: 'Customer Satisfaction Score',
    summary: 'Luxury temperature-controlled postal drop store for limited weekend viennoiserie, seasonal macarons, and bespoke wedding cake consultations.',
    technologies: ['React', 'DHL Express API', 'Custom Calendar', 'Shopify Backend'],
    features: ['Weekly Drop Countdown Timer', 'Cake Tier Customizer', 'Chilled Courier Tracking'],
    image: '/images/portfolio/04_maison_mirabelle_patisserie.svg',
    photoUrl: '/images/photos/mirabelle_patisserie_4k.jpg',
    color: '#C8A879'
  },
  {
    id: 'botanical',
    number: '05',
    name: 'The Botanical Glasshouse',
    location: 'Chelsea, London',
    category: 'Garden Dining & Cocktail Orangerie',
    highlightMetric: '+180%',
    metricLabel: 'Weekend Brunch Covers',
    summary: 'Living seasonal digital menu that shifts color grading and cocktail recommendations according to sunrise, twilight, and ambient London weather.',
    technologies: ['WebGL Shaders', 'OpenWeather API', 'OpenTable API', 'Motion Canvas'],
    features: ['Atmospheric Lighting Shifts', 'Seasonal Botanical Foraging Notes', 'Instant Garden Pavilion Booking'],
    image: '/images/portfolio/05_botanical_table_reservation.svg',
    photoUrl: '/images/photos/botanical_chelsea_4k.jpg',
    color: '#10b981'
  },
  {
    id: 'smoke-barrel',
    number: '06',
    name: 'Smoke & Barrel BBQ',
    location: 'Bristol & Cardiff',
    category: 'Craft Smokehouse & Taproom',
    highlightMetric: '£1.40',
    metricLabel: 'Avg Spend Increase Per QR Scan',
    summary: 'Ultra-fast QR order-and-pay web app with table tap recognition, real-time meat smoker stock meters, and craft beer flight pairing cards.',
    technologies: ['React Web App', 'Stripe Terminal', 'Thermal POS Print', 'WebSockets'],
    features: ['Real-Time Meat Stock Tracker', 'Beer Flight Builder', 'Split Bill Table Engine'],
    image: '/images/portfolio/06_smoke_barrel_qr_menu.svg',
    photoUrl: '/images/photos/smoke_barrel_4k.jpg',
    color: '#f97316'
  },
  {
    id: 'veloce',
    number: '07',
    name: 'Veloce Street Piadina',
    location: 'Covent Garden & Camden',
    category: 'High-Volume Street Food',
    highlightMetric: '<45s',
    metricLabel: 'Queue-to-Collection Time',
    summary: 'Mobile kiosk and rapid click-and-collect web ordering for bustling commuters, handling over 1,200 orders daily with sub-minute kitchen turnarounds.',
    technologies: ['PWA', 'Kitchen Display Webhook', 'Apple Pay Web', 'Geolocation Dispatch'],
    features: ['Express Geofence Pickup', 'Custom Dough & Filling Builder', 'Live Kitchen Queue Meter'],
    image: '/images/portfolio/07_veloce_street_food_ordering.svg',
    photoUrl: '/images/photos/veloce_piadina_4k.jpg',
    color: '#eab308'
  },
  {
    id: 'artisan-sourdough',
    number: '08',
    name: 'Flour & Hearth Guild',
    location: 'Oxford & Bath',
    category: 'Heritage Bakery & Sourdough Club',
    highlightMetric: '2,400',
    metricLabel: 'Weekly Bread Subscriptions',
    summary: 'Recurring bread subscription and masterclass booking portal with automated weekly sourdough drop allocation and allergen-safe flour manifests.',
    technologies: ['Stripe Billing Subscriptions', 'React', 'PDF Label Generator', 'Automated SMS'],
    features: ['Weekly Loaf Selection Calendar', 'Bakery Masterclass Ticketing', 'Bakers Flour Origin Map'],
    image: '/images/portfolio/08_artisan_sourdough_membership.svg',
    photoUrl: '/images/photos/flour_hearth_4k.jpg',
    color: '#d97706'
  },
  {
    id: 'heritage-brewery',
    number: '09',
    name: 'St. Jude’s Taproom & Cellars',
    location: 'Bermondsey Beer Mile',
    category: 'Craft Brewery & Barrel Room',
    highlightMetric: '+94%',
    metricLabel: 'Private Barrel Room Inquiries',
    summary: 'Interactive taproom portal with real-time draught keg levels, barrel-aged bottle drop reservations, and private party mezzanine scoping.',
    technologies: ['React 19', 'Untappd API', 'Tailwind CSS', 'Instant Enquiry Engine'],
    features: ['Live Keg Tap Status', 'Limited Bottle Release Reservation', 'Event Space 3D Planner'],
    image: '/images/portfolio/09_heritage_brewery_taproom.svg',
    photoUrl: '/images/photos/st_judes_taproom_4k.jpg',
    color: '#8b5cf6'
  },
  {
    id: 'coastal-oyster',
    number: '10',
    name: 'Neptune & Pearl Oyster House',
    location: 'St Ives & Padstow, Cornwall',
    category: 'Coastal Seafood & Champagne Bar',
    highlightMetric: '98%',
    metricLabel: 'Tide-to-Table Freshness Score',
    summary: 'Sensory seafood dining web portal featuring daily tidal catch logs, oyster salinity profiles, and sommelier champagne pairing recommendations.',
    technologies: ['Three.js Water Shaders', 'UK Hydrographic Tidal API', 'SevenRooms Sync', 'Vite'],
    features: ['Live Harbour Tide Gauge', 'Daily Catch Blackboard Sync', 'Sommelier Oyster Pairings'],
    image: '/images/portfolio/10_coastal_oyster_bar_immersive.svg',
    photoUrl: '/images/photos/neptune_oyster_4k.jpg',
    color: '#06b6d4'
  }
];

export const ShowcaseWorkspace: React.FC = () => {
  const [activeProject, setActiveProject] = useState<ShowcaseProject>(PROJECTS[0]);
  const [viewMode, setViewMode] = useState<'photo' | 'schematic'>('photo');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentDisplayImage = viewMode === 'photo' ? activeProject.photoUrl : activeProject.image;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
            Destination 02 · Proven Client Outcomes
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#F4F0E8]">
            Portfolio Galaxy — 10 Food Case Studies
          </h2>
          <p className="text-sm text-[#A7A39B] mt-1 max-w-2xl">
            Selected digital architecture, online ordering ecosystems, and brand experiences created for premier dining groups and culinary innovators across the UK.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Award className="w-4 h-4 text-[#C8A879]" />
          <span>Real operational hospitality benchmarks</span>
        </div>
      </div>

      {/* Featured Active Project Hero Banner */}
      <div className="mb-10 p-6 md:p-8 rounded-3xl bg-[#191A1D]/90 border border-[#FF6A2A]/40 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#FF6A2A]/20 text-[#FF6A2A] border border-[#FF6A2A]/40">
                CASE STUDY {activeProject.number}
              </span>
              <span className="text-xs text-[#A7A39B] uppercase font-semibold">
                {activeProject.location}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-[#F4F0E8]">
              {activeProject.name}
            </h3>
            <span className="text-xs text-[#C8A879] font-medium block">
              {activeProject.category}
            </span>

            <p className="text-sm text-[#A7A39B] leading-relaxed">
              {activeProject.summary}
            </p>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-[#FF6A2A] block">
                  {activeProject.highlightMetric}
                </span>
                <span className="text-xs text-[#A7A39B]">{activeProject.metricLabel}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live & Scaled
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeProject.features.map((feat, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  onClick={() => {
                    soundEngine.playSelectClick();
                    setViewMode('photo');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-[#FF6A2A] text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>4K Photography</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.playSelectClick();
                    setViewMode('schematic');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'schematic'
                      ? 'bg-[#FF6A2A] text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Vector Schematic</span>
                </button>
              </div>

              <button
                onClick={() => setIsZoomOpen(true)}
                title="Inspect in Full Resolution"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-neutral-300 border border-white/10 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#FF6A2A]" />
                <span className="hidden sm:inline">Inspect 4K</span>
              </button>
            </div>

            <div
              onClick={() => setIsZoomOpen(true)}
              className="w-full h-72 sm:h-88 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-inner relative group cursor-zoom-in"
            >
              <img
                src={currentDisplayImage}
                alt={activeProject.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-emerald-400 border border-emerald-500/30">
                    {viewMode === 'photo' ? '4K ULTRA-HD PHOTOGRAPHY' : 'VECTOR SCHEMATIC'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-neutral-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All 10 Projects */}
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#F4F0E8] mb-4">
        Browse All 10 Client Case Studies
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PROJECTS.map((proj) => {
          const isSelected = activeProject.id === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => {
                soundEngine.playSelectClick();
                setActiveProject(proj);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? 'bg-[#191A1D] border-[#FF6A2A] shadow-[0_0_20px_rgba(255,106,42,0.25)]'
                  : 'bg-[#191A1D]/60 border-white/10 hover:border-white/30 hover:bg-[#191A1D]'
              }`}
            >
              <div>
                <div className="w-full h-28 rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-2.5 relative">
                  <img
                    src={proj.photoUrl}
                    alt={proj.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-[#FF6A2A]">
                      {proj.number}
                    </span>
                  </div>
                  <div className="absolute bottom-1 right-1">
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/70 text-neutral-300">
                      4K UHD
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-[#A7A39B] block truncate">{proj.location}</span>
                <h4 className="text-xs font-bold text-[#F4F0E8] group-hover:text-white transition-colors truncate">
                  {proj.name}
                </h4>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] mt-2">
                <span className="font-extrabold text-[#FF6A2A]">{proj.highlightMetric}</span>
                <span className="text-neutral-500 group-hover:text-neutral-300 text-[10px]">Inspect →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Screen 4K Inspection Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#141518] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#101113]">
              <div>
                <h4 className="text-sm md:text-base font-bold text-[#F4F0E8]">
                  {activeProject.name} — 4K Architectural Photography
                </h4>
                <p className="text-xs text-[#A7A39B]">
                  {activeProject.location} · {activeProject.category}
                </p>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeProject.photoUrl}
                alt={activeProject.name}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>

            <div className="p-4 bg-[#101113] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="text-[#FF6A2A] font-extrabold text-sm">{activeProject.highlightMetric}</span>
                <span>{activeProject.metricLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setViewMode(viewMode === 'photo' ? 'schematic' : 'photo');
                  }}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 cursor-pointer"
                >
                  Toggle Schematic Blueprint
                </button>
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="px-3 py-1 rounded-lg bg-[#FF6A2A] text-black font-bold cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
