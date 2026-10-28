import { DestinationId, DestinationMeta } from '../types';

export const DESTINATIONS: DestinationMeta[] = [
  {
    id: 'services',
    route: '/services',
    number: '01',
    title: 'Creative Forge',
    shortLabel: 'Forge (Services)',
    tagline: 'Services & Capabilities',
    description: 'A monumental digital workshop where bespoke web architectures, online ordering systems, and digital menus are engineered for food businesses.',
    angle: 0,
    themeColor: '#FF6A2A' // Ember Orange
  },
  {
    id: 'portfolio',
    route: '/portfolio',
    number: '02',
    title: 'Portfolio Galaxy',
    shortLabel: 'Portfolio',
    tagline: 'Exhibition & Case Studies',
    description: 'An art-directed gallery of verified digital hospitality installations, online ordering transformations, and bespoke brand ecosystems.',
    angle: (2 * Math.PI) / 8,
    themeColor: '#C8A879' // Champagne
  },
  {
    id: 'social-studio',
    route: '/social-studio',
    number: '03',
    title: 'Social Studio',
    shortLabel: 'Social Studio',
    tagline: 'Visual Media Creator',
    description: 'A real-time production laboratory to design, customize, and export high-conversion promotional graphics and seasonal menu announcements.',
    angle: (4 * Math.PI) / 8,
    themeColor: '#38BDF8' // Cyan / Studio Light
  },
  {
    id: 'tools',
    route: '/tools',
    number: '04',
    title: 'Project Calculator',
    shortLabel: 'Calculators',
    tagline: 'Food Cost & Pricing Suite',
    description: 'Precision margin engineering tools: Food-Cost Calculator, Menu-Pricing Calculator, and Promotion Planner with exportable summary reports.',
    angle: (6 * Math.PI) / 8,
    themeColor: '#F4F0E8' // Warm Ivory
  },
  {
    id: 'briefing',
    route: '/briefing',
    number: '05',
    title: 'Briefing Chamber',
    shortLabel: 'Briefing',
    tagline: 'Project Qualification & Intake',
    description: 'A focused, confidential environment to outline your venue objectives, scope, and timeline for review by our creative directors.',
    angle: (8 * Math.PI) / 8,
    themeColor: '#FF6A2A' // Ember Orange
  },
  {
    id: 'insights',
    route: '/insights',
    number: '06',
    title: 'Knowledge Archive',
    shortLabel: 'Insights',
    tagline: 'Editorial & Strategy Guides',
    description: 'Practical, research-grounded editorial intelligence on menu engineering, local restaurant visibility, and digital ordering economics.',
    angle: (10 * Math.PI) / 8,
    themeColor: '#A7A39B' // Muted Stone
  },
  {
    id: 'about',
    route: '/about',
    number: '07',
    title: 'Studio Observatory',
    shortLabel: 'Observatory',
    tagline: 'Brand Story & Approach',
    description: 'Discover the philosophy, culinary empathy, and engineering rigor that define Forkframe Studio as the UK’s premier digital partner for food brands.',
    angle: (12 * Math.PI) / 8,
    themeColor: '#C8A879' // Champagne
  },
  {
    id: 'contact',
    route: '/contact',
    number: '08',
    title: 'Contact Gateway',
    shortLabel: 'Contact',
    tagline: 'Direct Communication',
    description: 'Direct communication channels with studio directors via studioforkframe@gmail.com and rapid qualification consultation.',
    angle: (14 * Math.PI) / 8,
    themeColor: '#FF6A2A' // Ember Orange
  }
];

export function getDestinationById(id: DestinationId): DestinationMeta | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}

export function getDestinationByRoute(pathname: string): DestinationMeta | undefined {
  const clean = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return DESTINATIONS.find((d) => d.route === clean);
}
