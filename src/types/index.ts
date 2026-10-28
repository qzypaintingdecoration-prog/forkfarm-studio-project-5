export type SceneId = 
  | 'VOID'            // Scene 01: Arrival in the dark void with 3D desk & laptop
  | 'LAPTOP_ACTIVE'   // Scene 02: Screen transformation & camera entry
  | 'TUNNEL'          // Scene 03: High-speed 3D tunnel travel
  | 'HUB'             // Scene 04: The Orbital Hub & holographic ring stations
  | 'TERMINAL';       // Inside an active destination workspace

export type DestinationId = 
  | 'services'        // D01: Creative Forge (Services & Capabilities)
  | 'portfolio'       // D02: Portfolio Galaxy (Case Studies & Installations)
  | 'social-studio'   // D03: Social Studio (Food Graphic & Media Creator)
  | 'tools'           // D04: Project Calculator (Food Cost, Menu Pricing, Promotion Planner)
  | 'briefing'        // D05: Briefing Chamber (Project Qualification & Inquiry)
  | 'insights'        // D06: Knowledge Archive (Editorial Food Business Insights)
  | 'about'           // D07: Studio Observatory (Brand Philosophy & Approach)
  | 'contact'         // D08: Contact Gateway (Direct Contact & Conversion)
  | 'admin';          // D09: Administration (Protected Studio Console)

export interface DestinationMeta {
  id: DestinationId;
  route: string;
  number: string;
  title: string;
  shortLabel: string;
  tagline: string;
  description: string;
  angle: number; // Angle in orbital ring
  themeColor: string; // e.g. #FF6A2A
}

// Calculators
export interface IngredientItem {
  id: string;
  name: string;
  purchaseCost: number;
  purchaseQuantity: number;
  quantityUsed: number;
  unit: string;
  notes?: string;
}

export interface FoodRecipe {
  id: string;
  name: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages' | 'Bakery';
  portions: number;
  prepMinutes: number;
  ingredients: IngredientItem[];
  targetCostPercent: number; // e.g. 28%
  vatPercent: number; // e.g. 20%
}

export interface MenuPricingScenario {
  costPerPortion: number;
  targetCostPercent: number;
  additionalCostAllowance: number;
  proposedSellingPrice?: number;
  vatPercent: number;
}

export interface ScopeOption {
  id: string;
  category: 'platform' | 'design' | 'menu' | 'ordering' | 'delivery' | 'support';
  name: string;
  description: string;
  basePrice: number;
  estimatedWeeks: number;
  recommendedFor?: string;
}

export interface PromotionScenario {
  originalPrice: number;
  discountPercent: number;
  unitCost: number;
  targetQuantity: number;
}

// Knowledge Archive Articles
export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: 'Digital Menus' | 'Web Engineering' | 'Restaurant Marketing' | 'Menu Pricing' | 'Operations';
  readTime: string;
  date: string;
  summary: string;
  content: string[];
}

// Client Enquiry
export interface ClientEnquiry {
  id: string;
  createdAt: string;
  clientName: string;
  businessName: string;
  businessType: 'Restaurant' | 'Bar & Lounge' | 'Cloud Kitchen' | 'Multi-unit Chain' | 'Artisanal Bakery' | 'Gourmet Food Brand' | 'Takeaway & Fast Casual';
  email: string;
  phone?: string;
  serviceOfInterest: string;
  projectScope: string[];
  budgetTier: '£3,000 - £6,000' | '£6,000 - £12,000' | '£12,000 - £25,000' | '£25,000+';
  targetLaunch: 'Immediate (1-2 mo)' | 'Quarterly (2-4 mo)' | 'Flexible';
  details: string;
  status: 'New' | 'In Review' | 'Discovery Scheduled' | 'Proposal Sent';
  privacyAcknowledged: boolean;
}
