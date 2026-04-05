# SEO & Performance Baseline Audit

**Date:** 2026-04-05  
**Branch:** `audit/seo-performance-baseline`  
**Scope:** Full site — read-only analysis, zero modifications

---

## 1. Page Inventory

This is a **single-page application (SPA)** built with React 19 + Vite 8. There is only one route (`/`). All "pages" are scroll-anchored sections within a single HTML document.

| Section | Component | Section ID | Template/Layout | Dynamic Rendering |
|---|---|---|---|---|
| Hero | `hero.tsx` | `#hero` | Sticky + scroll-driven animation (350vh) | Framer Motion + scroll transforms |
| Problem | `problem.tsx` | `#problems` | Sticky post-it stack (350vh) | Framer Motion + scroll + spring physics |
| What We Build | `what-we-build.tsx` | `#impacto` | 2-col grid within container | Framer Motion reveal |
| Zigzag Divider | `zigzag-divider.tsx` | — | Decorative SVG | Framer Motion path draw |
| Process | `process.tsx` | `#proceso` | Horizontal scroll carousel (300vh) | Framer Motion + scroll transforms |
| Handwritten Arrow | `handwritten-arrow.tsx` | — | Decorative SVG | Framer Motion path draw |
| Portfolio | `portfolio.tsx` | `#portfolio` | Stacked cards in container | Framer Motion reveal |
| Technologies | `technologies.tsx` | — | Marquee ticker | CSS infinite animation |
| Team | `team.tsx` | `#equipo` | 3-col grid, sticky (200vh) | Framer Motion + scroll transforms |
| Contact | `contact.tsx` | `#contacto` | White bg, centered CTA | Framer Motion reveal |
| Footer | `footer.tsx` | — | **Not rendered** (imported but not used in App.tsx) |
| Navbar | `navbar.tsx` | — | Fixed floating pill | Scroll spy (vanilla JS) |
| Shader Background | `shader-background.tsx` | — | Fixed fullscreen WebGL canvas | Three.js + @shadergradient/react, 30fps tick |

**Key observation:** The Footer component exists but is **never mounted** in `App.tsx`.

---

## 2. Top 10 Critical Issues (P0/P1)

| # | Issue | Why It Matters | Impact |
|---|---|---|---|
| 1 | **No meta description** | Google shows auto-generated snippet; CTR drops ~30% without a crafted description | P0 — SEO |
| 2 | **No robots.txt** | Search engines have no crawl directives; no sitemap reference | P0 — Indexability |
| 3 | **No sitemap.xml** | No explicit page inventory for crawlers | P0 — Indexability |
| 4 | **No canonical tag** | Duplicate-content risk if deployed on multiple URLs (www vs non-www, trailing slash) | P0 — SEO |
| 5 | **Single JS bundle = 1,518 KB (405 KB gzipped)** | Vite itself warns about this. Three.js alone is ~38 MB source. Blocks interactivity on slow connections | P0 — Performance |
| 6 | **No Open Graph / Twitter Card tags** | Social shares show generic browser-generated previews | P1 — Social/SEO |
| 7 | **Team images unoptimized (KV.png 547 KB, JC.png 462 KB)** | These are above-the-fold for the Team section; loaded eagerly as PNGs with no srcset | P1 — Performance |
| 8 | **SPA with no SSR/SSG = empty HTML for crawlers** | Google renders JS but other crawlers (Bing, social bots) get an empty `<div id="root">` | P1 — Indexability |
| 9 | **Google Fonts loaded render-blocking** | Two font families (4 weights total) loaded via `<link>` block first paint | P1 — Performance (LCP) |
| 10 | **WebGL shader canvas runs continuously on all viewports** | Full-screen Three.js scene at 30fps burns battery and CPU even on low-end mobile | P1 — Performance (INP/battery) |

---

## 3. Technical SEO Findings

### 3.1 Structure

| Check | Status | Detail |
|---|---|---|
| Single `<h1>` | **Yes** | `hero.tsx:128` — content: "Si es repetitivo, no deberías hacerlo." |
| Heading hierarchy | **Partial** | H1 → H2 is correct across sections. However, H3 is used only inside Portfolio cards (`portfolio.tsx:83`) for project names, which is valid. No H4/H5 used as heading elements (they are `<p>` with heading-like classes). |
| Semantic HTML | **Poor** | All sections use `<section>` (good), but: no `<main>` wrapper, no `<header>`, no `<footer>` rendered, no `<article>` for portfolio cases. The navbar is `<nav>` (good). |
| `lang` attribute | **Yes** | `lang="es"` in `index.html:2` — correct for Spanish content |

### 3.2 Metadata

| Check | Status | Detail |
|---|---|---|
| `<title>` | **Exists** | "Software a medida para operaciones" — 38 chars (good length) |
| `<meta description>` | **MISSING** | No description tag at all |
| `<meta charset>` | **Yes** | UTF-8 |
| `<meta viewport>` | **Yes** | Standard responsive viewport |
| Canonical | **MISSING** | No `<link rel="canonical">` |
| `<meta robots>` | **MISSING** | No robots meta tag (defaults to index/follow, but explicit is better) |

### 3.3 Indexability

| Check | Status | Detail |
|---|---|---|
| `robots.txt` | **MISSING** | File does not exist |
| `sitemap.xml` | **MISSING** | File does not exist |
| Client-side rendering | **Problem** | SPA with no pre-rendering. HTML body is `<div id="root"></div>`. All content is JS-rendered. |
| Internal links | **None** | Navigation uses `scrollTo()` with Lenis, not `<a href>` anchor links. No crawlable link structure. |
| Button links | **Problematic** | "Ver caso" buttons in Portfolio are `<Button>` with no `href` — dead-end for crawlers |
| Contact links | **OK** | `mailto:` and LinkedIn are real `<a>` tags via `asChild` |

### 3.4 Social

| Check | Status |
|---|---|
| Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) | **ALL MISSING** |
| Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) | **ALL MISSING** |

### 3.5 Assets

| Check | Status | Detail |
|---|---|---|
| Images missing `alt` text | **Partial** | Team images have `alt={member.name}` (e.g., "Ian", "Kevin") — too short, should describe the person's role. No other raster images on the page. |
| Duplicate alt text patterns | **No** | Each team member has a unique (though terse) alt |
| SVG accessibility | **Missing** | Technology logos (10 inline SVGs) have no `aria-label` or `<title>` elements. Decorative SVGs (zigzag, arrow, circle highlight) correctly have no alt, but also lack `aria-hidden="true"` |
| Favicon | **Exists** | `favicon.svg` (286 bytes) — lightweight, good |

---

## 4. Performance Findings

### 4.1 JS / Bundle

| Metric | Value |
|---|---|
| Total JS output | **1,518 KB** (405 KB gzipped) — single chunk |
| CSS output | 34.7 KB (7.2 KB gzipped) |
| Vite warning | Yes — chunk exceeds 500 KB limit |

**Heavy dependencies (source size on disk):**

| Package | Disk Size | Purpose | Notes |
|---|---|---|---|
| `three` | 38 MB | WebGL 3D engine | Used only for shader background via @shadergradient |
| `framer-motion` | 5.4 MB | Animation library | Used in every section |
| `@react-three/fiber` | 2.2 MB | React Three.js bindings | Transitive dependency of shader |
| `@shadergradient/react` | 636 KB | Shader gradient preset | Pulls in Three.js + R3F |
| `lenis` | 482 KB | Smooth scroll | Lightweight |
| `camera-controls` | — | Camera utility for Three.js | Likely bundled but unused directly |
| `three-stdlib` | — | Three.js utilities | Listed as dependency |

**Key insight:** The shader background (`ShaderBackground`) alone accounts for the majority of the bundle (Three.js + R3F + ShaderGradient). The entire component could be code-split with `React.lazy()`.

### 4.2 Rendering

| Component | Concern | Impact |
|---|---|---|
| **ShaderBackground** | Full-screen WebGL canvas running at 30fps, interpolating shader props on every scroll event. Never pauses when off-screen (it's always "on-screen" since it's `position: fixed`). | **HIGH** — constant GPU/CPU draw |
| **Hero** (350vh) | Scroll-driven letter-by-letter animation with per-character `<motion.span>` — creates ~40 animated DOM nodes | Medium — only active while scrolling hero section |
| **Problem** (350vh) | 4 post-it cards with spring physics, each tracking scroll position | Medium |
| **Process** (300vh) | Horizontal scroll with 4 cards, scroll-driven transforms | Medium |
| **Team** (200vh) | Staggered parallax card exit on scroll | Low |
| **Technologies** | CSS marquee animation running infinitely (60s loop) | Low — CSS-only, GPU-composited |
| **Lenis smooth scroll** | Runs its own `requestAnimationFrame` loop indefinitely (`raf` in `App.tsx:35-38`) | Low-medium — never stops |

**Total scroll height:** Hero (350vh) + Problem (350vh) + content sections + Process (300vh) + Team (200vh) = **~1,200vh+ of document height**. This is extreme vertical scrolling.

### 4.3 Media

| Asset | Size | Format | Optimization |
|---|---|---|---|
| `Ian.png` | 111 KB | PNG | Could be WebP/AVIF (~50-70% smaller) |
| `JC.png` | 462 KB | PNG | **Unoptimized** — should be WebP/AVIF, likely needs resize |
| `KV.png` | 547 KB | PNG | **Unoptimized** — should be WebP/AVIF, likely needs resize |
| `favicon.svg` | 286 bytes | SVG | Fine |

**Total image payload:** ~1.1 MB (uncompressed PNGs)

| Check | Status |
|---|---|
| Lazy loading (`loading="lazy"`) | **NOT USED** — all 3 team images load eagerly |
| `srcset` / responsive images | **NOT USED** |
| Image dimensions (`width`/`height` attributes) | **NOT SET** — CLS risk |
| Video/autoplay | None present |

### 4.4 Fonts

| Font | Weights | Source |
|---|---|---|
| Plus Jakarta Sans | 500, 600, 700, 800 | Google Fonts |
| Unbounded | 700, 900 | Google Fonts |

**Total:** 2 families, 6 weight variants

| Check | Status |
|---|---|
| `font-display: swap` | **Yes** — via `&display=swap` in the Google Fonts URL |
| `preconnect` | **Yes** — both `fonts.googleapis.com` and `fonts.gstatic.com` |
| Subsetting | **No** — full Latin character sets loaded |
| Self-hosting | **No** — external Google Fonts dependency |

**Note:** CSS declares `--font-body: "Inter"` but Inter is **not loaded** in `index.html`. The body will fall back to system `sans-serif`. This is either intentional (relying on system font) or a bug (forgotten font load).

### 4.5 Third-Party / Network

| Check | Status |
|---|---|
| Third-party scripts | **Google Fonts only** — no analytics, no tracking, no chat widgets |
| Preconnect | Fonts covered; no other origins to preconnect to |
| Preload opportunities | Font files could be preloaded for critical text (hero H1). The shader bundle could benefit from `modulepreload`. |
| HTTP caching | Cannot verify without deployment — depends on hosting configuration |

---

## 5. Core Web Vitals Risk Summary

### LCP Risk: **HIGH**

- **LCP candidate:** Hero H1 text ("Si es repetitivo, no deberías hacerlo.")
- The text renders only after: (1) JS bundle parses (1.5 MB), (2) React hydrates, (3) Fonts load from Google Fonts, (4) Framer Motion initializes scroll tracking
- On slow 3G: estimated 8-12s before first meaningful text appears
- No SSR/SSG means zero server-rendered content

### CLS Risk: **MEDIUM**

- Team images (`<img>`) have no explicit `width`/`height` → layout shift when images load
- Font swap (Plus Jakarta Sans replacing system font) will cause text reflow
- Framer Motion `initial={{ opacity: 0, y: 20 }}` patterns cause elements to start invisible and shift into place — not a CLS issue since they animate in, but layout around them may shift
- Contact section has `bg-white` which is a hard visual transition — not a CLS issue per se

### INP Risk: **MEDIUM-HIGH**

- ShaderBackground processes scroll events continuously (scroll → compute section progress → update target → rAF loop → blend presets → setState)
- Lenis smooth scroll adds its own rAF overhead
- Hero section has 40+ individually animated `<motion.span>` elements responding to scroll
- Problem section has 4 spring-physics post-its tracking scroll
- No `will-change` hints on heavily animated elements
- `useReducedMotion` is only used in Problem section — all other sections animate unconditionally

---

## 6. SEO Intent & Content Alignment

| Section | Inferred Intent | Clarity | Mismatch |
|---|---|---|---|
| **Title tag** | Rank for "software a medida" + "operaciones" | **Clear** | None — direct and specific |
| **Hero** | Hook: "if it's repetitive, you shouldn't be doing it" | **Clear** | Subtitle ("errores, retrabajo, dependencia humana") reinforces well |
| **Problem** | Pain point validation — operations teams with manual processes | **Clear** | Good specificity with concrete scenarios |
| **What We Build** | Value proposition — automation, visibility, integration | **Clear** | Aligns with problem section |
| **Process** | Build trust — show methodology | **Clear** | Standard but solid |
| **Portfolio** | Social proof — KDT Go, Vendiar, FitBdy | **Mixed** | FitBdy (fitness AI) feels off-brand vs. the "operations automation" positioning. Dilutes the "software for ops" intent. |
| **Technologies** | Showcase tech stack | **Unclear** | Marquee logos (React, Next, TS, etc.) don't communicate value to the target audience (ops leaders, not developers). Intent mismatch with the rest of the page. |
| **Team** | Human trust — three-person team | **Clear** | Roles align well with "we understand ops + we build" |
| **Contact** | Conversion — get in touch | **Clear** | CTA is direct, low-friction messaging. Uses placeholder `contacto@example.com` — **not a real email address**. |

**Overall page intent:** Custom software for operations teams that rely on manual processes.  
**Primary keyword family:** "software a medida", "automatización de procesos", "software operaciones"  
**Missing:** No structured data (JSON-LD), no breadcrumbs, no FAQ schema.

---

## 7. Prioritized Roadmap

| # | Issue | Severity | Effort | Recommended Action |
|---|---|---|---|---|
| 1 | Missing meta description | P0 | Low | Add `<meta name="description">` to `index.html` with a 150-160 char description |
| 2 | Missing robots.txt | P0 | Low | Create `public/robots.txt` with `Allow: /` and sitemap reference |
| 3 | Missing sitemap.xml | P0 | Low | Create `public/sitemap.xml` with the single page URL |
| 4 | Missing canonical tag | P0 | Low | Add `<link rel="canonical" href="https://...">` to `index.html` |
| 5 | Missing OG/Twitter tags | P1 | Low | Add all standard social meta tags to `index.html` |
| 6 | JS bundle not code-split (1,518 KB) | P0 | Medium | Lazy-load `ShaderBackground` with `React.lazy()`. Evaluate splitting framer-motion. |
| 7 | No SSR/pre-rendering | P1 | High | Either add a pre-rendering plugin (e.g., `vite-plugin-ssr`, `prerender`) or migrate to Next.js/Astro for static generation of the single page |
| 8 | Team images unoptimized (1 MB total) | P1 | Low | Convert to WebP/AVIF, resize to max display size, add `loading="lazy"`, set explicit `width`/`height` |
| 9 | Google Fonts render-blocking | P1 | Low | Add `<link rel="preload">` for critical font files, or self-host fonts with `font-display: optional` |
| 10 | Inter font declared but never loaded | P1 | Low | Either load Inter or change `--font-body` to match what's actually loaded (Plus Jakarta Sans or system) |
| 11 | No `<main>` semantic wrapper | P2 | Low | Wrap content sections in `<main>` in `App.tsx` |
| 12 | Navbar uses JS scroll, not `<a href>` | P1 | Low | Change nav buttons to `<a href="#section">` with Lenis-intercepted click — gives crawlers real links |
| 13 | Footer component not rendered | P2 | Low | Either mount `Footer` in `App.tsx` or delete the unused component |
| 14 | ShaderBackground never pauses | P1 | Medium | Implement Intersection Observer or Page Visibility API to pause the rAF loop when tab is hidden or shader is fully occluded (Contact section) |
| 15 | No `width`/`height` on images (CLS) | P1 | Low | Add intrinsic dimensions to team `<img>` elements |
| 16 | Technology section SVGs lack accessibility | P3 | Low | Add `aria-hidden="true"` to decorative tech logos section |
| 17 | Placeholder email `contacto@example.com` | P0 | Low | Replace with real email address |
| 18 | Portfolio "Ver caso" buttons are dead-ends | P2 | Low | Either link to real case study pages or remove the buttons |
| 19 | `useReducedMotion` only used in Problem section | P2 | Medium | Respect `prefers-reduced-motion` across all animated sections |
| 20 | No structured data (JSON-LD) | P2 | Medium | Add Organization and LocalBusiness schema |
| 21 | Font subsetting not applied | P3 | Medium | Self-host fonts with Latin subset only, removing unused glyphs |
| 22 | `camera-controls` + `three-stdlib` possibly unused | P2 | Low | Audit if these are actually imported; remove if not |

---

## Validation

- [x] No files modified
- [x] No UI changes
- [x] No refactors performed
- [x] No branch merge attempted
- [x] Report is complete and actionable
