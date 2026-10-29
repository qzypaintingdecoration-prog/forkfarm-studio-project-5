import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X, Sparkles, Filter } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface KnowledgeArticle {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  image: string;
  content: string[];
}

const ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-01',
    number: '01',
    slug: 'digital-menu-design-principles',
    title: 'The Psychology of Digital Menu Engineering',
    category: 'Digital Menus',
    readTime: '5 min read',
    date: 'October 2026',
    image: '/images/knowledge/01_digital_menu_psychology.jpg',
    summary: 'How visual hierarchy, optical focal points, and price anchoring on digital QR screens lift average order value by 18% without guest friction.',
    content: [
      'In traditional paper menus, guests read in a predictable Z-pattern or Golden Triangle. On mobile digital menus, reading behavior transforms into rapid vertical skimming driven by sensory imagery and high-contrast typographic anchors.',
      '1. Optical Anchoring: Position high-margin signature items at the top-right of desktop viewports or within the first 1.5 scroll screens on mobile. Pairing a descriptive culinary story with provenance ("Dry-aged Highland beef") increases willingness to spend by up to 24%.',
      '2. Currency Symbol Decoupling: Removing prominent currency symbols or formatting prices with subdued font weights softens pain-of-paying response while maintaining clarity.',
      '3. Dietary and Allergen Transparency: By integrating instant vegan, gluten-free, and nut-allergy toggles, front-of-house staff save an average of 4 minutes per table during peak dinner service.'
    ]
  },
  {
    id: 'art-02',
    number: '02',
    slug: 'website-essentials-for-venues',
    title: 'The 4 Non-Negotiables of High-Converting Restaurant Websites',
    category: 'Web Engineering',
    readTime: '6 min read',
    date: 'October 2026',
    image: '/images/knowledge/02_high_converting_restaurant_web.jpg',
    summary: 'Why generic template themes cost dining venues thousands in lost reservations, and the core technical benchmarks that turn casual visitors into booked tables.',
    content: [
      'Over 72% of restaurant website visits happen on mobile devices while guests are actively on their way or deciding where to eat within the next two hours. A website that takes 4 seconds to load loses half of its potential covers before the hero image renders.',
      '1. Sub-Second Time-to-Interactive: Heavy WordPress plugins and uncompressed photo dumps destroy mobile conversion. Websites built on modern reactive frameworks load instantly and preserve guest desire.',
      '2. Direct Reservation Affordance: The booking button must be permanently accessible on the screen, opening reservation modals directly without sending visitors through jarring third-party redirects.',
      '3. High-Fidelity Atmosphere: Photography must convey actual venue lighting and ambient intimacy rather than sterile stock food imagery.'
    ]
  },
  {
    id: 'art-03',
    number: '03',
    slug: 'local-online-visibility',
    title: 'Dominating Local Search & Google Maps in the UK Market',
    category: 'Restaurant Marketing',
    readTime: '4 min read',
    date: 'September 2026',
    image: '/images/knowledge/03_local_seo_google_maps.jpg',
    summary: 'A tactical blueprint for independent dining venues to capture high-intent local food searches without spending thousands on paid search ads.',
    content: [
      'When diners search "best pasta in Soho" or "private dining rooms Manchester", Google evaluates local proximity, structured schema markup, and fresh visual content.',
      '1. Schema.org Restaurant Structured Data: Your website must embed machine-readable JSON-LD specifying exact opening hours, geo-coordinates, menu URLs, price range, and reservation links.',
      '2. Geo-Tagged Photography Drops: Regularly uploading geotagged dish photography to Google Business profiles generates 3× more direct direction requests than static listings.',
      '3. Direct Booking Link Ownership: Ensure your Google Profile links directly to your website booking flow rather than an aggregator that takes commissions on every cover.'
    ]
  },
  {
    id: 'art-04',
    number: '04',
    slug: 'social-media-planning',
    title: 'From Scroll to Table: High-Frequency Food Social Production',
    category: 'Restaurant Marketing',
    readTime: '5 min read',
    date: 'September 2026',
    image: '/images/knowledge/04_high_frequency_social_strategy.jpg',
    summary: 'How independent kitchens can produce studio-grade social promotional drops in under 10 minutes per week using automated canvas systems.',
    content: [
      'Hospitality social media is plagued by either sporadic low-quality kitchen snapshots or expensive agency retainer burnout. The sweet spot is high-contrast, automated visual templates.',
      '1. The 48-Hour Drop Model: Announce limited weekend tasting allocations or pastry batches with high-contrast text badges. Scarcity and clear booking links convert followers into immediate customers.',
      '2. Consistent Brand Palettes: Retaining identical typography and ember/gold borders across every story establishes instant recognition in follower feeds.'
    ]
  },
  {
    id: 'art-05',
    number: '05',
    slug: 'menu-pricing-inflation',
    title: 'Protecting Prime Margins Against Wholesale Food Inflation',
    category: 'Menu Pricing',
    readTime: '7 min read',
    date: 'August 2026',
    image: '/images/knowledge/05_inflation_prime_margin_protection.jpg',
    summary: 'Step-by-step mathematical breakdown for recalculating recipe food cost percentages and updating retail menu prices without triggering customer backlash.',
    content: [
      'Wholesale dairy, olive oil, and meat prices fluctuate rapidly. A dish originally calculated at 28% food cost can silently drift to 38% within six months if recipes are not audited continuously.',
      '1. Batch Prime Costing: Break down every garnish, oil, and packaging element. Hidden costs in disposable takeaway packaging frequently erode gross margins by 4–6%.',
      '2. Strategic Price Anchoring: Rather than raising prices across the entire menu simultaneously, adjust high-frequency appetizers and beverages where price elasticity is higher.',
      '3. Contribution Margin vs. Food Cost Percentage: A £40 steak with a 35% food cost contributes £26 in cash gross margin, whereas a £10 pasta with a 20% food cost contributes only £8. Focus on cash margin contribution.'
    ]
  },
  {
    id: 'art-06',
    number: '06',
    slug: 'practical-digital-tools',
    title: 'The Modern Restaurant Tech Stack: Eliminating Aggregator Dependency',
    category: 'Operations',
    readTime: '5 min read',
    date: 'August 2026',
    image: '/images/knowledge/06_zero_commission_ordering_economics.jpg',
    summary: 'How multi-unit operators and cloud kitchens replace 30% delivery commission aggregators with direct-to-consumer web apps and unified POS sync.',
    content: [
      'Surrendering 30% of takeaway revenue to third-party delivery apps has compressed restaurant net operating margins to unsustainable levels.',
      '1. First-Party Ordering Economics: By offering guests an exclusive direct ordering portal with 10% loyalty discounts, venues retain the customer relationship and generate 20% higher net margins.',
      '2. Unified Kitchen Dispatch: Direct web orders must route cleanly into existing kitchen display systems or thermal receipt printers to avoid manual order re-typing errors.'
    ]
  },
  {
    id: 'art-07',
    number: '07',
    slug: 'botanical-mocktail-beverage-ux',
    title: 'Botanical Beverage Engineering: Digital Mocktail & Craft Infusion Lists',
    category: 'Digital Menus',
    readTime: '5 min read',
    date: 'July 2026',
    image: '/images/knowledge/07_botanical_beverage_architecture.jpg',
    summary: 'How modern halal-first fine dining and hospitality venues benefit from interactive mocktail menus, house shrub infusions, and artisanal beverage storytelling on guest devices.',
    content: [
      'Artisanal mocktails, cold-pressed botanical infusions, and fermented sparkling shrubs are the fastest-growing high-margin segment in contemporary dining.',
      '1. Flavor Profile Filters: Allow guests to filter craft beverages by sweet, tart, herbal, or smoked botanical notes in two taps.',
      '2. House Cordial & Foraging Stories: Highlighting cold-pressed botanicals and local provenance drives premium non-alcoholic drink sales.'
    ]
  },
  {
    id: 'art-08',
    number: '08',
    slug: 'kitchen-display-ticket-speed',
    title: 'Back-of-House Harmony: Direct KDS & Kitchen Ticket Routing',
    category: 'Operations',
    readTime: '6 min read',
    date: 'July 2026',
    image: '/images/knowledge/08_back_of_house_kds_routing.jpg',
    summary: 'Preventing kitchen line chaos through automated course timing, allergy highlights, and direct thermal printer firing during high-intensity dinner service.',
    content: [
      'The barrier to direct online ordering is often back-of-house panic. When tickets print illegibly or bypass prep stations, food quality suffers.',
      '1. Color-Coded Allergen Printing: Natasha’s Law allergens must appear in inverted bold font on thermal dockets.',
      '2. Automated Course Pacing: Synchronize starter and main firing timers between cold larder, pastry, and grill stations.'
    ]
  },
  {
    id: 'art-09',
    number: '09',
    slug: 'allergen-compliance-natashas-law',
    title: 'Natasha’s Law & Allergen Transparency as a Guest Conversion Driver',
    category: 'Operations',
    readTime: '4 min read',
    date: 'June 2026',
    image: '/images/knowledge/09_allergen_compliance_natashas_law.jpg',
    summary: 'Turning statutory UK Food Standards Agency allergen disclosures into an unmistakable sign of hospitality trust and dining room professionalism.',
    content: [
      'Over 20% of UK diners now have food allergies, intolerances, or specific dietary requirements in their party. The venue that answers dietary queries fastest wins the table booking.',
      '1. Dynamic Dietary Switches: Diners can toggle "Gluten Free", "Dairy Free", or "Nut Free" to see instantly adapted menus.',
      '2. Verified Kitchen Cross-Contact Disclosures: Clear communication builds unshakeable diner trust and repeat family loyalty.'
    ]
  },
  {
    id: 'art-10',
    number: '10',
    slug: 'front-of-house-staff-retention-ux',
    title: 'Front-of-House Retention: Intuitive Digital Tools for Service Staff',
    category: 'Operations',
    readTime: '5 min read',
    date: 'June 2026',
    image: '/images/knowledge/10_table_turn_rate_analytics.jpg',
    summary: 'Reducing waitstaff stress during peak Friday evening service with intuitive handheld table order taking and instant recipe & allergen references.',
    content: [
      'High staff turnover in UK hospitality is exacerbated by complex, sluggish legacy EPOS systems that require weeks of training.',
      '1. Sub-10-Minute Onboarding: Mobile web interfaces with visual dish cards allow new servers to take error-free orders on day one.',
      '2. Real-Time 86ing: When an item runs out in the kitchen, it instantly disappears from digital ordering menus and staff handhelds.'
    ]
  }
];

export const KnowledgeArchiveWorkspace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  const categories = ['All', 'Digital Menus', 'Web Engineering', 'Restaurant Marketing', 'Menu Pricing', 'Operations'];

  const filteredArticles = selectedCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
            Destination 06 · Knowledge Archive
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#F4F0E8]">
            Hospitality Intelligence & Strategy Deck
          </h2>
          <p className="text-sm text-[#A7A39B] mt-1 max-w-2xl">
            10 practical, verified architectural articles on menu psychology, sub-second web engineering, local SEO dominance, and culinary unit economics in the UK market.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEngine.playSelectClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF6A2A] text-black font-bold'
                  : 'bg-white/5 text-[#A7A39B] hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 10 Illustrated Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => {
              soundEngine.playSelectClick();
              setActiveArticle(art);
            }}
            className="p-5 rounded-2xl bg-[#191A1D]/85 border border-white/10 hover:border-[#FF6A2A]/50 transition-all cursor-pointer flex flex-col justify-between group shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div>
              {/* SVG Image Illustration */}
              <div className="w-full h-36 rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-4 relative group-hover:border-[#FF6A2A]/40 transition-colors">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-[#FF6A2A]">
                    {art.number}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#A7A39B] mb-2 font-mono">
                <span className="text-[#FF6A2A] font-bold">{art.category}</span>
                <span>·</span>
                <span>{art.readTime}</span>
              </div>

              <h3 className="text-base font-bold text-[#F4F0E8] group-hover:text-white transition-colors leading-snug mb-2">
                {art.title}
              </h3>

              <p className="text-xs text-[#A7A39B] leading-relaxed line-clamp-3">
                {art.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#A7A39B] group-hover:text-white mt-4">
              <span>{art.date}</span>
              <span className="text-[#FF6A2A] flex items-center gap-1">
                Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#191A1D] border border-[#FF6A2A]/50 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-56 rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-6">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#A7A39B] mb-3">
              <span className="px-2.5 py-1 rounded bg-[#FF6A2A]/15 text-[#FF6A2A] border border-[#FF6A2A]/30 font-bold">
                {activeArticle.category}
              </span>
              <span>{activeArticle.date}</span>
              <span>·</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-[#F4F0E8] mb-4 leading-tight">
              {activeArticle.title}
            </h3>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
              <p className="text-xs text-[#C8A879] italic font-medium leading-relaxed">
                {activeArticle.summary}
              </p>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-[#A7A39B] leading-relaxed">
              {activeArticle.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-mono">Forkframe Studio Knowledge Archive</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
