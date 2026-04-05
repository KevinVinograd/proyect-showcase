# Decorative Motion Consistency Audit

Branch: `audit/decorative-motion-consistency`
Date: 2026-04-05

---

## 1. Files / Decorative Instances Audited

| File | Decorative element | Type |
|---|---|---|
| `src/components/ui/zigzag-divider.tsx` | Zigzag line between sections | Divider |
| `src/components/ui/handwritten-arrow.tsx` | Downward arrow between Process → Portfolio | Arrow |
| `src/components/sections/problem.tsx` | Hand-drawn circle around closing text | Circle / emphasis |
| `src/components/sections/contact.tsx` | Stroke-outlined letter fill reveal | Text stroke reveal |
| `src/components/sections/technologies.tsx` | Logo marquee ticker | Ambient loop |
| `src/index.css` | `animate-marquee` keyframe | CSS ambient loop |
| `src/index.css` | `animate-spin-slow` / `animate-spin-slow-reverse` keyframes | CSS ambient rotation (orphaned) |
| `src/components/shell/shader-background.tsx` | WebGL gradient background | Ambient background |
| `src/lib/motion.ts` | `VIEWPORT_MARGIN.decorative` constant | Shared config |

Also inspected (no decorative motion): `hero.tsx` (text-level narrative, not decorative), `team.tsx`, `process.tsx`, `portfolio.tsx`, `what-we-build.tsx`, `navbar.tsx`, `footer.tsx`.

---

## 2. Decorative Motion Inventory

### A. Zigzag Divider (`zigzag-divider.tsx`)

| Attribute | Value |
|---|---|
| **Element type** | Hand-drawn irregular zigzag SVG path |
| **Visual role** | Transition — separates WhatWeBuild from Process |
| **Trigger** | `whileInView` with `initial={false}` |
| **Properties animated** | `pathLength` (0 → 1, implicit via `whileInView={{ pathLength: 1 }}`) |
| **Duration / easing** | `1.8s`, `easeInOut` |
| **Delay** | None |
| **Viewport config** | `once: true`, `margin: VIEWPORT_MARGIN.decorative` (`"-80px"`) |
| **Reduced motion** | Full fallback: renders static `<path>` instead of `<motion.path>` |
| **Perceptible** | Yes — line draws left-to-right across screen width |
| **Motion reads as** | **Handwritten draw** |

### B. Handwritten Arrow (`handwritten-arrow.tsx`)

| Attribute | Value |
|---|---|
| **Element type** | Wobbly downward arrow SVG (shaft + two arrowhead strokes) |
| **Visual role** | Transition — links Process to Portfolio |
| **Trigger** | `whileInView` with `initial={false}` (same for all 3 sub-paths) |
| **Properties animated** | `pathLength` (0 → 1) on each of 3 sub-paths |
| **Duration / easing** | Shaft: `1.0s easeOut`; Left head: `0.25s easeOut delay 0.9`; Right head: `0.25s easeOut delay 0.95` |
| **Viewport config** | `once: true`, `margin: VIEWPORT_MARGIN.decorative` (`"-80px"`) |
| **Reduced motion** | Full fallback: renders 3 static `<path>` elements |
| **Perceptible** | Yes — shaft draws top-to-bottom, then arrowhead tips appear |
| **Motion reads as** | **Handwritten draw** (sequenced multi-stroke) |

### C. Problem Circle (`problem.tsx:102-129`)

| Attribute | Value |
|---|---|
| **Element type** | Hand-drawn elliptical circle SVG path wrapping closing text |
| **Visual role** | Emphasis — highlights the key insight sentence |
| **Trigger** | `whileInView` with `initial={false}` |
| **Properties animated** | `strokeDashoffset` (→ 0) with `pathLength={1}` and `strokeDasharray="1"` |
| **Duration / easing** | `1.5s`, `easeOut`, `delay: 0.3` |
| **Viewport config** | `once: true`, `margin: VIEWPORT_MARGIN.decorative` (`"-80px"`) |
| **Reduced motion** | Full fallback: renders static `<path>` |
| **Perceptible** | Yes — circle draws around the text |
| **Motion reads as** | **Handwritten draw** |

### D. Contact Letter Fill (`contact.tsx:24-47, 98-116`)

| Attribute | Value |
|---|---|
| **Element type** | Per-character fill color transition (background → white) with glow |
| **Visual role** | Emphasis — reveals the CTA headline letter by letter |
| **Trigger** | `useScroll` + `useTransform` — scroll-linked letter progression |
| **Properties animated** | `WebkitTextFillColor` (bg → white), `textShadow` (glow pulse per letter) |
| **Duration / easing** | Per-letter: `ANIM_DUR = 0.12` of scroll range; overall across `[0, 0.4]` of section progress |
| **Viewport config** | N/A — scroll-driven, not viewport-triggered |
| **Reduced motion** | Full fallback: static visible text, no letter animation |
| **Perceptible** | Yes — letters fill in left-to-right as user scrolls |
| **Motion reads as** | **Geometric reveal** (not handwritten — crisp fill, no path draw) |

### E. Technologies Marquee (`technologies.tsx` + `index.css:227-238`)

| Attribute | Value |
|---|---|
| **Element type** | Doubled logo row translating left in infinite loop |
| **Visual role** | Ambient texture — conveys breadth of tech stack |
| **Trigger** | CSS `@keyframes marquee` — runs on mount, infinite |
| **Properties animated** | `translateX` (0 → -50%) |
| **Duration / easing** | `60s`, `linear`, `infinite` |
| **Reduced motion** | CSS `@media (prefers-reduced-motion: reduce)` sets `animation: none` |
| **Perceptible** | Yes — slow continuous horizontal scroll |
| **Motion reads as** | **Ambient loop** |

### F. Spin-slow Keyframes (`index.css:251-265`)

| Attribute | Value |
|---|---|
| **Element type** | Forward (`30s`) and reverse (`20s`) slow rotation keyframes |
| **Visual role** | Unknown — labeled "BLACK HOLE" in CSS comment |
| **Trigger** | CSS class application |
| **Properties animated** | `rotate` (0→360 / 360→0) |
| **Usage in components** | **None found** — no `.tsx` file references `animate-spin-slow` or `animate-spin-slow-reverse` |
| **Reduced motion** | CSS `@media (prefers-reduced-motion: reduce)` sets `animation: none` |
| **Perceptible** | N/A — orphaned/dead code |
| **Motion reads as** | **Dead code** — orphaned keyframes with no consumer |

### G. Shader Background (`shader-background.tsx`)

| Attribute | Value |
|---|---|
| **Element type** | WebGL gradient sphere that blends between color presets as user scrolls |
| **Visual role** | Ambient background — sets mood per section |
| **Trigger** | Scroll-driven via manual `requestAnimationFrame` loop + `sectionProgress()` |
| **Properties animated** | `color1/2/3`, `brightness`, and all ShaderGradient numeric props |
| **Duration / easing** | `LERP_SPEED = 0.045` per frame, quintic smoothstep, ~20fps render cap |
| **Reduced motion** | **None** — no `prefers-reduced-motion` check; WebGL animation runs unconditionally |
| **Perceptible** | Yes — background color slowly shifts as user scrolls between sections |
| **Motion reads as** | **Ambient background** (not decorative in the SVG-stroke sense) |

---

## 3. Pattern Classification

### Bucket 1: Handwritten path draw

**Where**: Zigzag divider, Handwritten arrow, Problem circle

**What it contributes**: A consistent "sketched by hand" feel — paths appear to be drawn in real time. This reinforces the brand's human/craft identity.

**Shared traits**:
- `motion.path` with `pathLength` or `strokeDashoffset` animation
- `whileInView` trigger with `once: true`
- `VIEWPORT_MARGIN.decorative` (`"-80px"`)
- Reduced motion: static `<path>` fallback
- Easing: `easeOut` or `easeInOut`
- Duration: 1.0–1.8s range

**Differences**:

| | Zigzag | Arrow | Circle |
|---|---|---|---|
| Duration | 1.8s | 1.0s (shaft) + 0.25s × 2 (heads) | 1.5s |
| Easing | easeInOut | easeOut | easeOut |
| Delay | none | 0.9s, 0.95s (heads only) | 0.3s |
| Technique | `whileInView={{ pathLength: 1 }}` | `whileInView={{ pathLength: 1 }}` | `whileInView={{ strokeDashoffset: 0 }}` + `pathLength={1}` + `strokeDasharray="1"` |
| Stroke style | rgba white 0.5, width 1.5 | rgba white 0.45, width 2 | rgba white 0.5, width 2 |

**Reusable?** Yes — these three share the same visual language and differ only in parametric details.

**Should standardize?** The technique layer (how pathLength draw is achieved) and the viewport config can be standardized. Duration/easing should be allowed to vary by geometry (long zigzag needs more time than a short arrowhead).

### Bucket 2: Geometric reveal (non-handwritten)

**Where**: Contact letter fill

**What it contributes**: A dramatic, precise reveal of the CTA headline. Letters fill from background color to white in sequence as the user scrolls. This is crisp and controlled — the opposite of handwritten.

**Reusable?** No — unique to the Contact section's scroll-driven letter effect.

**Should standardize?** No. This is narrative motion tied to a specific section mechanic (scroll-linked fill per character). It does not share technique or intent with path-draw decoratives.

### Bucket 3: Ambient loop

**Where**: Technologies marquee

**What it contributes**: Slow, perpetual horizontal drift that reads as "we work with many tools." Background-level visual rhythm.

**Reusable?** As a concept, yes (if more marquees are added). Currently the only instance.

**Should standardize?** Not yet — single instance. The CSS implementation is clean and self-contained.

### Bucket 4: Ambient background

**Where**: Shader gradient background

**What it contributes**: Section-aware mood lighting. Purely atmospheric.

**Reusable?** No — singleton WebGL element.

**Should standardize?** No. This is infrastructure, not decorative motion in the SVG-stroke sense. The only issue is the missing reduced-motion handling.

### Bucket 5: Dead code

**Where**: `animate-spin-slow` / `animate-spin-slow-reverse` in `index.css`

**What it contributes**: Nothing — no component uses these classes.

**Should address?** Remove in a cleanup pass. Not blocking.

---

## 4. Inconsistencies and False-Consistency Traps

### Real inconsistencies (worth fixing)

1. **Path draw technique divergence**
   - Zigzag and Arrow: `whileInView={{ pathLength: 1 }}` — clean, minimal
   - Circle: `pathLength={1}` + `strokeDasharray="1"` + `whileInView={{ strokeDashoffset: 0 }}` — older/verbose technique that achieves the same visual result
   - All three should use the same approach. The `pathLength` shorthand is simpler and produces identical output.

2. **Easing inconsistency within handwritten draws**
   - Zigzag: `easeInOut` — starts slow, accelerates, decelerates
   - Arrow and Circle: `easeOut` — starts fast, decelerates
   - For a handwritten-draw feel, `easeOut` is more natural (pen accelerates on contact, decelerates at lift). The zigzag using `easeInOut` makes the start of the draw feel hesitant. This is likely unintentional.

3. **Stroke style inconsistency**
   - Zigzag: `rgba(255,255,255,0.5)`, strokeWidth `1.5`, strokeLinecap `round`, strokeLinejoin `round`
   - Arrow: `rgba(255,255,255,0.45)`, strokeWidth `2`, strokeLinecap `round`, no strokeLinejoin
   - Circle: `rgba(255,255,255,0.5)`, strokeWidth `2`, strokeLinecap `round`, no strokeLinejoin
   - The opacity and width differences are minor but add up to a slightly inconsistent visual weight. The zigzag is thinner and brighter; the arrow is thicker and dimmer.

4. **Shader background has no reduced-motion handling**
   - The WebGL animation (`uSpeed: 0.3`, sphere undulation) runs unconditionally
   - Every other animated element in the site respects `prefers-reduced-motion`
   - The scroll-driven color blend is arguably fine (user-controlled), but the sphere's constant vertex animation should pause under reduced motion

### Inconsistencies that are actually correct

5. **Duration differences between handwritten draws** — JUSTIFIED
   - Zigzag (1.8s): longest path, spans full viewport width — needs more time
   - Arrow shaft (1.0s): short vertical stroke — faster draw feels right
   - Circle (1.5s): medium-length elliptical path — intermediate duration
   - Duration should scale with visual path length. Forcing 1.5s on everything would make the zigzag feel rushed and the arrow feel slow.

6. **Arrow's sequenced sub-strokes** — JUSTIFIED
   - The arrowhead segments delay until the shaft finishes (`delay: 0.9` / `0.95`)
   - This is correct choreography — you draw the shaft first, then flick the arrowhead
   - Other elements don't need this because they are single paths

7. **Circle's 0.3s delay** — JUSTIFIED
   - The circle sits inside `ClosingText`, which itself fades in via `useScrollFadeIn`
   - The delay ensures the circle draws after the text is visible
   - Other decorative elements are standalone and don't need to wait for parent content

8. **Contact letter fill is different from handwritten draws** — JUSTIFIED
   - It is scroll-linked, not viewport-triggered
   - It animates color fill, not path stroke
   - It is part of section-level narrative choreography, not decorative embellishment
   - Forcing it into a "handwritten draw" pattern would be conceptually wrong

### False-consistency traps

9. **"All decorative motion should use pathLength draw"** — WRONG
   - The marquee is an ambient CSS loop — pathLength makes no sense
   - The letter fill is scroll-driven color change — pathLength doesn't apply
   - The shader background is WebGL — completely different layer
   - Only SVG stroke elements should use pathLength draw

10. **"Handwritten draw should be scroll-driven like the cards"** — WRONG
    - Decorative draws are one-shot reveals (`once: true`) — they play once on viewport entry and stay
    - Making them scroll-linked would create distracting constant motion on every scroll movement
    - The `whileInView` trigger is correct for decorative accents

11. **"Same duration for all decorative elements"** — WRONG
    - The visual path length varies dramatically (full-width zigzag vs. 50px arrowhead tip)
    - Duration must scale with geometry, or short paths feel sluggish and long paths feel rushed

---

## 5. Evaluation of the Handwritten-Draw Direction

### Which elements genuinely benefit from handwritten draw?

| Element | Benefits? | Why |
|---|---|---|
| Zigzag divider | **Yes** | Already uses it. Path geometry is explicitly irregular/hand-drawn. |
| Handwritten arrow | **Yes** | Already uses it. Wobbly path with asymmetric arrowhead. |
| Problem circle | **Yes** | Already uses it. Elliptical, imperfect circle around text. |

All three already implement handwritten draw. This is not a new direction — it is the existing direction. The question is whether to normalize the implementation, not whether to adopt a new motion language.

### Which elements should NOT use handwritten draw?

| Element | Why not |
|---|---|
| Contact letter fill | Scroll-driven geometric reveal — crisp, controlled, intentionally non-handwritten |
| Technologies marquee | Ambient CSS loop — no stroke to draw |
| Shader background | WebGL infrastructure — different domain entirely |
| Spin-slow keyframes | Dead code — should be removed, not animated differently |

### Is handwritten draw the right universal direction?

**No. It is the right direction for SVG stroke decoratives only.**

The site's decorative motion naturally splits into:
- **SVG stroke decoratives** (zigzag, arrow, circle) → handwritten draw is correct and already in use
- **Ambient loops** (marquee, shader) → continuous motion, not draw-based
- **Narrative accent** (contact letter fill) → scroll-driven, section-specific

Trying to force handwritten draw onto the marquee or contact section would be incoherent. The handwritten-draw language should be normalized **within its natural scope** (SVG path elements) and left alone elsewhere.

### Conclusion

**Handwritten draw is a partial direction — correct for SVG stroke decoratives, wrong as a universal rule.**

---

## 6. Recommendation: Should Decorative Motion Converge?

**Firm answer: Proceed with a normalized handwritten-draw preset for SVG path decoratives only. Do not extend it to non-path elements.**

### What should be normalized (Bucket 1 only)

| Concern | Current state | Target |
|---|---|---|
| Path draw technique | Circle uses verbose `strokeDashoffset` approach; zigzag/arrow use `pathLength` shorthand | All three use `whileInView={{ pathLength: 1 }}` |
| Base easing | Zigzag: `easeInOut`; Arrow/Circle: `easeOut` | All use `easeOut` (more natural pen-on-paper feel) |
| Viewport config | All use `VIEWPORT_MARGIN.decorative` + `once: true` | Already consistent — keep as-is |
| Stroke style | Minor opacity/width differences | Normalize to `rgba(255,255,255,0.5)` strokeWidth `2` strokeLinecap `round` |

### What should NOT be standardized

- Duration — must vary by path geometry
- Delay — must vary by choreographic context (circle waits for parent text)
- Arrow sub-stroke sequencing — section-specific multi-path choreography
- Contact letter fill — different motion category entirely
- Marquee — CSS loop, not related
- Shader background — WebGL, not related

### What should be additionally addressed

- Remove orphaned `animate-spin-slow` / `animate-spin-slow-reverse` keyframes from `index.css`
- Add reduced-motion handling to `shader-background.tsx` (set `uSpeed: 0` or `animate: "off"` when `prefers-reduced-motion` is active)

---

## 7. Proposed Architecture for the Next Branch

Branch name: `fix/decorative-motion-normalization`

### Changes to `src/lib/motion.ts`

```ts
/** Shared easing for one-shot handwritten path-draw decoratives. */
export const DRAW_EASE = "easeOut" as const
```

A single constant for the shared easing. Duration remains per-instance because it must scale with path geometry. No wrapper, no preset object, no helper function.

### Changes to `src/components/sections/problem.tsx`

Normalize circle path draw from verbose technique to `pathLength` shorthand:

**Before:**
```tsx
<motion.path
  pathLength={1}
  strokeDasharray="1"
  whileInView={{ strokeDashoffset: 0 }}
  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
/>
```

**After:**
```tsx
<motion.path
  whileInView={{ pathLength: 1 }}
  transition={{ duration: 1.5, ease: DRAW_EASE, delay: 0.3 }}
/>
```

Also normalize stroke to `rgba(255,255,255,0.5)` strokeWidth `2` (currently matches — verify only).

### Changes to `src/components/ui/zigzag-divider.tsx`

- Change easing from `easeInOut` to `DRAW_EASE` (`easeOut`)
- Normalize stroke to `rgba(255,255,255,0.5)` strokeWidth `2`
- Import `DRAW_EASE` from `@/lib/motion`

### Changes to `src/components/ui/handwritten-arrow.tsx`

- Replace inline `"easeOut"` with `DRAW_EASE` for all 3 sub-paths
- Normalize stroke opacity from `0.45` to `0.5`
- Import `DRAW_EASE` from `@/lib/motion`

### Changes to `src/index.css`

- Remove orphaned `@keyframes spin-slow`, `@keyframes spin-slow-reverse`, `.animate-spin-slow`, `.animate-spin-slow-reverse` blocks
- Remove their `prefers-reduced-motion` entries

### Changes to `src/components/shell/shader-background.tsx`

- Add `prefers-reduced-motion` check
- When reduced motion is active, set `animate: "off"` on the ShaderGradient (stops vertex animation) while keeping the static gradient visible

### No changes to

- `contact.tsx` — different motion category (geometric reveal, not handwritten draw)
- `technologies.tsx` — CSS marquee, already has reduced-motion handling
- `portfolio.tsx`, `what-we-build.tsx`, `process.tsx`, `team.tsx` — card motion, not decorative
- `hero.tsx` — narrative motion, not decorative

---

## 8. Migration Plan

### Order

1. **`motion.ts`** — add `DRAW_EASE` constant (no runtime change)
2. **`zigzag-divider.tsx`** — swap easing to `DRAW_EASE`, normalize stroke style (visual change: draw start feels slightly different)
3. **`handwritten-arrow.tsx`** — swap inline easing to `DRAW_EASE`, normalize stroke opacity (minimal visual change)
4. **`problem.tsx`** — refactor circle from `strokeDashoffset` technique to `pathLength` shorthand, use `DRAW_EASE` (visual result should be identical)
5. **`index.css`** — remove dead `spin-slow` keyframes (safe deletion — no consumers)
6. **`shader-background.tsx`** — add reduced-motion handling (visual change under `prefers-reduced-motion` only)

### Validation per step

- After step 1: typecheck passes
- After steps 2–4: visual regression check — all three decorative draws should feel consistent (same easing curve, same stroke weight/opacity)
- After step 5: build passes, no visual change
- After step 6: verify shader gradient is visible but static under `prefers-reduced-motion: reduce`

---

## 9. Risks / Open Questions

### Risks

1. **Zigzag easing change**: Switching from `easeInOut` to `easeOut` makes the zigzag start drawing faster. If the current slow-start was intentional (building anticipation), this could feel worse. **Must test visually.**

2. **Circle pathLength refactor**: The `strokeDashoffset` → `pathLength` swap should produce identical visual results, but complex path geometries occasionally render differently between the two techniques. **Must verify the circle draws identically.**

3. **Shader reduced-motion**: Setting `animate: "off"` freezes the gradient. If the frozen frame looks bad (e.g., mid-undulation), consider using `uSpeed: 0` instead to let it settle to a neutral position. **Test both approaches.**

### Open questions

1. **Should stroke weight/opacity be a shared constant?** The values are `rgba(255,255,255,0.5)` and strokeWidth `2` — short enough to inline. Extracting them to constants might be over-engineering for 3 instances. **Lean toward keeping them inline but consistent.**

2. **Should `DRAW_EASE` be extended with a recommended duration range?** The audit found durations ranging from 0.25s (arrowhead tip) to 1.8s (zigzag). A constant like `DRAW_DURATION_PER_VIEWPORT_WIDTH` would be too rigid. **Keep duration per-instance.**

3. **Should the shader background use `useReducedMotion()` from framer-motion or a direct CSS media query check?** The shader component doesn't use framer-motion currently. Adding a framer-motion dependency just for this hook seems excessive. **Prefer `window.matchMedia('(prefers-reduced-motion: reduce)')` or a lightweight hook.**

---

## 10. Validation Results

- **Decorative motion instances audited**: 7 instances across 7 files (3 SVG path draws, 1 text fill, 1 CSS marquee, 1 WebGL background, 1 orphaned CSS keyframe set)
- **Pattern classification**: 5 buckets (handwritten draw, geometric reveal, ambient loop, ambient background, dead code)
- **Real inconsistencies found**: 4 (technique divergence, easing inconsistency, stroke style inconsistency, shader reduced-motion gap)
- **Justified differences**: 4 (duration scaling, arrow sequencing, circle delay, contact letter fill)
- **False-consistency traps**: 3 (universal pathLength, scroll-driven draws, same duration)
- **Dead code found**: `animate-spin-slow` / `animate-spin-slow-reverse` — no consumers
- **No implementation performed**: zero code changes made
- **No merge performed**: branch remains in audit state
- **Build/typecheck**: not required (no file changes)

---

## 11. Final Branch Status

```
Branch: audit/decorative-motion-consistency
Based on: main (at 9ca6a95)
Files changed: 1 (this report)
Implementation: none
Merge: not performed
Status: ready for review
```

---

## Final Recommendation

**Proceed with multiple semantic decorative motion categories — do not unify all decorative motion under handwritten draw.**

Specifically:
- Normalize the 3 SVG path-draw decoratives (zigzag, arrow, circle) to use the same technique (`pathLength` shorthand), same base easing (`easeOut`), and same stroke style — while keeping duration and delay per-instance
- Extract only the shared easing to a constant (`DRAW_EASE`); do not create a wrapper, hook, or preset object
- Remove orphaned `spin-slow` dead code
- Add reduced-motion handling to the shader background
- Do NOT touch the Contact letter fill, Technologies marquee, or any non-SVG-path element
- Do NOT create a universal decorative motion abstraction — the categories are too different

The handwritten-draw language is already correct and already in use. The work is normalizing the implementation, not inventing a new system.
