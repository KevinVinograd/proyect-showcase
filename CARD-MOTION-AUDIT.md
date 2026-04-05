# Card Motion Consistency Audit

Branch: `audit/card-motion-consistency`
Date: 2026-04-05

---

## 1. Files / Card Instances Audited

| File | Card-like instances | Count |
|---|---|---|
| `src/components/sections/problem.tsx` | Post-it pain-point cards | 4 |
| `src/components/sections/what-we-build.tsx` | Feature description blocks (starburst mask) | 3 |
| `src/components/sections/process.tsx` | Process step cards (numbered) | 4 |
| `src/components/sections/portfolio.tsx` | Project case-study cards (`<Card>` UI) | 3 |
| `src/components/sections/team.tsx` | Team member photo+info cards | 3 |
| `src/components/sections/technologies.tsx` | Tech logo items (marquee) | 10 |
| `src/lib/motion.ts` | Shared motion utilities | — |
| `src/components/ui/card.tsx` | Base Card UI component (no motion) | — |

Also inspected (no card-level motion): `hero.tsx`, `contact.tsx`, `zigzag-divider.tsx`, `handwritten-arrow.tsx`, `navbar.tsx`, `footer.tsx`.

---

## 2. Card Motion Inventory

### A. Problem — Post-It Cards (`problem.tsx:32-76`)

| Attribute | Value |
|---|---|
| **Trigger** | `useScroll` + `useTransform` — scroll-linked per card within pinned section |
| **Properties animated** | opacity, scale, rotate, y, x |
| **Physics** | `useSpring(useTransform(...), SCROLL_SPRING)` — spring { stiffness: 80, damping: 22 } |
| **Scroll range** | Cards start at progress 0.32, each gets `perCard * 0.3` reveal window |
| **Enter/exit** | Enter only — cards appear and stay |
| **Reduced motion** | Full fallback: static fan layout with CSS `transform: rotate()` only |
| **Mobile** | Separate static vertical list, no motion at all |
| **Perceptible** | Yes — dramatic stacking with rotation and offset |
| **Motion role** | **Narrative** — cards stack one by one to build tension about operational pain |

### B. What We Build — Feature Blocks (`what-we-build.tsx:59-75`)

| Attribute | Value |
|---|---|
| **Trigger** | None on cards. Heading uses `useScrollFadeIn` |
| **Properties animated** | None on cards |
| **Physics** | N/A |
| **Reduced motion** | N/A (nothing to disable) |
| **Perceptible** | Cards are static |
| **Motion role** | **Static** — cards are informational blocks, heading carries the reveal |

### C. Process — Step Cards (`process.tsx:128-161`)

| Attribute | Value |
|---|---|
| **Trigger** | `animate` prop toggled by `visibleCount` state (derived from `useMotionValueEvent` on `scrollYProgress`) |
| **Properties animated** | opacity (0→1), y (80→0), rotate (5→0) |
| **Physics** | Tween: `{ duration: 0.5, ease: "easeOut" }` |
| **Scroll range** | Threshold array `[0.05, 0.22, 0.32, 0.42]` — cards appear as horizontal track scrolls |
| **Enter/exit** | Enter only — `visibleCount` only increments (thresholds are cumulative) |
| **Reduced motion** | Full fallback: static 2-column grid, all cards visible |
| **Horizontal scroll** | Parent `<motion.div>` moves via `useTransform(scrollYProgress, [0.1, 0.9], [0, -travel])` |
| **Perceptible** | Yes — cards pop up from below as horizontal scroller advances |
| **Motion role** | **Narrative** — sequential step reveal tied to horizontal scroll progression |

### D. Portfolio — Project Cards (`portfolio.tsx:70-113`)

| Attribute | Value |
|---|---|
| **Trigger** | None on cards. Heading uses `useScrollFadeIn` |
| **Properties animated** | None on cards |
| **Physics** | N/A |
| **Reduced motion** | N/A (nothing to disable) |
| **Perceptible** | Cards are static |
| **Motion role** | **Static** — large case-study cards, no motion needed |

### E. Team — Member Cards (`team.tsx:116-155`)

| Attribute | Value |
|---|---|
| **Trigger** | `useScroll` + `useTransform` — scroll-linked per card, manually mapped ranges |
| **Properties animated** | opacity (0→1→1→0), y (40→0→0→-40) |
| **Physics** | Raw `useTransform` — **no spring**, linear interpolation |
| **Scroll ranges** | Staggered 4-keyframe arrays per card (e.g., card 0: `[0.31, 0.35, 0.73, 0.77]`) |
| **Enter/exit** | Enter AND exit — cards fade in, hold, then fade out |
| **Reduced motion** | Full fallback: static 3-column grid with CSS margin offsets |
| **Perceptible** | Yes — staggered cascade with enter+exit in pinned section |
| **Motion role** | **Narrative** — cascade reveal within a long pinned section, cards leave to make room for next section |

### F. Technologies — Logo Items (`technologies.tsx:96-106`)

| Attribute | Value |
|---|---|
| **Trigger** | CSS `animate-marquee` keyframe animation |
| **Properties animated** | translateX (CSS) |
| **Physics** | CSS linear infinite |
| **Reduced motion** | **None** — marquee runs regardless |
| **Perceptible** | Yes — continuous horizontal scroll |
| **Motion role** | **Decorative** — ambient branding, not informational |

---

## 3. Pattern Classification

### Bucket 1: Scroll-linked narrative reveal (pinned section)

**Where**: Problem post-its, Team members, Process steps

**UX purpose**: Cards appear in deliberate sequence as the user scrolls through a pinned/sticky section. The scroll position acts as a timeline — users control the pace of the narrative.

**Shared traits**: opacity 0→1, translateY into position, driven by scroll progress within a tall pinned section.

**Differences that matter**:

| | Problem | Process | Team |
|---|---|---|---|
| Technique | `useSpring(useTransform(...))` | `animate` prop + state | Raw `useTransform(...)` |
| Physics | Spring (stiffness 80, damping 22) | Tween (0.5s easeOut) | Linear (no easing) |
| Extra properties | scale, rotate, x | rotate | none |
| Enter/exit | Enter only | Enter only | Enter + exit |
| Motion feel | Physical post-it placement | Pop-up appearance | Smooth cascade |

**Reusable?** Partially. The "fade-in + translateY within a pinned section" concept is shared, but parametric differences are load-bearing.

**Should standardize?** The physics layer (spring vs tween vs raw) could be normalized. The section-specific parameters (rotations, offsets, enter/exit) must remain local.

### Bucket 2: Static cards (no card-level motion)

**Where**: WhatWeBuild feature blocks, Portfolio project cards

**UX purpose**: Cards are informational content. The heading carries the reveal; cards are already visible when the user reaches them.

**Reusable?** Already consistent — both use `useScrollFadeIn` for the heading only.

**Should standardize?** Already standardized. No action needed.

### Bucket 3: CSS decorative loop

**Where**: Technologies marquee

**UX purpose**: Ambient movement to indicate breadth of tech stack. Not tied to user scroll or interaction.

**Reusable?** No — this is the only marquee in the site.

**Should standardize?** No, but it needs a `prefers-reduced-motion` media query.

---

## 4. Inconsistencies and False-Consistency Traps

### Real inconsistencies (worth fixing)

1. **Spring vs no-spring in scroll-driven reveals**
   - Problem cards: `useSpring(useTransform(...), SCROLL_SPRING)` — smooth, physical feel
   - Team cards: raw `useTransform(...)` — linear, mechanical feel
   - Both are scroll-driven opacity+y reveals in pinned sections. The lack of spring on Team cards makes them feel stiffer than Problem cards. This is likely unintentional rather than a deliberate UX choice.

2. **`SCROLL_SPRING` exists but is underused**
   - Defined in `motion.ts` and used by Problem cards and `useScrollFadeIn`
   - Team cards don't use it despite being the same class of motion
   - Process cards use a tween instead (justified — see below)

3. **Technologies marquee has no reduced-motion handling**
   - Every other animated component checks `useReducedMotion()` or is inherently static
   - The CSS marquee animation runs unconditionally

### Inconsistencies that are actually correct

4. **Process cards use tween instead of spring** — JUSTIFIED
   - Process cards toggle via `animate` prop (binary state change: visible vs hidden)
   - Spring physics on a threshold toggle creates oscillation/bounce that feels wrong
   - Tween `{ duration: 0.5, ease: "easeOut" }` is the right choice here

5. **Team cards have enter+exit, others don't** — JUSTIFIED
   - Team section (350vh) is long enough that cards need to leave the viewport
   - Problem section cards remain visible through the end (they stack)
   - Process cards scroll horizontally out of view (no exit animation needed)

6. **WhatWeBuild and Portfolio have no card motion** — JUSTIFIED
   - These are informational, not narrative
   - Adding uniform card reveals would be noise without purpose

### False-consistency traps to avoid

7. **"All cards should use SCROLL_SPRING"** — WRONG
   - Process cards are state-toggled, not scroll-interpolated. Applying spring to `animate` prop transitions would create bounce on what should be a clean pop.

8. **"All cards should fade in the same way"** — WRONG
   - Problem post-its need scale+rotate+x because they simulate physical placement
   - Team cards need enter+exit because of section length
   - Forcing identical behavior kills narrative variety

9. **"Cards that look similar should share motion"** — WRONG
   - WhatWeBuild blocks and Portfolio cards both look like cards but are intentionally static
   - Adding motion "for consistency" adds no UX value

10. **"One shared card reveal preset"** — WRONG
    - The overlap between Problem, Process, and Team is limited to "opacity 0→1" and "translateY into position"
    - Everything else — physics model, additional properties, enter/exit behavior, scroll range mapping — differs for valid reasons

---

## 5. Recommendation: Should a Shared Card Motion Token/System Exist?

**Firm answer: Do not create a single universal card motion token. Create a small set of semantic normalizations instead.**

### What is actually shared

The only true commonality across all animated cards is:
- **Opacity**: 0 → 1 on enter
- **TranslateY**: some positive offset → 0 on enter
- **Context**: all live inside pinned/sticky scroll sections

This is too thin to justify a "card motion preset." Wrapping this in an abstraction would be an abstraction over `opacity` and `y` — not worth it.

### What should be normalized

| Concern | Current state | Recommendation |
|---|---|---|
| Spring physics for scroll-driven motion | Used in Problem, missing in Team | Apply `SCROLL_SPRING` to Team card transforms |
| Tween config for state-driven motion | Process uses `{ duration: 0.5, ease: "easeOut" }` inline | Extract to a named constant in `motion.ts` (e.g., `CARD_TWEEN`) |
| Y offset magnitude | Problem: 40px, Process: 80px, Team: 40px | Normalize to a consistent value (40px) unless section-specific scaling justifies the difference |
| Reduced motion for CSS animations | Missing on Technologies marquee | Add `prefers-reduced-motion: reduce` media query |

### What should remain section-specific

- Problem: scale, rotate, x-offset, per-card scroll segmentation
- Process: horizontal scroll travel, threshold array, rotate
- Team: 4-keyframe enter+exit ranges, stagger offsets, cascade timing
- WhatWeBuild / Portfolio: intentionally no card motion

---

## 6. Proposed Architecture for the Next Branch

Branch name: `fix/card-motion-normalization`

### Changes to `src/lib/motion.ts`

```ts
// Add alongside existing SCROLL_SPRING:
export const CARD_TWEEN = { duration: 0.5, ease: "easeOut" } as const
export const CARD_Y_OFFSET = 40 as const
```

That's it for shared constants. No wrapper component. No card motion preset. No HOC.

### Changes to `src/components/sections/team.tsx`

- Wrap each card's `useTransform` values in `useSpring(..., SCROLL_SPRING)` to match the physics feel of other scroll-driven card reveals
- Import `SCROLL_SPRING` from `@/lib/motion`

### Changes to `src/components/sections/process.tsx`

- Import `CARD_TWEEN` and `CARD_Y_OFFSET` from `@/lib/motion`
- Replace inline `{ duration: 0.5, ease: "easeOut" }` with `CARD_TWEEN`
- Evaluate whether `y: 80` should become `CARD_Y_OFFSET` (40) for consistency, or remain 80 for this section's larger card size

### Changes to `src/components/sections/technologies.tsx`

- Add `prefers-reduced-motion: reduce` handling (either via `useReducedMotion` hook or CSS media query on the `animate-marquee` class)

### No changes to

- `problem.tsx` — already uses `SCROLL_SPRING`, motion is well-structured
- `what-we-build.tsx` — static cards, no motion to normalize
- `portfolio.tsx` — static cards, no motion to normalize
- `contact.tsx` — not card motion
- `hero.tsx` — not card motion
- `card.tsx` — base UI component, no motion responsibility

---

## 7. Migration Plan

### Order

1. **`motion.ts`** — add `CARD_TWEEN` and `CARD_Y_OFFSET` constants
2. **`technologies.tsx`** — add reduced-motion handling (independent, lowest risk)
3. **`team.tsx`** — wrap transforms in `useSpring` (visual change — test carefully)
4. **`process.tsx`** — swap inline tween for `CARD_TWEEN` constant (mechanical refactor, no visual change unless Y offset is changed)

### Validation per step

- After step 1: typecheck passes, no runtime change
- After step 2: verify marquee pauses with `prefers-reduced-motion: reduce` enabled in OS/browser
- After step 3: visual regression check — Team cards should feel smoother, not bouncy. Test with slow scroll to confirm spring doesn't overshoot.
- After step 4: visual regression check — Process cards should behave identically unless Y offset was changed

---

## 8. Risks / Open Questions

### Risks

1. **Team spring overshoot**: Adding `useSpring` to Team cards changes the feel. The 4-keyframe enter+exit pattern with spring might create oscillation at the exit boundary. Must test with actual scroll.

2. **Process Y offset change**: Reducing from 80px to 40px might make Process card entry feel too subtle given the horizontal scroll context. May need to keep 80px and not normalize this value.

3. **Scope creep**: The temptation will be to also normalize heading reveals, decorative SVG draws, etc. The next branch must stay scoped to card-level motion only.

### Open questions

1. Should Team cards keep raw `useTransform` intentionally? If the linear feel is a deliberate design choice (mechanical precision vs organic feel), then adding spring is wrong. **Decision needed from design review.**

2. Should Process card Y offset stay at 80? The larger travel might be justified by the horizontal scroll context — cards need more "arrival distance" to feel like they're emerging. **Test both values visually.**

3. Should WhatWeBuild or Portfolio cards eventually get a subtle viewport-enter reveal? They are currently static, which reads as intentional. But if the site's motion language evolves, these might feel like gaps. **Defer — out of scope for the normalization branch.**

---

## 9. Validation Results

- **All files/components audited**: 11 section/component files + 2 utility files inspected
- **Card motion inventory**: 6 card types identified, 3 with motion, 2 static, 1 CSS-only
- **Inconsistencies found**: 3 real inconsistencies, 3 justified differences, 4 false-consistency traps identified
- **No implementation performed**: zero code changes made
- **No merge performed**: branch remains in audit state
- **Build/typecheck**: not required (no file changes)

---

## 10. Final Branch Status

```
Branch: audit/card-motion-consistency
Based on: main
Files changed: 1 (this report)
Implementation: none
Merge: not performed
Status: ready for review
```

---

## Final Recommendation

**Proceed with multiple semantic motion constants — not a shared card motion token.**

Specifically:
- Normalize spring usage across scroll-driven card reveals (Team should match Problem)
- Extract the tween config used by state-driven card reveals to a named constant
- Fix the reduced-motion gap in Technologies
- Do NOT create a card motion wrapper, HOC, preset, or unified reveal system
- Keep section-specific parametric differences (rotations, offsets, enter/exit logic) local to each section

The motion differences between Problem, Process, and Team are not bugs — they are intentional responses to different narrative roles. The inconsistencies that exist are in the physics layer (spring vs linear) and the missing reduced-motion handling, not in the overall motion design.
