import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/images');

const destinations = {
  forge: [
    { name: '01_bespoke_restaurant_web', title: 'Bespoke Restaurant Website Mockup', icon: '🍽️', color: '#FF6A2A' },
    { name: '02_cafe_artisan_web', title: 'Artisan Café & Bakery Platform', icon: '☕', color: '#C8A879' },
    { name: '03_takeaway_ordering_system', title: 'Takeaway Direct Ordering Engine', icon: '🥡', color: '#38BDF8' },
    { name: '04_desktop_immersive_experience', title: 'Desktop 60 FPS Venue Experience', icon: '💻', color: '#FF6A2A' },
    { name: '05_mobile_fast_ordering_app', title: 'Mobile 15-Second Express Re-Order', icon: '📱', color: '#10B981' },
    { name: '06_digital_qr_sommelier_menu', title: 'Digital QR Sommelier Wine Menu', icon: '🍷', color: '#EF4444' },
    { name: '07_printed_foil_menu_mockup', title: 'Foil-Stamped Tactile Menu Craft', icon: '📜', color: '#C8A879' },
    { name: '08_social_drop_promo_system', title: '48-Hour Social Drop Campaign Pack', icon: '✨', color: '#FF6A2A' },
    { name: '09_food_business_app_dashboard', title: 'Enterprise Venue Management App', icon: '⚡', color: '#38BDF8' },
    { name: '10_continuous_support_workflow', title: '24/7 Hosting & Price Update Sync', icon: '🛡️', color: '#10B981' }
  ],
  portfolio: [
    { name: '01_losteria_della_luna_mayfair', title: 'L’Osteria Della Luna · Mayfair Flagship', icon: '🍝', color: '#FF6A2A' },
    { name: '02_kuro_matcha_buns_chain', title: 'Kuro Matcha & Buns · 4-Branch Portal', icon: '🍵', color: '#10B981' },
    { name: '03_prime_fire_steakhouse', title: 'Prime Fire Grills · 3D Meat Cut Tour', icon: '🥩', color: '#EF4444' },
    { name: '04_maison_mirabelle_patisserie', title: 'Maison Mirabelle · Postal Drops', icon: '🥐', color: '#38BDF8' },
    { name: '05_botanical_cocktail_speakeasy', title: 'The Alchemist Vault · Cellar Booking', icon: '🍸', color: '#C8A879' },
    { name: '06_neapolitan_wood_fired_pizza', title: 'Fermento 48 · Direct Click & Collect', icon: '🍕', color: '#FF6A2A' },
    { name: '07_seafood_raw_bar_omakase', title: 'Kaiyo Omakase · 20-Cover Booking', icon: '🍣', color: '#38BDF8' },
    { name: '08_craft_brewery_taproom', title: 'Iron Kettle Brewing · Keg & Can Club', icon: '🍺', color: '#C8A879' },
    { name: '09_weekend_brunch_club', title: 'Solstice Brunch & Specialty Coffee', icon: '🥞', color: '#FF6A2A' },
    { name: '10_gourmet_burger_smokehouse', title: 'Black Truffle Smokehouse · Express POS', icon: '🍔', color: '#EF4444' }
  ],
  'social-studio': [
    { name: '01_wagyu_burger_social_drop', title: 'Wagyu Burger & Craft Brew 1080p Drop', icon: '🍔', color: '#FF6A2A' },
    { name: '02_artisan_pizza_story_drop', title: 'Wood-Fired Neapolitan 9:16 Story Drop', icon: '🍕', color: '#EF4444' },
    { name: '03_omakase_autumn_announcement', title: 'Autumn Omakase Tasting 20 Covers', icon: '🍣', color: '#38BDF8' },
    { name: '04_truffle_pasta_fresh_today', title: 'Fresh Egg Yolk Truffle Tagliolini Feed', icon: '🍝', color: '#C8A879' },
    { name: '05_weekend_brunch_limited_cover', title: 'Weekend Brunch Gravlax & Benedict', icon: '🍳', color: '#10B981' },
    { name: '06_happy_hour_cocktail_feature', title: 'Fig Old Fashioned Twilight Feature', icon: '🥃', color: '#C8A879' },
    { name: '07_sunday_roast_special_booking', title: 'Dry-Aged Beef Sunday Roast Card', icon: '🥩', color: '#FF6A2A' },
    { name: '08_pastry_viennoiserie_postal_box', title: 'Croissant & Macaron Postal Box Drop', icon: '🥐', color: '#38BDF8' },
    { name: '09_seafood_platter_flash_offer', title: 'Fresh Native Lobster & Oysters Special', icon: '🦞', color: '#38BDF8' },
    { name: '10_plant_based_gourmet_tasting', title: 'Wild Forest Mushroom & Truffle Tasting', icon: '🍄', color: '#10B981' }
  ],
  calculators: [
    { name: '01_ingredient_batch_breakdown', title: 'Prime Food Cost Ingredient Breakdown', icon: '⚖️', color: '#FF6A2A' },
    { name: '02_recipe_portion_yield_curve', title: 'Recipe Batch & Portion Yield Analysis', icon: '📊', color: '#C8A879' },
    { name: '03_prime_portion_cost_gauge', title: 'Prime Portion Cost vs Industry Target', icon: '🎯', color: '#38BDF8' },
    { name: '04_menu_pricing_formula_diagram', title: 'Net Selling Price Formula Breakdown', icon: '📐', color: '#10B981' },
    { name: '05_target_food_cost_benchmark', title: 'UK Hospitality 28% Benchmark Target', icon: '📈', color: '#FF6A2A' },
    { name: '06_gross_contribution_per_cover', title: 'Cash Contribution vs Net Profit Margin', icon: '💷', color: '#C8A879' },
    { name: '07_promotional_discount_curve', title: 'Promotional Discount Impact Curve', icon: '🏷️', color: '#EF4444' },
    { name: '08_campaign_revenue_forecast', title: 'Campaign Sales Volume Forecast Model', icon: '🔮', color: '#38BDF8' },
    { name: '09_wholesale_inflation_hedging', title: 'Ingredient Wholesale Inflation Hedging', icon: '🛡️', color: '#10B981' },
    { name: '10_sample_kitchen_recipe_card', title: 'Executive Downloadable Cost Card Format', icon: '📋', color: '#C8A879' }
  ],
  briefing: [
    { name: '01_venue_scope_blueprint', title: 'Hospitality Digital Scope Blueprint', icon: '🗺️', color: '#FF6A2A' },
    { name: '02_culinary_identity_intake', title: 'Culinary Identity & Ethos Assessment', icon: '🖋️', color: '#C8A879' },
    { name: '03_mobile_ordering_architecture', title: 'Direct Ordering App Technical Flow', icon: '📲', color: '#38BDF8' },
    { name: '04_menu_engineering_strategy', title: 'Menu Psychology & Item Matrix Scoping', icon: '📜', color: '#10B981' },
    { name: '05_sprint_timeline_schedule', title: '4-Week Rapid Launch Sprint Timeline', icon: '⏱️', color: '#FF6A2A' },
    { name: '06_photography_asset_audit', title: 'Food Photography & 3D Asset Readiness', icon: '📷', color: '#C8A879' },
    { name: '07_pos_kds_integration_map', title: 'Toast / Lightspeed / Square Sync Map', icon: '🔌', color: '#38BDF8' },
    { name: '08_design_revision_milestones', title: 'Collaborative Iteration & Approval Gates', icon: '🔄', color: '#10B981' },
    { name: '09_pre_launch_qa_checklist', title: 'Payment Test & Cross-Browser QA Audit', icon: '✅', color: '#FF6A2A' },
    { name: '10_dedicated_director_onboarding', title: 'Senior Tech Director Account Lead', icon: '🤝', color: '#C8A879' }
  ],
  knowledge: [
    { name: '01_menu_psychology_heatmap', title: 'Digital Menu Attention & Eye Tracking Heatmap', icon: '👁️', color: '#FF6A2A' },
    { name: '02_high_converting_web_structure', title: 'Restaurant Website Conversion Architecture', icon: '🏗️', color: '#C8A879' },
    { name: '03_google_local_seo_schema', title: 'Local Search & Google Maps Proximity Map', icon: '📍', color: '#38BDF8' },
    { name: '04_48_hour_social_drop_model', title: 'The 48-Hour Scarcity Drop Framework', icon: '⚡', color: '#10B981' },
    { name: '05_food_cost_inflation_matrix', title: 'Dairy & Protein Inflation Mitigation Matrix', icon: '📉', color: '#EF4444' },
    { name: '06_first_party_ordering_roi', title: '0% Aggregator vs 30% Fee Unit Economics', icon: '💰', color: '#FF6A2A' },
    { name: '07_mobile_allergen_compliance', title: 'UK FSA 14-Allergen Digital Audit Flow', icon: '⚠️', color: '#C8A879' },
    { name: '08_sommelier_wine_cellar_ux', title: 'Digital Wine List & Tasting Notes UX', icon: '🍾', color: '#38BDF8' },
    { name: '09_packaging_thermal_economics', title: 'Delivery Packaging Quality & Temperature', icon: '📦', color: '#10B981' },
    { name: '10_table_turn_rate_analytics', title: 'Table Turn Optimization via Fast Checkout', icon: '⏳', color: '#FF6A2A' }
  ],
  observatory: [
    { name: '01_creative_workshop_rotunda', title: 'Forkframe Studio Architectural Rotunda', icon: '🏛️', color: '#FF6A2A' },
    { name: '02_hospitality_product_stack', title: 'Modern Restaurant Technology Stack', icon: '🥞', color: '#C8A879' },
    { name: '03_bespoke_design_craft_standard', title: 'Cinema-Grade WebGL & Spatial Craft', icon: '🎨', color: '#38BDF8' },
    { name: '04_mobile_first_viewport_rigor', title: 'Mobile Viewport Optical Proportions', icon: '📐', color: '#10B981' },
    { name: '05_culinary_empathy_ethos', title: 'Culinary Empathy & Head Chef Respect', icon: '👨‍🍳', color: '#FF6A2A' },
    { name: '06_design_system_component_matrix', title: 'Branded Component Tokens & Typography', icon: '🔲', color: '#C8A879' },
    { name: '07_responsive_breakpoint_grid', title: 'Adaptive 320px to 4K Ultra-Wide Grid', icon: '📱', color: '#38BDF8' },
    { name: '08_four_step_delivery_framework', title: 'Discovery to Deployment Lifecycle', icon: '🚀', color: '#10B981' },
    { name: '09_zero_aggregator_tax_mission', title: 'Independent Hospitality Margin Defense', icon: '🛡️', color: '#EF4444' },
    { name: '10_creative_philosophy_horizon', title: 'The Infinite Dimension Spatial Horizon', icon: '🌌', color: '#C8A879' }
  ],
  contact: [
    { name: '01_direct_studio_communication', title: 'Direct Line: studioforkframe@gmail.com', icon: '✉️', color: '#FF6A2A' },
    { name: '02_twenty_four_hour_sla_guarantee', title: '24-Hour Review Turnaround Commitment', icon: '⏱️', color: '#C8A879' },
    { name: '03_pre_briefing_scoping_guide', title: 'Pre-Briefing Requirement Preparation', icon: '📝', color: '#38BDF8' },
    { name: '04_video_discovery_session_agenda', title: '30-Minute Free Strategic Consultation', icon: '📹', color: '#10B981' },
    { name: '05_transparent_quote_delivery', title: 'Fixed-Price Itemized Quotation Document', icon: '📑', color: '#FF6A2A' },
    { name: '06_technical_sla_uptime_spec', title: 'Hospitality Hosting & Security Guarantee', icon: '🔒', color: '#C8A879' },
    { name: '07_print_menu_sample_pack', title: 'Tactile Paper & Foil Sample Dispatch', icon: '📬', color: '#38BDF8' },
    { name: '08_online_ordering_migration_plan', title: 'Zero-Downtime Menu Migration Protocol', icon: '🔄', color: '#10B981' },
    { name: '09_secure_nda_confidentiality', title: 'UK NDA & Recipe Confidentiality Standard', icon: '📜', color: '#FF6A2A' },
    { name: '10_hospitality_partner_network', title: 'UK Culinary Supplier & Merchant Network', icon: '🤝', color: '#C8A879' }
  ]
};

function generateSvg(item, destKey) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#191A1D"/>
      <stop offset="50%" stop-color="#121316"/>
      <stop offset="100%" stop-color="#0A0B0D"/>
    </linearGradient>
    <radialGradient id="aura" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${item.color}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${item.color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2D3039"/>
      <stop offset="50%" stop-color="#4B505F"/>
      <stop offset="100%" stop-color="#2D3039"/>
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="500" rx="20" fill="url(#bgGrad)"/>
  <rect width="800" height="500" rx="20" fill="url(#aura)"/>
  
  <!-- Architectural Outer Hairline -->
  <rect x="24" y="24" width="752" height="452" rx="14" fill="none" stroke="${item.color}" stroke-opacity="0.3" stroke-width="1.5"/>
  <rect x="36" y="36" width="728" height="428" rx="10" fill="none" stroke="#F4F0E8" stroke-opacity="0.08" stroke-width="1"/>

  <!-- Top Brand Watermark -->
  <text x="50" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="${item.color}" letter-spacing="3">FORKFRAME STUDIO · ${destKey.toUpperCase().replace('-', ' ')}</text>
  <text x="750" y="65" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="11" fill="#A7A39B" opacity="0.8">SPEC-${item.name.slice(0, 2)}</text>

  <!-- Central Visual Display Card -->
  <rect x="70" y="95" width="660" height="310" rx="12" fill="#141519" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
  
  <!-- Mockup UI Header Bar -->
  <rect x="70" y="95" width="660" height="36" rx="12" fill="#1C1E24"/>
  <circle cx="95" cy="113" r="5" fill="#EF4444" opacity="0.8"/>
  <circle cx="112" cy="113" r="5" fill="#F59E0B" opacity="0.8"/>
  <circle cx="129" cy="113" r="5" fill="#10B981" opacity="0.8"/>
  <rect x="220" y="103" width="360" height="20" rx="6" fill="#121316"/>
  <text x="400" y="117" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" fill="#A7A39B">forkframe.studio/${destKey}/${item.name}</text>

  <!-- Central Graphic Subject -->
  <circle cx="400" cy="245" r="75" fill="${item.color}" fill-opacity="0.12" stroke="${item.color}" stroke-opacity="0.4" stroke-width="2"/>
  <circle cx="400" cy="245" r="55" fill="none" stroke="#F4F0E8" stroke-opacity="0.2" stroke-dasharray="6,4" stroke-width="1.5"/>
  <text x="400" y="260" text-anchor="middle" font-size="44">${item.icon}</text>

  <!-- Decorative Architectural Grid Lines -->
  <line x1="120" y1="245" x2="300" y2="245" stroke="${item.color}" stroke-opacity="0.3" stroke-width="1"/>
  <line x1="500" y1="245" x2="680" y2="245" stroke="${item.color}" stroke-opacity="0.3" stroke-width="1"/>
  <circle cx="300" cy="245" r="3" fill="${item.color}"/>
  <circle cx="500" cy="245" r="3" fill="${item.color}"/>

  <!-- Bottom Title Plate -->
  <rect x="100" y="340" width="600" height="50" rx="8" fill="#101113" fill-opacity="0.9" stroke="${item.color}" stroke-opacity="0.25"/>
  <text x="400" y="371" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="17" font-weight="700" fill="#F4F0E8" letter-spacing="0.5">${item.title}</text>

  <!-- Bottom Status Footer -->
  <text x="50" y="445" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#A7A39B">High-Fidelity Hospitality Visual Asset</text>
  <text x="750" y="445" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="${item.color}">VERIFIED UK PRODUCTION</text>
</svg>`;
}

let totalCount = 0;
for (const [dest, items] of Object.entries(destinations)) {
  const destDir = path.join(baseDir, dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const item of items) {
    const filename = `${item.name}.svg`;
    const filePath = path.join(destDir, filename);
    const content = generateSvg(item, dest);
    fs.writeFileSync(filePath, content, 'utf8');
    totalCount++;
  }
}

console.log(`Generated ${totalCount} high-quality visual SVG assets across 8 destinations!`);
