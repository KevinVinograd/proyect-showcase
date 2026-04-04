# One-Pager Redesign — Design Specification

**Date:** 2026-04-04
**Status:** Approved — ready for implementation

---

## 1. Context

The current site is a generic portfolio (Hero / Stats / Projects / TechStack / Contact) built as a single 847-line App.tsx with inline styles + Tailwind. It doesn't communicate the partnership's positioning clearly.

This spec defines a full replacement — not a migration — of the current one-pager with a narrative-driven structure, clean architecture, and a production-ready design system.

## 2. Positioning

The partnership (Ian, Kevin, Juan Cruz) builds custom software to automate repetitive tasks, improve consistency, and turn operational problems into scalable systems. The site must communicate:

- The kind of operational problems we solve
- What we build
- How we work
- Proof through selected projects
- Why this combination of profiles works
- How to get in touch

This is not an artistic portfolio. It is a high-clarity, high-trust, system-focused site.

## 3. Language

- Spanish only (Argentine market)
- Direct, natural tone — no corporate language
- No buzzwords, no vague phrases
- Each section understandable in 5-10 seconds
- No i18n implementation for now

## 4. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 19 + Vite + TypeScript | Existing, keep |
| Styling | Tailwind CSS 4 | Existing, keep |
| Components | shadcn/ui | New — base foundation |
| Animation | framer-motion | Existing — scroll reveals only |
| Icons | lucide-react | Existing, keep |
| Headings font | Futura Now Text | New — local or fallback |
| Body font | RM Neue | New — local or fallback |

### What to remove

- Current i18n system (LangContext, useLang, useT, translations object)
- All inline styles
- Stats section
- Current App.tsx monolith

## 5. Architecture

```
src/
├── app.tsx                    # Section composition
├── main.tsx                   # Entry point
├── index.css                  # Tailwind + shadcn theme tokens
├── components/
│   ├── ui/                    # shadcn primitives (button, card, badge)
│   └── sections/
│       ├── hero.tsx
│       ├── problem.tsx
│       ├── what-we-build.tsx
│       ├── process.tsx
│       ├── portfolio.tsx
│       ├── technologies.tsx
│       ├── team.tsx
│       └── contact.tsx
└── lib/
    └── utils.ts               # cn() helper
```

### shadcn primitives to install

- `button` — CTAs in hero and contact
- `card` — portfolio items, what-we-build blocks
- `badge` — tech tags

Only these three. No other components.

## 6. Design Tokens

### 6.1 Colors

| Token | Value | Role |
|---|---|---|
| `--background` | #080c16 | Page background |
| `--surface-1` | rgba(255,255,255, 0.015) | Cards, badges |
| `--surface-2` | rgba(255,255,255, 0.035) | Focal card only |
| `--foreground-primary` | #ffffff | Headlines, names |
| `--foreground-strong` | #f1f5f9 | Closing lines, results, card titles |
| `--foreground-body` | #8893a8 | Body text, bullets, descriptions |
| `--foreground-dim` | #475569 | Labels, step numbers, roles, captions |
| `--border` | rgba(255,255,255, 0.06) | Default borders |
| `--border-hover` | rgba(255,255,255, 0.12) | Hover states |
| `--border-subtle` | rgba(255,255,255, 0.04) | Section dividers |
| `--accent` | #ffffff | Primary CTA background |
| `--accent-foreground` | #080c16 | Primary CTA text |

No gradients. No shadows. No additional accent colors.

### 6.2 Typography

**Dual-font system:**

| Token | Stack | Role |
|---|---|---|
| `--font-heading` | "Futura Now Text", "Avenir Next", "Helvetica Neue", Arial, sans-serif | All headings and titles |
| `--font-body` | "RM Neue", "Inter", "Helvetica Neue", Arial, sans-serif | All body text, labels, buttons, badges |

**Font loading:** If `.woff2` files for Futura Now Text and RM Neue are added to `public/fonts/`, load via `@font-face` with `font-display: swap`. Otherwise, fallback stacks render cleanly without the custom fonts.

**Required weights if local files available:**
- Futura Now Text: 600, 700, 800
- RM Neue: 400, 500, 600, 700

**Type scale:**

| Level | Token | Size | Weight | Line-height | Spacing | Color | Font |
|---|---|---|---|---|---|---|---|
| Hero headline | `--text-hero` | 52px | 800 | 1.1 | -0.01em | foreground-primary | heading |
| Section title | `--text-section` | 30px | 700 | 1.2 | 0 | foreground-primary | heading |
| Contact title | `--text-contact` | 34px | 700 | 1.2 | 0 | foreground-primary | heading |
| Portfolio title | `--text-portfolio-title` | 22px | 700 | 1.2 | 0 | foreground-primary | heading |
| Step title | `--text-step-title` | 18px | 700 | 1.25 | 0 | foreground-primary | heading |
| Card title | `--text-card-title` | 17px | 700 | 1.25 | 0 | foreground-strong | heading |
| Team name | (uses text-subheadline) | 19px | 700 | 1.2 | 0 | foreground-primary | heading |
| Closing line | (uses text-portfolio-title) | 22px | 700 | 1.35 | 0 | foreground-strong | heading |
| Subheadline | `--text-subheadline` | 19px | 400 | 1.7 | normal | foreground-body | body |
| Body | `--text-body` | 15px | 400 | 1.7 | normal | foreground-body | body |
| Secondary | `--text-secondary` | 14px | 400 | 1.7 | normal | foreground-body | body |
| Badge | `--text-badge` | 13px | 500 | normal | normal | foreground-dim | body |
| Caption | `--text-caption` | 12px | 600 | 1.0 | 0.06em | foreground-dim | body |
| Label | `--text-label` | 10px | 700 | 1.0 | 0.10em | foreground-dim | body |

**Tracking:** Headings use 0 letter-spacing (Futura is geometrically even, doesn't need negative tracking). Hero uses -0.01em only because of its large size.

Body line-height is **1.7 across all body variants** — no exceptions.

### 6.3 Spacing

| Token | Value | Usage |
|---|---|---|
| `--sp-1` | 4px | name→role gap |
| `--sp-2` | 8px | badge gaps, bullet gaps, title→body |
| `--sp-3` | 12px | label→content, role→description, bullet padding-y |
| `--sp-4` | 16px | button gap |
| `--sp-5` | 20px | card grid gap, badge group margin, subheadline max-width offset |
| `--sp-6` | 24px | container padding-x, portfolio card gap |
| `--sp-8` | 32px | card padding-x, closing-line padding, portfolio internal gap |
| `--sp-9` | 36px | step padding-y |
| `--sp-10` | 40px | CTA margin-top, team grid gap |
| `--sp-11` | 44px | portfolio card padding-x |
| `--sp-12` | 48px | title→content, card padding-y |
| `--sp-20` | 80px | tech section padding-y, mobile section padding-y, mobile hero padding-bottom |
| `--sp-25` | 100px | mobile contact padding-top |
| `--sp-30` | 120px | section padding-y, mobile hero padding-top |
| `--sp-35` | 140px | contact padding-top, hero padding-bottom |
| `--sp-45` | 180px | hero padding-top |

No other spacing values allowed. Every layout value MUST reference a token. If a new value is needed, add it here first.

### 6.4 Radius

| Token | Value | Component |
|---|---|---|
| `--radius-sm` | 4px | Badges |
| `--radius-md` | 6px | Buttons |
| `--radius-lg` | 8px | Cards |
| `--radius-xl` | 10px | Portfolio cards |

### 6.5 Layout Dimensions

| Token | Value | Usage |
|---|---|---|
| `--container-content` | 820px | Main content container max-width |
| `--container-hero` | 940px | Hero section container max-width |
| `--container-subheadline` | 560px | Hero subheadline max-width |
| `--container-contact-title` | 620px | Contact heading max-width |
| `--container-contact-sub` | 480px | Contact subtext max-width |
| `--grid-step` | 56px | Process step number column width |
| `--grid-portfolio` | 1fr 1fr 1.3fr | Portfolio internal column template (apply via CSS utility class, not inline) |
| `--badge-px` | 14px | Badge horizontal padding |
| `--badge-py` | 5px | Badge vertical padding |
| `--reveal-margin` | -100px | Scroll reveal viewport offset |

### 6.6 Component Sizes

| Token | Value | Usage |
|---|---|---|
| `--step-number-size` | 44px | Step number circle width/height (same as sp-11) |

## 7. Layout

| Rule | Token | Value |
|---|---|---|
| Content max-width | container-content | 820px |
| Hero max-width | container-hero | 940px |
| Container padding-x | sp-6 | 24px |
| Section padding-y | sp-30 | 120px |
| Tech section padding-y | sp-20 | 80px |
| Hero padding-top | sp-45 | 180px |
| Hero padding-bottom | sp-35 | 140px |
| Contact padding-top | sp-35 | 140px |
| Contact padding-bottom | sp-30 | 120px |
| All sections | — | Left-aligned except Contact (centered) |

### Responsive (mobile ≤768px)

- Hero headline: text-contact (34px)
- Section titles: text-portfolio-title (22px)
- All grids collapse to single column
- Hero padding-top: sp-30 (120px)
- Hero padding-bottom: sp-20 (80px)
- Section padding: sp-20 (80px)
- Contact padding-top: sp-25 (100px)
- CTAs stack vertically, full width
- Portfolio card padding: sp-6
- Team grid gap: sp-6

## 8. Components

### 8.1 Button

| Variant | Padding | Background | Color | Border | Radius |
|---|---|---|---|---|---|
| Primary | sp-4 × sp-8 | accent | accent-foreground | none | radius-md |
| Secondary | sp-4 × sp-8 | transparent | foreground-dim | 1px border | radius-md |

**Hover:** Primary → opacity 0.88. Secondary → border-hover + color foreground-body.
**Active:** scale(0.98) — buttons only.
**Transition:** 0.15s ease.

Contact primary CTA override: padding sp-4 × sp-12, same font-size.

### 8.2 Card (What We Build)

| Property | Default | Focal |
|---|---|---|
| Padding | sp-8 × sp-6 | sp-8 × sp-6 |
| Background | surface-1 | surface-2 |
| Border | 1px border | 1px border-hover |
| Radius | radius-lg | radius-lg |
| Title color | foreground-strong | foreground-primary |

**Hover:** border → border-hover. **Transition:** 0.2s ease.

### 8.3 Portfolio Card

| Property | Value |
|---|---|
| Padding | sp-12 × sp-11 |
| Background | surface-1 |
| Border | 1px border |
| Radius | radius-xl |
| Gap between cards | sp-6 (margin-bottom) |
| Internal grid | 1fr 1fr 1.3fr, gap sp-8 |

Result column uses foreground-strong at text-body/600. Problem/Solution use foreground-body at text-secondary/400. Result label uses foreground-body (brighter than other labels).

**Hover:** border → border-hover. **Transition:** 0.2s ease.

### 8.4 Badge

| Property | Value |
|---|---|
| Padding | badge-py × badge-px |
| Background | surface-1 |
| Border | 1px border |
| Radius | radius-sm |
| Color | foreground-dim |

**Hover:** border → border-hover. **Transition:** 0.15s ease.

### 8.5 Step Item

| Property | Value |
|---|---|
| Grid | 56px number column + 1fr content |
| Number | 44px circle, 2px border-hover, foreground-dim |
| Padding | sp-9 vertical per step |
| Divider | 1px border-subtle between steps |
| Title | text-step-title, weight 700, foreground-primary |
| Body | text-body, foreground-body |

No hover state. No interaction.

## 9. Interaction States

- **Buttons:** hover (opacity/border), active (scale 0.98)
- **Cards:** hover (border brightens)
- **Badges:** hover (border brightens)
- **Everything else:** no interaction

Transitions: 0.15s ease (buttons, badges), 0.2s ease (cards).

## 10. Motion

- **Scroll reveal only:** opacity 0→1 + translateY 20px→0, duration 0.5s
- Applied per section, not per element
- Implemented via framer-motion
- No parallax, no page transitions, no custom cursor, no delay on reading

## 11. Narrative — Complete Copy

### 11.1 Hero

**Headline:** "Si tu operación funciona porque alguien se acuerda de hacer las cosas, es cuestión de tiempo"

**Subheadline:** "Construimos software a medida para que tu equipo deje de ser el sistema."

**CTA primary:** "Hablemos" → scroll to contact
**CTA secondary:** "Ver proyectos" → scroll to portfolio

### 11.2 Problem

**Title:** "Esto pasa todos los días en equipos que operan sin sistema"

**Bullets:**
- "Alguien actualiza una planilla a mano y el resto trabaja con datos de ayer."
- "La misma información se carga tres veces en tres lugares distintos."
- "Un error en un paso manual se detecta recién cuando el cliente reclama."
- "El que sabe cómo funciona todo se fue de vacaciones y nadie puede cubrir."

**Closing:** "El problema no es tu equipo. Es que el proceso depende de personas haciendo trabajo de máquina."

### 11.3 What We Build

**Title:** "Lo que cambia cuando dejás de operar a mano"

**Block 1 — "Lo que se repite, se ejecuta solo"**
"Si tu equipo carga datos, cruza información o arma reportes todos los días, eso deja de existir como tarea. Se convierte en algo que pasa."

**Block 2 — "Lo que está disperso, aparece en un lugar" (focal)**
"Nada más de buscar en una planilla, preguntar por WhatsApp y esperar que alguien conteste. El estado real de la operación está visible para todos, siempre."

**Block 3 — "Lo que ya funciona, no se toca"**
"No reemplazamos todo. Si hay herramientas que sirven, las conectamos. Construimos lo que falta, no lo que queda bien en un pitch."

### 11.4 Process

**Title:** "Cómo trabajamos"

**Step 1 — "Primero entendemos cómo trabajan hoy"**
"Nos sentamos con el equipo que opera, no con un brief. Si no vemos dónde está la fricción real, lo que construyamos no va a resolver nada."

**Step 2 — "Separamos lo que necesita software de lo que no"**
"No todo se resuelve con código. A veces el problema es un proceso mal definido. Distinguir eso al principio ahorra meses de desarrollo al pedo."

**Step 3 — "Construimos en partes que se pueden usar"**
"Cada entrega funciona. Si a las dos semanas lo primero que entregamos no sirve, lo sabemos antes de construir todo lo demás."

**Step 4 — "Ajustamos con uso real"**
"Cuando el equipo usa el sistema aparecen cosas que nadie anticipó. Iteramos con lo que pasa, no con lo que se supone que iba a pasar."

### 11.5 Portfolio

**Title:** "Proyectos"

**KDT Go — Gestión de envíos**
- Problema: "Los repartidores se coordinaban por WhatsApp. No había forma de saber quién llevaba qué, ni en qué estado estaba cada entrega."
- Solución: "Plataforma con tracking en tiempo real, asignación automática y visibilidad completa para operaciones."
- Resultado: "+200K envíos gestionados. Operaciones dejó de llamar repartidores uno por uno para saber dónde estaba cada paquete."

**Vendiar — Punto de venta e inventario**
- Problema: "El stock se controlaba en una planilla que nadie actualizaba igual. Las decisiones de compra se tomaban a ojo."
- Solución: "POS con inventario integrado, movimientos automáticos de stock y reportes que se generan solos."
- Resultado: "El dueño abre una pantalla y sabe qué tiene, qué vendió y qué tiene que reponer. Sin llamar a nadie, sin abrir una planilla."

**FitBdy — Seguimiento fitness con IA**
- Problema: "Planes de entrenamiento que se arman una vez y no cambian. El entrenador no tiene forma de seguir a todos."
- Solución: "Sistema que ajusta las rutinas según el progreso real de cada usuario."
- Resultado: "Cada usuario entrena con un plan que se adapta solo. El entrenador interviene cuando tiene sentido, no por obligación."

### 11.6 Technologies

**Title:** "Stack técnico"

**Supporting line:** "La tecnología es una herramienta, no un argumento de venta. Elegimos la que resuelve el problema, no la que está de moda."

**Categories:**
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Python, PostgreSQL, Redis
- Infraestructura: AWS, Docker, CI/CD

### 11.7 Team

**Title:** "Quiénes somos"

**Sub:** "Tres perfiles que cubren diseño, desarrollo y operación. Sin intermediarios."

- **Ian** — Diseño de sistemas y experiencia — "Entiende el problema, define la solución y estructura cómo se usa."
- **Kevin** — Desarrollo y arquitectura — "Construye el sistema. Backend, lógica, escalabilidad."
- **Juan Cruz** — Operación y negocio — "Trae el contexto real. Asegura que lo que se construye funcione en la práctica."

**Closing:** "Cada decisión pasa por los tres. No hay handoffs, no hay teléfono descompuesto."

### 11.8 Contact

**Title:** "Si todos los días repetís algo que debería estar automatizado, escribinos."

**Sub:** "La primera conversación es para entender el problema. Sin compromiso, sin presentación de 40 slides."

**CTA:** "Escribinos" (mailto)
**Secondary:** LinkedIn

### 11.9 Footer

Copyright + year. Minimal.

## 12. Font Loading

**Strategy:** Fallback-first. The site renders correctly using only the fallback font stacks. Custom fonts are an enhancement, not a requirement.

**If custom font files are available:**
1. Place `.woff2` files in `public/fonts/`
2. Add `@font-face` declarations in `index.css` with `font-display: swap`
3. Load only the required weights (Futura Now Text: 600/700/800, RM Neue: 400/500/600/700)

**If custom font files are NOT available:**
- Fallback stacks are used in production — this is a valid production state, not a broken one
- Heading fallback: Avenir Next → Helvetica Neue → Arial
- Body fallback: Inter → Helvetica Neue → Arial

## 13. Build Order

1. Install shadcn/ui, configure theme tokens in index.css, set up dual-font system (Futura Now Text + RM Neue with fallback stacks)
2. Create file structure (sections/, ui/, lib/)
3. Install shadcn primitives: button, card, badge
4. Build sections in narrative order:
   - Hero
   - Problem
   - What We Build
   - Process
   - Portfolio
   - Technologies
   - Team
   - Contact
5. Compose sections in app.tsx
6. Add scroll reveal wrapper (framer-motion)
7. Remove old App.tsx content and i18n system
8. Verify responsive behavior
9. Final cleanup

## 14. Constraints

### Implementation rules (MANDATORY)

- No arbitrary spacing values — every gap, padding, and margin MUST use a `--sp-*` token
- No hardcoded font sizes — every font-size MUST use a `--text-*` token
- No new colors outside the token system — every color MUST use a `--foreground-*`, `--surface-*`, `--border-*`, or `--accent-*` token
- No inline styles unless the value comes from a token
- No visual overrides at component level — if a component needs a different value, update the token or create a variant in the spec first
- No shadows
- No gradients
- No new motion patterns

### Scope rules

- No overengineering — only build what the one-pager needs
- No component library beyond the 3 shadcn primitives
- Primitives are created only when a section needs them
- The narrative drives the build, not the theme system

### If a value is missing

Do NOT hardcode it. Add it to the token system first:
1. Define the token with a name that describes its scale position (e.g., `--sp-7: 28px`)
2. Document its usage
3. Then use it
