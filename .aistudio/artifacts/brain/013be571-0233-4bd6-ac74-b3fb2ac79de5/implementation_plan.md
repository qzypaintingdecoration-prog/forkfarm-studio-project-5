# Forkframe Studio: The Infinite Dimension
## Master Implementation Plan — From Absolute Zero to a Production-Ready 3D Digital Universe

Forkframe Studio is a premium interactive 3D digital universe and full-stack creative technology studio designed specifically as a digital partner for food businesses and high-craft brands. This architecture plan establishes the system engineering, real-time spatial navigation, transition state machines, and functional business suites from initial arrival through full interactive deployment.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed and incorporated as foundational specifications:

- **Confirmed Decision 1 (Primary Business Focus)**: Food and hospitality digital partner focus. The orbital hub and terminal installations directly showcase high-utility food business capabilities: **Social Studio** (real banner & menu social post design engine), **Food Cost Calculator**, **Menu Pricing Calculator**, **Promotion Planner**, **Digital Menu & Print**, and **Apps & Ordering Systems**, alongside flagship bespoke Web & 3D engineering.
- **Confirmed Decision 2 (3D Tunnel Travel & Motion Control)**: Full cinematic high-speed tunnel with spatial camera acceleration, perspective expansion, directional light streaks, and rings, coupled with an immediate **"Skip Transition"** affordance, a persistent **Reduced Motion Mode** toggle, and direct deep-linking to every destination.
- **Confirmed Decision 3 (Audio System)**: Real-time procedural **Web Audio API** sound engine. Requires zero heavy audio asset downloads, guarantees instant responsiveness without CORS/codec delays, reacts dynamically to camera velocity and terminal interactions, and operates with a persistent sound toggle remembering user state.

---

### 1. Overview & Core Concept

- **What It Does**: Transmutes an ordinary studio marketing site into a navigable digital universe where 3D space is the primary interface. Visitors enter through a physical laptop workspace portal, accelerate through a high-speed dimensional tunnel, and arrive at an orbital hub surrounded by floating holographic terminals. Each terminal provides genuine business functionality: a working social media graphics creator, hospitality cost & pricing calculators, interactive project scoping, portfolio showcases, and a secure client briefing & administration pipeline.
- **Target Audience / Persona**: Food entrepreneurs, restaurant groups, hospitality brands, multi-location food enterprises, and ambitious culinary creators looking for cutting-edge digital experiences, online ordering systems, and high-impact visual branding.
- **Key Value**: Delivers unforgettable brand differentiation through world-class spatial interaction while providing immediate, high-utility business tools that convert visitors into active clients.

---

### 2. User Experience & Visual Design

#### A. The Continuous Spatial Journey
```
┌─────────────────┐      Click / Tap       ┌────────────────────────┐
│  SCENE 01:      │ ─────────────────────> │  SCENE 02:             │
│  Infinite Void  │                        │  Laptop Screen Portal  │
│  & Physical Desk│                        │  Alignment & Entry     │
└─────────────────┘                        └────────────────────────┘
                                                       │
                                                       ▼ Camera Through Screen
┌─────────────────┐      Arrive At Hub     ┌────────────────────────┐
│  SCENE 04:      │ <───────────────────── │  SCENE 03:             │
│  Orbital Hub &  │                        │  High-Speed 3D Tunnel  │
│  Nexus Terminals│                        │  Velocity, Streaks & FX│
└─────────────────┘                        └────────────────────────┘
         │
         ├───> [Terminal 1: Social Studio] (Live 2D Canvas Editor & Templates)
         ├───> [Terminal 2: Hospitality Tools] (Food Cost & Menu Pricing Engine)
         ├───> [Terminal 3: Design & Websites] (Interactive Showcase & Demos)
         ├───> [Terminal 4: Project Scoper] (Transparent Estimate Calculator)
         ├───> [Terminal 5: Client Briefing] (Multi-step Persistent Enquiry)
         └───> [Terminal 6: Studio Admin] (Secure Overview & Enquiries Pipeline)
```

1. **Scene 01 — Arrival (The Infinite Void & Physical Workspace)**:
   - Deep obsidian environment with subtle atmospheric lighting.
   - Minimalist architectural desk bearing a detailed 3D laptop with screen glow.
   - Subtle procedural ambient shimmer.
   - Elegant typographic prompt: *"Enter the next dimension of digital creation."*
   - Interactive hover and focus cues on the laptop.

2. **Scene 02 — The Laptop Portal**:
   - On selection, screen activates with an energy pulse and audio swell.
   - Camera moves smoothly toward the display, framing the glowing vortex.
   - Camera traverses the screen plane, crossing into the dimensional tunnel.

3. **Scene 03 — The High-Speed Tunnel**:
   - Concentric architectural rings, glowing amber/warm-copper guide rails, and longitudinal light streaks.
   - Acceleration phase (speed swell + field of view widening), high-speed warp travel with multi-layer parallax, and controlled deceleration into the destination gateway.
   - Procedural Web Audio engine creates accelerating frequency risers, spatial wind rush, and an arrival chime.
   - Keyboard accessible and reducible via `prefers-reduced-motion` or the direct "Skip Travel" button.

4. **Scene 04 — The Orbital Hub**:
   - Expansive dark architectural rotunda with a central rotating metallic Forkframe "F" nexus structure.
   - Concentric orbital rings supporting curved holographic glass displays representing each department.
   - Interactive raycasting: hovering highlights the glass frame with subtle amber luminescence and reveals contextual metrics.
   - Clicking any terminal triggers a swift spatial approach into that workstation.

5. **Destinations & Functional Environments**:
   - **Social Studio**: Full-featured interactive post & story canvas. Supports background selection, food photography placement, editable typographic badges, color pickers, sticker overlays, and direct JPEG/PNG client-side export.
   - **Food Cost & Menu Pricing Calculator**: Real-time recipe food cost percentage calculator, gross margin forecaster, ingredient breakdown, and recommended retail pricing model with exportable summary.
   - **Interactive Project Estimator**: Scopes website tier, 3D complexity, e-commerce integrations, custom CMS, and menu systems with itemized transparency.
   - **Guided Project Briefing**: Multi-step validated client onboarding enquiry form with database persistence and real status tracking.
   - **Studio Showcase & Case Studies**: High-resolution gallery featuring authentic demonstration work for restaurant groups, fast-casual brands, and artisan culinary companies.
   - **Secure Studio Administration Console**: Password-protected dashboard for reviewing inbound project briefs, calculator runs, and operational logs.

#### B. Visual Identity & Palette Discipline
- **Canvas & Surfaces**: 60% deep obsidian (`#070709`, `#0D0E12`), 30% structural architectural brushed titanium and smoked glass (`#1E2028`, `rgba(255,255,255,0.06)` with hairline borders).
- **Accent Budget**: 10% concentrated warm ember and metallic gold/amber (`#F59E0B`, `#D97706`, `#FBBF24`), directly mirroring the official Forkframe Studio emblem.
- **Typography**:
  - Display / Headings: `Plus Jakarta Sans` and `Outfit` (clean geometric clarity, tight tracking).
  - Body & UI: `Plus Jakarta Sans` (15–16px, balanced line length).
  - Metrics & Data: `JetBrains Mono` with `tabular-nums` for calculators and pricing metrics.
- **Anti-Slop Restraint**: Zero decorative glowing dots, no fake compiler tags or pseudo-code commentary, clean unboxed text metadata with `·` separators, and WCAG AA contrast compliance across all glass panels.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Real-Time Three.js Spatial Engine + Semantic DOM Overlay**
  - *Approach*: The 3D scene (desk, laptop, tunnel, hub nexus, lighting, camera choreography) is rendered through Three.js onto a full-viewport WebGL canvas. All interactive controls, forms, typography, and tool buttons remain semantic DOM elements with `pointer-events-auto` and complete keyboard/ARIA accessibility.
  - *Why*: Ensures 60 FPS spatial graphics without sacrificing form usability, text selection, screen reader comprehension, or mobile touch reliability.
  - *Alternatives Considered*: Pure Canvas UI (horrible accessibility and form handling) vs. CSS 3D transforms (limited lighting, no genuine geometry, fragile cross-browser rendering).

- **Decision 2: Synthesis-Based Procedural Web Audio Engine**
  - *Approach*: Native browser `AudioContext` utilizing band-passed oscillators, gain nodes, and white noise buffers to generate custom cyber sweeps, tunnel velocity wind, button clicks, and arrival chimes.
  - *Why*: Guarantees zero audio asset HTTP requests, immune to audio decoding latency or broken media URLs, fully reactive to camera velocity, and compliant with browser user-gesture autoplay policies.
  - *Alternatives Considered*: External MP3/WAV files (heavy bandwidth, potential network stalls during fast transitions).

- **Decision 3: Production Full-Stack Express API + Persistent Storage**
  - *Approach*: Express server proxy mounted via `tsx` handling `/api/enquiries`, `/api/estimates`, and `/api/admin` with input schema validation, rate-limiting, and resilient local persistence.
  - *Why*: Satisfies production readiness requirements, keeps administrative APIs secured on the server, and ensures zero lost customer enquiries.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATION                            │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │   Three.js Engine     │             │   Spatial State Machine    │  │
│  │  - Void & 3D Laptop   │ <────────── │  - Current Destination     │  │
│  │  - Cylindrical Tunnel │   Camera    │  - Transition Phase:       │  │
│  │  - Orbital Hub Nexus  │   Vector    │    IDLE -> DEPART ->       │  │
│  │  - Raycast Pointer    │             │    TRAVEL -> ARRIVE        │  │
│  └───────────────────────┘             └────────────────────────────┘  │
│              │                                        │                │
│              ▼                                        ▼                │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │  Procedural Audio FX  │             │   Active Workspace Views   │  │
│  │  - Web Audio Context  │             │  - Social Studio Canvas    │  │
│  │  - Tunnel Pitch Riser │             │  - Food Cost Calculator    │  │
│  │  - Portal Swell       │             │  - Project Scoper & Brief  │  │
│  │  - Interactive Chimes │             │  - Admin Secure Dashboard  │  │
│  └───────────────────────┘             └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                         JSON HTTP REST Protocol
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FULL-STACK SERVER & DB                          │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Express API Endpoints (/api/*)                                  │  │
│  │  - POST /api/enquiries (validation, persistence, email payload)  │  │
│  │  - POST /api/estimates/save                                      │  │
│  │  - GET  /api/admin/enquiries (authenticated session token)       │  │
│  │  - POST /api/admin/login                                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│                                   ▼                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Persistent Storage Layer (JSON / SQLite Schema)                 │  │
│  │  - Enquiries Table (id, client, budget, services, status, dates) │  │
│  │  - Social Projects (canvas state, dimensions, export records)   │  │
│  │  - Pricing Config (base rates, food multiplier settings)         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Transition State Machine
The navigation system operates under a strict deterministic lifecycle:
- `IDLE`: Stationed at an active scene or hub with interactive hover active.
- `PREPARING`: Assets and data for the selected destination are primed; audio oscillator prepares frequency envelope.
- `DEPARTING`: Camera initiates forward velocity along curved spline; optical focus deepens.
- `TRAVELLING`: Warp particles, tunnel structural rings, and guide rails race past; Web Audio velocity noise peaks.
- `ARRIVING`: Camera decelerates into the destination anchor; arrival chime triggers.
- `SETTLED`: Destination interactive workspace is revealed with complete accessibility focus.

---

### 5. Phase-by-Phase Delivery Plan

- **Phase 0 (Complete)**: Architecture document, technology stack selection, spatial model definition, and user alignment.
- **Phase 1 (Foundation & Setup)**: Dependencies configuration (Three.js, Lucide, Canvas utilities), HTML metadata & title sync, global CSS design tokens, and procedural Web Audio engine implementation.
- **Phase 2 (The Signature Spatial Journey)**: Construction of Scene 01 (Minimalist Desk & Interactive 3D Laptop), Scene 02 (Screen Portal Transformation), Scene 03 (High-Speed 3D Tunnel with rings, light guide rails, warp streaks, and synchronized sound), and arrival at the Orbital Hub.
- **Phase 3 (Orbital Hub & Spatial Navigation)**: Central rotating Forkframe 3D geometric nexus, curved glass holographic interactive station pods, raycast pointer interactions, HUD navigation bar with direct jumping, and location breadcrumbs.
- **Phase 4 (Food Business Tools & Destination Environments)**:
  - *Social Studio*: Interactive graphics studio for restaurant announcements, specials, and menu drops with instant JPEG/PNG export.
  - *Food Cost & Menu Pricing Calculator*: Formulaic food cost percentage, portion pricing, target gross margin, and printable summary.
  - *Creative Services & Portfolio Showcase*: High-impact showcase of websites, ordering systems, and branding.
  - *Interactive Scoper & Project Briefing*: Real-time estimate builder and multi-step inquiry form with client-side validation.
- **Phase 5 (Full-Stack Backend, Persistence & Security)**: Express backend with persistent JSON/SQLite storage for enquiries and saved designs, session validation, and admin dashboard.
- **Phase 6 (Performance, Accessibility & Verification)**: Viewport testing across mobile, tablet, and desktop; reduced-motion fallback; WebGL context loss recovery; keyboard navigation audit; and final compilation.
