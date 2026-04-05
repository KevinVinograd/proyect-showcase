# Viewport Height & Scroll Pacing Audit

**Date**: 2026-04-05
**Branch**: `audit/viewport-height-sections`
**Status**: Read-only analysis -- no files modified

**Viewport reference**: 1080px (1080p). Notes at 900px where behavior diverges.
**Total estimated page height**: ~18,470px (~17.1 viewports)

---

## 1. Section Height Measurement

All heights are at 1080px viewport. Pinned sections use `["start start", "end end"]` unless noted; scroll distance = section height - viewport height.

| # | Section | Height class | Height (px) | Ratio (vh) | Scroll distance (px) | Scroll offset |
|---|---------|-------------|-------------|------------|----------------------|---------------|
| 1 | Hero | `h-[150vh]` | 1,620 | 150vh | 1,620* | `["start start", "end start"]` |
| 2 | Spacer | `h-[15vh]` | 162 | 15vh | 162 | -- |
| 3 | Problem | `h-[350vh]` | 3,780 | 350vh | 2,700 | `["start start", "end end"]` |
| 4 | Closing Text | `py-[200px]` + content | ~600 | ~56vh | ~600 | own `["start end", "start start"]` |
| 5 | What We Build | `py-[var(--sp-30)]` | ~840 | ~78vh | ~840 | flow-based |
| 6 | Zigzag Divider | `py-[160px]` | ~320 | ~30vh | ~320 | flow-based |
| 7 | Process | `h-[300vh]` | 3,240 | 300vh | 2,160 | `["start start", "end end"]` |
| 8 | Arrow | margins overlap | ~50 | ~5vh | ~50 | flow-based |
| 9 | Portfolio | `pt-48 pb-120` + content | ~1,116 | ~103vh | ~1,116 | flow-based |
| 10 | Technologies | `py-[var(--sp-20)]` | ~260 | ~24vh | ~260 | flow-based |
| 11 | Team | `h-[350vh]` | 3,780 | 350vh | 2,700 | `["start start", "end end"]` |
| 12 | Contact | `h-[250vh]` | 2,700 | 250vh | 2,376** | `["start 0.7", "end end"]` |

*Hero uses `["start start", "end start"]`, so the full section height = scroll distance.
**Contact's offset `"start 0.7"` shifts progress start to when section top reaches 70% down viewport, reducing effective animation range by 0.3vh.

---

## 2. Scroll Duration Estimation

| Section | Scroll (px) | Duration | Risk |
|---------|------------|----------|------|
| Hero | 1,620 | Medium | Low |
| Spacer | 162 | Short | -- |
| Problem | 3,780 | Excessive | Dead zone risk |
| Closing Text | ~600 | Short | -- |
| What We Build | ~840 | Short | -- |
| Zigzag Divider | ~320 | Short | -- |
| Process | 3,240 | Long | Fatigue risk |
| Arrow | ~50 | Short | -- |
| Portfolio | ~1,116 | Medium | -- |
| Technologies | ~260 | Short | -- |
| Team | 3,780 | Excessive | Dead zone risk |
| Contact | 2,700 | Long | Dead zone risk |

---

## 3. Dead Zone Detection

### 3.1 Hero

| Zone | Range (progress) | Range (px) | Length | Description |
|------|-----------------|------------|--------|-------------|
| Trailing | 0.55 -- 1.0 | 891 -- 1,620 | ~729px | All foreground animations complete. Title at 0.4 opacity, subtitle faded out. Sticky screen shows faded text with only shader BG shifting. |

**Mitigation**: Shader background color blend provides subtle visual change. Not fully dead, but no foreground content evolution.

### 3.2 Problem

| Zone | Range (progress) | Range (px) | Length | Description |
|------|-----------------|------------|--------|-------------|
| Leading | 0.00 -- 0.32 | 0 -- 864 | ~864px | Section is pinned. Heading is visible (animated during approach phase). No cards, no new content. User stares at heading for 0.8 viewports. |
| Inter-card gaps | between each card | ~270-297px each | ~864px total | Between each post-it reveal there is ~270px of scroll with no new element appearing. |
| Trailing | 0.80 -- 1.00 | 2,160 -- 2,700 | ~540px | All 4 cards are visible. Circle SVG is in the ClosingText sibling (outside this section). Nothing changes. |

**Total dead scroll**: ~2,268px of 2,700px scroll distance = **84% low-activity**

### 3.3 Process

| Zone | Range (progress) | Range (px) | Length | Description |
|------|-----------------|------------|--------|-------------|
| Post-reveal drift | 0.42 -- 0.90 | 907 -- 1,944 | ~1,037px | All 4 cards are visible by 0.42. Horizontal scroll continues for another 1,037px but no new elements appear -- just the track sliding. |
| Trailing | 0.90 -- 1.00 | 1,944 -- 2,160 | ~216px | Horizontal scroll stops. Static view. |

**Note**: The horizontal scroll (0.1--0.9) does provide continuous visual motion. However, the card content is fully revealed by 0.42, so the remaining 48% is mechanical drift with diminishing engagement.

### 3.4 Team (WORST OFFENDER)

| Zone | Range (progress) | Range (px) | Length | Description |
|------|-----------------|------------|--------|-------------|
| Leading | 0.00 -- 0.31 | 0 -- 837 | ~837px | Pinned screen with heading visible. No cards, no content. 0.78 viewports of waiting. |
| Trailing | 0.43 -- 1.00 | 1,161 -- 2,700 | ~1,539px | All 3 cards fully visible and static. 1.43 viewports of zero change. |

**Total dead scroll**: 2,376px of 2,700px = **88% dead**
**Active animation**: only 324px (0.31--0.43) = **12% utilization**

This is the most severe pacing failure on the page.

### 3.5 Contact

| Zone | Range (progress) | Range (px) | Length | Description |
|------|-----------------|------------|--------|-------------|
| Trailing | 0.50 -- 1.00 | 1,188 -- 2,376 | ~1,188px | Letter fill and body reveal are complete. Sticky screen shows static CTA. 1.1 viewports of no change. |

**Total dead scroll**: 1,188px of 2,376px = **50% dead**

### 3.6 Combined Dead Zone Sequences

**Critical transition: Hero tail -- Spacer -- Problem head**

```
Hero (0.55-1.0):     729px  -- faded content, shader BG only
15vh Spacer:          162px  -- empty
Problem (0.0-0.32):  864px  -- heading only, no cards
                    ------
TOTAL:              1,755px  (~1.6 viewports of minimal foreground change)
```

**Critical transition: Team tail -- Contact head**

```
Team (0.43-1.0):   1,539px  -- static cards
Contact start:       ~0px   -- animations begin during approach (offset 0.7)
```

Contact begins its letter-fill during approach, so the transition is partly masked. Still, 1,539px of static Team is severe on its own.

---

## 4. Content Density Analysis

| Section | Headings | Cards/Visuals | Motion triggers | Density | vs. Height |
|---------|----------|---------------|-----------------|---------|------------|
| Hero | 1 title + 1 subtitle | 0 | 4 (letter reveal, h-scroll, subtitle fade, content fade) | Low | 150vh for 2 text elements |
| Problem | 1 heading | 4 post-its | 5 (heading, 4 card reveals) | Low | 350vh for 5 elements |
| Closing Text | 2 paragraphs | 1 SVG circle | 2 (text fade, circle draw) | Balanced | ~56vh |
| What We Build | 1 heading | 3 cards | 4 (heading, 3 cards) | Balanced | ~78vh |
| Zigzag Divider | 0 | 1 SVG | 1 (path draw) | N/A | decorative |
| Process | 1 heading | 4 cards | 5 (heading, h-scroll, 4 thresholds) | Low | 300vh for 5 elements |
| Portfolio | 1 heading | 3 cards (detail-rich) | 4 (heading, 3 cards) | Balanced | ~103vh |
| Technologies | 1 (sr-only) | 10 logos | 1 (marquee) | Low | intentionally sparse |
| Team | 1 heading | 3 cards + 3 photos | 4 (heading, 3 cascades) | Low | 350vh for 4 elements |
| Contact | 1 title (~40 chars) | 1 CTA button | 2 (letter fill, body reveal) | Low | 250vh for 2 elements |

**Content-to-height ratio** (lower is worse):

| Section | Elements | Scroll (px) | px per element |
|---------|----------|-------------|----------------|
| What We Build | 4 | 840 | 210 |
| Portfolio | 4 | 1,116 | 279 |
| Closing Text | 3 | 600 | 200 |
| Hero | 4 | 1,620 | 405 |
| Process | 5 | 3,240 | 648 |
| Problem | 5 | 3,780 | 756 |
| Contact | 2 | 2,700 | 1,350 |
| Team | 4 | 3,780 | 945 |

Team and Contact have the worst ratios: ~950-1350px of scroll per meaningful element.

---

## 5. Motion & Interaction Audit

| Section | Scroll-triggered | H-scroll | Parallax/gradient | Progressive reveal | Assessment |
|---------|-----------------|----------|-------------------|-------------------|------------|
| Hero | Letter reveal, fade sequences | Title horizontal scroll | Shader BG blend | Character-by-character | **Supports pacing** -- but ends at 55% of section |
| Problem | Card cascade, heading fade | -- | Shader BG blend | Post-it stagger (with long gaps) | **Missing opportunity** -- 864px pre-card dead zone |
| Closing Text | Text fade, SVG circle draw | -- | -- | Circle draws after text | **Supports pacing** |
| What We Build | Heading + card whileInView | -- | Shader BG blend | Staggered cards on scroll | **Supports pacing** |
| Process | Card thresholds, h-scroll | Horizontal card track | -- | Card visibility thresholds | **Partially supports** -- cards all visible by 42%, h-scroll continues alone |
| Portfolio | Heading + card whileInView | -- | Shader BG blend | Staggered cards on scroll | **Supports pacing** |
| Technologies | CSS marquee (continuous) | -- | -- | -- | **Neutral** -- passive break |
| Team | Card cascade (spring) | -- | Shader BG blend | 3-card Y-translate | **Missing opportunity** -- 88% dead scroll |
| Contact | Per-character color fill | -- | Shader BG blend | Letter-by-letter + body fade | **Partially supports** -- fills first 50% only |

---

## 6. Viewport Locking / Fullscreen Usage

| Section | Pattern | Min-h / h | Overflow | Issue |
|---------|---------|-----------|----------|-------|
| Hero | sticky h-screen inside 150vh wrapper | `h-[150vh]` | `clipPath: inset(0 0 -200px 0)` | OK -- 50vh overshoot is proportional to animation density |
| Problem | sticky h-screen inside 350vh wrapper | `h-[350vh]` | none | **Over-constrained** -- 250vh scroll for 5 animation events |
| Process | sticky h-screen inside 300vh wrapper | `h-[300vh]` | `overflow-hidden` on sticky | **Moderate** -- 200vh for h-scroll of 4 cards; could work if card reveals were distributed better |
| Team | sticky h-screen inside 350vh wrapper | `h-[350vh]` | none | **Over-constrained** -- 250vh scroll for animation spanning only 12% of range |
| Contact | sticky h-screen inside 250vh wrapper | `h-[250vh]` | none | **Moderate** -- 150vh overshoot; animations occupy only 50% |

**Flag: Over-constrained without content**
- Team: 350vh with 3 cards is the clearest mismatch. Even at 150vh, all content would have room.
- Problem: 350vh with 4 cards could work at ~200-250vh if card spacing were tightened.

**Flag: Underutilized**
- Contact: The trailing 50% serves as a "landing zone" but 125vh of static CTA is excessive for this purpose.

---

## 7. Problem Severity Ranking

| Rank | Section | Severity | Dead scroll % | Key issue |
|------|---------|----------|---------------|-----------|
| 1 | **Team** | **Critical** | 88% | Only 324px of animation in 2,700px of scroll. Massive trailing dead zone (1,539px). |
| 2 | **Problem** | **Moderate** | 84% (low-activity) | 864px leading dead zone + wide inter-card gaps + 540px trailing. |
| 3 | **Contact** | **Moderate** | 50% | 1,188px trailing dead zone after all animations complete at progress 0.5. |
| 4 | **Process** | **Minor** | ~48% post-card | Horizontal scroll provides continuous motion, but card reveals cluster in first 42% of scroll. Drift after cards may feel slow. |
| 5 | **Hero** | **Minor** | 45% trailing | Mitigated by shader BG transition. Worsened by subsequent 15vh spacer + Problem leading dead zone (combined: 1,755px). |
| 6 | **Spacer (15vh)** | **OK** | 100% (by design) | Acceptable as intentional breathing room, but amplifies Hero--Problem dead zone chain. |
| 7 | **What We Build** | **OK** | ~0% | Content-driven, well-paced. |
| 8 | **Portfolio** | **OK** | ~0% | Content-driven, well-paced. |
| 9 | **Technologies** | **OK** | N/A | Intentional passive break. |
| 10 | **Closing Text** | **OK** | ~0% | Self-contained, well-paced. |

---

## 8. Dead Zone Breakdown (Issues Only)

### Team (Critical)
- **Scroll range**: 0--837px and 1,161--2,700px
- **Why it feels empty**: 3 cards animate in a 324px window. The remaining 2,376px of scroll shows a static pinned screen with no content change, no progressive reveal, no visual evolution. The user scrolls through 1.43 viewports of frozen content before the section releases.

### Problem (Moderate)
- **Scroll range**: 0--864px (leading), 2,160--2,700px (trailing), plus ~270px gaps between each card
- **Why it feels empty**: The heading appears during approach (before pinning), so when the section pins, the user sees a heading with no supporting content for 864px. Then cards reveal with ~270px gaps between each one. After the 4th card, 540px remain with all cards visible and no further change.

### Contact (Moderate)
- **Scroll range**: 1,188--2,376px
- **Why it feels empty**: The letter fill effect (0--0.4) and body reveal (0.4--0.5) are compelling but occupy only the first half. The second half is a pinned, fully-rendered CTA screen with no scroll-linked interaction. The copyright fades in with the body, so there is nothing left to reveal.

### Process (Minor)
- **Scroll range**: 907--1,944px (all cards visible, just horizontal drift)
- **Why it feels empty**: All 4 card threshold animations fire by progress 0.42, but horizontal scroll continues to 0.9. The user sees the same 4 cards sliding left with no new content. The scroll-to-horizontal ratio (~3:1 to 7:1 depending on viewport width) makes movement feel slow.

### Hero trailing + Spacer + Problem leading (Minor, combined)
- **Scroll range**: Hero ~891--1,620px, Spacer 162px, Problem 0--864px
- **Why it feels empty**: 1,755px sequence where the hero has faded, the spacer is blank, and the Problem heading sits alone. Shader background transitions somewhat, but no foreground narrative advances.

---

## 9. Root Cause Analysis

### Pattern 1: Disproportionate section heights vs. animation density

The four pinned sections (Hero 150vh, Problem 350vh, Process 300vh, Team 350vh, Contact 250vh) total 1,400vh. Their combined meaningful animation spans only ~35-40% of that scroll distance. The remaining 60-65% is scroll through static pinned screens.

**Root**: Section heights appear to have been set for dramatic spacing rather than calibrated to animation content. A section's vh should be proportional to the number and duration of its scroll-linked events.

### Pattern 2: Front-loaded animation with long tails

In Problem, Process, Team, and Contact, all animations cluster in the first 30-50% of scroll progress, leaving the second half as dead scroll. This pattern is consistent across 4 of 5 pinned sections.

**Root**: Animation keyframe ranges are concentrated early in the progress timeline. The trailing progress range (0.5--1.0) is unused in most sections.

### Pattern 3: Missing progressive reveal in long sections

The content-driven sections (What We Build, Portfolio) use `whileInView` with staggered delays, which naturally paces content as the user scrolls. The pinned sections do not employ this -- they batch-reveal content in a narrow window, then hold static.

**Root**: Pinned sections rely on progress-mapped transforms with narrow ranges rather than distributing reveals across the full scroll distance.

### Pattern 4: Inter-card spacing creates micro-dead-zones

In Problem, each card reveal takes ~117px of scroll, but cards are spaced ~270px apart. This means ~60% of the card sequence is gaps between reveals.

**Root**: The `perCard` calculation uses `(0.90 - 0.32) / 4 = 0.145` for total per-card allocation, but each card's active animation is only `0.3 * perCard = 0.0435` of progress. The remaining 70% per card is dead time.

### Pattern 5: No mid-scroll events or secondary animations

None of the pinned sections have secondary animation phases (e.g., card hover states, micro-interactions, background pattern shifts, progressive text reveals) that could fill dead zones. Once primary content appears, nothing else happens until the section unpins.

### Pattern 6: Shader background is the only continuous element

The WebGL shader gradient transitions smoothly between section color presets, providing the only continuous visual change during dead zones. This partially mitigates dead zones but is too subtle to sustain engagement alone -- it's a background effect, not foreground content.

---

## 10. Strategic Recommendations (No Code)

### R1: Recalibrate section heights to animation density

Reduce pinned section heights so that animation content occupies 70-85% of scroll distance rather than 12-50%. This is the single highest-impact change.

Priority targets:
- Team: 350vh is extreme for 3 cards. Could likely work at 150--180vh.
- Problem: 350vh for 4 cards + heading. Consider 200--250vh.
- Contact: 250vh for letter fill + body. Consider 150--180vh.

### R2: Distribute animation keyframes across the full progress range

Instead of clustering reveals in progress 0.0--0.5, spread events evenly from ~0.05 to ~0.90. This eliminates trailing dead zones without adding new content.

### R3: Add secondary scroll events to pinned sections

Fill dead zones with supporting motion:
- Micro-reveals (text highlights, badges, labels appearing)
- Subtle positional shifts (cards settling, slight parallax between layers)
- Progressive detail disclosure (expanding card content, revealing additional info)
- Background pattern or texture evolution tied to scroll

### R4: Tighten inter-card timing in Problem section

Reduce the dead gap between card reveals. The current 70% dead time per card allocation creates noticeable pauses between each post-it.

### R5: Extend Process card reveals across the horizontal scroll range

Distribute card visibility thresholds to match horizontal scroll progress, so new cards appear as they enter the viewport rather than all becoming visible while most are still off-screen.

### R6: Consider splitting the longest sections into narrative sub-blocks

For Team and Problem, breaking the single pinned section into 2 shorter pinned segments (or a pinned + flow hybrid) could improve pacing without sacrificing the scroll-driven narrative.

### R7: Re-evaluate the Hero-to-Problem transition

The combined 1,755px low-activity sequence (Hero tail + spacer + Problem lead) could be compressed. Options:
- Shorten the 15vh spacer
- Begin Problem card reveals earlier in the progress timeline
- Extend Hero animations to fill more of the 150vh

### R8: Add a scroll-aware "landing zone" budget

For sections where a trailing static zone is intentional (like Contact), explicitly budget its length -- 30-50vh is sufficient for a CTA to breathe. 125vh+ is excessive.

---

## Appendix A: Animation Timeline Maps

### Hero (150vh = 1,620px, offset: start-start to end-start)

```
Progress: 0.0 -------- 0.30 ---- 0.42 -- 0.52-0.55 ---------- 1.0
          |             |          |       |                     |
          letter reveal  content   line    (nothing)
          + h-scroll     fades     dims
          + subtitle     out       to 0.4
```

### Problem (350vh = 3,780px, scroll: 2,700px)

```
Progress: 0.0 ---------- 0.32 -- 0.36 ---- 0.47 -- 0.51 ---- 0.61 -- 0.65 ---- 0.76 -- 0.80 ---------- 1.0
          |               |        |         |        |         |        |         |        |              |
          (heading         card0    gap       card1    gap       card2    gap       card3    (nothing)
           already                  ~270px             ~270px             ~297px
           visible)
```

### Process (300vh = 3,240px, scroll: 2,160px)

```
Progress: 0.0 - 0.05 -- 0.10 ------- 0.22 ----- 0.32 ----- 0.42 ---------------------- 0.90 --- 1.0
          |     |        |             |           |           |                           |        |
          |     card1    h-scroll      card2       card3       card4                       h-scroll |
          |     visible  begins        visible     visible     visible                     stops    |
          |                                                    (all visible, just drifting)
```

### Team (350vh = 3,780px, scroll: 2,700px)

```
Progress: 0.0 -------------------- 0.31 -- 0.35 -- 0.39 -- 0.43 --------------------------------- 1.0
          |                          |        |        |        |                                     |
          (heading visible,          card0    card1    card2    (all 3 cards static,
           nothing else)                                        nothing changes for 1,539px)
```

### Contact (250vh = 2,700px, scroll: 2,376px)

```
Progress: 0.0 -------- 0.40 -- 0.50 ------------------------------------------------ 1.0
          |             |        |                                                      |
          letter fill   body     (static CTA screen,
          per-char      + CTA     nothing changes for 1,188px)
          color         fade in
```

---

## Appendix B: Validation Checklist

- [x] No files modified
- [x] No UI changes
- [x] No tokens added or edited
- [x] No layout changes
- [x] Audit document created at `ai/audits/viewport-audit.md`
