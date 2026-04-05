# Section Vertical Spacing Audit

**Branch:** `refactor/section-vertical-spacing-audit`
**Date:** 2026-04-05
**Scope:** All page-level sections — padding-top, padding-bottom, margin-top, margin-bottom
**Status:** Audit only — no files modified

---

## 1. Token Reference

Defined in `src/index.css:46-61`:

| Token | Value |
|-------|-------|
| `--sp-1` | 4px |
| `--sp-2` | 8px |
| `--sp-3` | 12px |
| `--sp-4` | 16px |
| `--sp-5` | 20px |
| `--sp-6` | 24px |
| `--sp-8` | 32px |
| `--sp-9` | 36px |
| `--sp-10` | 40px |
| `--sp-11` | 44px |
| `--sp-12` | 48px |
| `--sp-20` | 80px |
| `--sp-25` | 100px |
| `--sp-30` | 120px |
| `--sp-35` | 140px |
| `--sp-45` | 180px |

Layout containers: `--container-hero: 940px`, `--container-content: 820px`

---

## 2. Spacing Inventory

### 2.1 Inter-Section Spacing (App.tsx)

| Element | Spacing | Method | Notes |
|---------|---------|--------|-------|
| Hero → Problem spacer | `h-[15vh]` | Arbitrary viewport unit | Not token-based |
| WhatWeBuild wrapper | `px-[var(--sp-6)]` | Token | Horizontal only |
| Portfolio wrapper | `px-[var(--sp-6)]` | Token | Horizontal only |
| ZigzagDivider | `pt-[160px] pb-0` | **Arbitrary** | Between WhatWeBuild and Process |
| HandwrittenArrow | `-mt-[var(--sp-12)] mb-[var(--sp-12)]` | Token | Between Process and Portfolio |

### 2.2 Hero

**File:** `src/components/sections/hero.tsx`

| Variant | Property | Value | Method |
|---------|----------|-------|--------|
| Scroll-driven | section height | `h-[150vh]` | Arbitrary |
| Scroll-driven | content bottom offset | `bottom-[80px]` | Arbitrary |
| Scroll-driven | subtitle offset | `top-[calc(100%+80px)]` | Arbitrary |
| Reduced motion | section | `min-h-screen pb-[80px]` | Arbitrary |
| Reduced motion | paragraph mt | `mt-[80px]` (mobile: `mt-0`) | Arbitrary |

**Classification:** Fully arbitrary — no tokens used for vertical spacing.

### 2.3 Problem

**File:** `src/components/sections/problem.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| Mobile | pt | `pt-[var(--sp-20)]` | 80px | Token |
| Desktop reduced motion | pt | `pt-[var(--sp-30)]` | 120px | Token |
| Desktop scroll-driven | section height | `h-[350vh]` | — | Arbitrary |
| ClosingText | py | `py-[200px]` | 200px | **Arbitrary** |
| All | heading mb | `mb-[var(--sp-3)]` | 12px | Token |
| All | title mb | `mb-[var(--sp-10)]` | 40px | Token |

**Classification:** Mostly tokenized. `py-[200px]` on ClosingText is the major outlier.

### 2.4 What We Build

**File:** `src/components/sections/what-we-build.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| Desktop | py | `py-[var(--sp-30)]` | 120px | Token |
| Mobile | py | `max-md:py-[var(--sp-20)]` | 80px | Token |
| Internal | grid gap | `gap-[var(--sp-12)]` | 48px | Token |

**Classification:** Fully tokenized. Clean.

### 2.5 Process

**File:** `src/components/sections/process.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| Reduced motion | py | `py-[var(--sp-30)]` | 120px | Token |
| Mobile | py | `max-md:py-[var(--sp-20)]` | 80px | Token |
| Scroll-driven | section height | `h-[300vh]` | — | Arbitrary |
| Both | heading mb | `mb-[40px]` | 40px | **Arbitrary** |
| Reduced motion | card grid gap | `gap-[24px]` | 24px | **Arbitrary** |
| Scroll-driven | track gap | `gap-[24px]` | 24px | **Arbitrary** |
| Scroll-driven | track pr | `pr-[80px]` | 80px | **Arbitrary** |

**Classification:** Section-level tokenized, internal spacing arbitrary.

### 2.6 Portfolio

**File:** `src/components/sections/portfolio.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| Desktop | pt | `pt-[var(--sp-12)]` | 48px | Token |
| Desktop | pb | `pb-[var(--sp-30)]` | 120px | Token |
| Mobile | pt | `max-md:pt-[var(--sp-8)]` | 32px | Token |
| Mobile | pb | `max-md:pb-[var(--sp-20)]` | 80px | Token |
| Internal | card list gap | `gap-[24px]` | 24px | **Arbitrary** |
| Internal | heading mb | `mb-[var(--sp-12)]` | 48px | Token |

**Classification:** Section-level tokenized, asymmetric. Card gap is arbitrary.

### 2.7 Technologies

**File:** `src/components/sections/technologies.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| Desktop | py | `py-[var(--sp-20)]` | 80px | Token |
| Mobile | py | `max-md:py-[var(--sp-12)]` | 48px | Token |
| Internal | logo mx | `mx-10` | 40px | **Tailwind default** |

**Classification:** Section-level tokenized. Logo spacing uses Tailwind default `mx-10` instead of token.

### 2.8 Team

**File:** `src/components/sections/team.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| Reduced motion | py | `py-[var(--sp-30)]` | 120px | Token |
| Mobile | py | `max-md:py-[var(--sp-20)]` | 80px | Token |
| Scroll-driven | section height | `h-[350vh]` / `max-md:h-[400vh]` | — | Arbitrary |
| Internal | card offsets | `mt-[var(--sp-12)]`, `mt-[var(--sp-24)]` | 48px, **???** | Token / **INVALID** |
| Internal | card grid gap | `gap-[var(--sp-10)]` | 40px | Token |
| Mobile | card grid gap | `max-md:gap-[var(--sp-6)]` | 24px | Token |
| Internal | spacer mb | `mb-[var(--sp-12)]` | 48px | Token |

**Classification:** Section-level tokenized. **`--sp-24` does not exist** in the token scale — this is a bug.

### 2.9 Contact

**File:** `src/components/sections/contact.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| Reduced motion | py | `py-[var(--sp-30)]` | 120px | Token |
| Mobile | py | `max-md:py-[var(--sp-20)]` | 80px | Token |
| Scroll-driven | section height | `h-[250vh]` | — | Arbitrary |
| Internal | body mt | `mt-[var(--sp-8)]` | 32px | Token |
| Internal | buttons mt | `mt-[var(--sp-10)]` | 40px | Token |
| Footer | mt | `mt-[var(--sp-20)]` | 80px | Token |
| Footer | pt/pb | `pt-[var(--sp-20)]` / `pb-[var(--sp-20)]` | 80px | Token |

**Classification:** Fully tokenized. Clean.

### 2.10 Footer

**File:** `src/components/sections/footer.tsx`

| Variant | Property | Value | Resolved | Method |
|---------|----------|-------|----------|--------|
| All | pt | `pt-[40px]` | 40px | **Arbitrary** |
| All | pb | `pb-[40px]` | 40px | **Arbitrary** |

**Classification:** Fully arbitrary. Should use `--sp-10` (40px).

---

## 3. Pattern Detection

### 3.1 Section-Level Padding Clusters

| Resolved Value | Token | Used By |
|----------------|-------|---------|
| **120px / 80px** (desktop / mobile) | `--sp-30` / `--sp-20` | WhatWeBuild, Process, Team, Contact |
| **80px / 48px** (desktop / mobile) | `--sp-20` / `--sp-12` | Technologies |
| **48px→120px / 32px→80px** (asymmetric) | `--sp-12`→`--sp-30` / `--sp-8`→`--sp-20` | Portfolio |
| **40px / 40px** (arbitrary) | none (should be `--sp-10`) | Footer |
| **80px** (arbitrary) | none | Hero (pb only) |

**Dominant pattern:** `py-[var(--sp-30)] max-md:py-[var(--sp-20)]` — used by 4/9 sections.

### 3.2 Symmetric vs Asymmetric

| Type | Sections |
|------|----------|
| **Symmetric** (pt == pb) | WhatWeBuild, Process, Team, Contact, Technologies, Footer |
| **Asymmetric** (pt != pb) | Portfolio (pt-48 / pb-120), Problem (pt-only) |
| **Special** | Hero (no padding, uses positioning) |

### 3.3 Near-Duplicates / Noise

| Arbitrary Value | Nearest Token | Delta | Location |
|-----------------|---------------|-------|----------|
| `40px` | `--sp-10` (40px) | **0px** | Footer, Process heading mb |
| `24px` | `--sp-6` (24px) | **0px** | Process gap, Portfolio gap |
| `80px` | `--sp-20` (80px) | **0px** | Hero pb, Process track pr |
| `160px` | none | — | ZigzagDivider pt |
| `200px` | none | — | Problem ClosingText py |
| `15vh` | none | — | Hero→Problem spacer |

---

## 4. System Classification

**Semi-cohesive.**

- A token scale exists and is used correctly at the section level for 6/9 sections.
- Internal spacing within sections frequently bypasses tokens with arbitrary px values that map exactly to existing tokens (40px, 24px, 80px).
- Two large arbitrary values (160px, 200px) have no corresponding tokens.
- One invalid token reference (`--sp-24`).
- The Hero section is fully outside the token system for spacing.

---

## 5. Violations

### 5.1 Invalid Token Reference (Bug)

| File | Line | Value | Issue |
|------|------|-------|-------|
| `sections/team.tsx` | 64, 118 | `mt-[var(--sp-24)]` | `--sp-24` is **not defined**. Resolves to nothing. |

### 5.2 Arbitrary Values With Exact Token Equivalents

| File | Line | Arbitrary | Should Be |
|------|------|-----------|-----------|
| `sections/footer.tsx` | 3 | `pt-[40px]` | `pt-[var(--sp-10)]` |
| `sections/footer.tsx` | 3 | `pb-[40px]` | `pb-[var(--sp-10)]` |
| `sections/process.tsx` | 75, 114 | `mb-[40px]` | `mb-[var(--sp-10)]` |
| `sections/process.tsx` | 81, 125 | `gap-[24px]` | `gap-[var(--sp-6)]` |
| `sections/portfolio.tsx` | 70 | `gap-[24px]` | `gap-[var(--sp-6)]` |

### 5.3 Arbitrary Values Without Token Equivalents

| File | Value | Notes |
|------|-------|-------|
| `ui/zigzag-divider.tsx` | `pt-[160px]` | No token between `--sp-35` (140px) and `--sp-45` (180px) |
| `sections/problem.tsx` | `py-[200px]` | No token above `--sp-45` (180px) |
| `sections/process.tsx` | `pr-[80px]` | Equals `--sp-20` but used for horizontal, may be intentional |
| `sections/hero.tsx` | `pb-[80px]`, `mt-[80px]`, `bottom-[80px]` | All equal `--sp-20`, none use token |
| `App.tsx` | `h-[15vh]` | Viewport-relative spacer, not pixel-based |

### 5.4 Tailwind Default Instead of Token

| File | Value | Token Equivalent |
|------|-------|-----------------|
| `sections/technologies.tsx` | `mx-10` (40px) | `mx-[var(--sp-10)]` |

---

## 6. Design System Gap Analysis

### Existing Token Coverage

The spacing scale covers: 4, 8, 12, 16, 20, 24, 32, 36, 40, 44, 48, 80, 100, 120, 140, 180px.

**Gaps in the scale:**
- No token between 48px and 80px (missing 56, 64, 72)
- No token for 96px (`--sp-24` referenced but undefined)
- No token for 160px (between `--sp-35`=140 and `--sp-45`=180)
- No token for 200px+ range

### Missing Vertical Spacing Tokens Needed

| Proposed Token | Value | Used By |
|----------------|-------|---------|
| `--sp-24` | 96px | Team card offsets (currently broken) |
| `--sp-40` | 160px | ZigzagDivider pt |
| `--sp-50` | 200px | Problem ClosingText py |

---

## 7. Normalization Strategy (Proposal Only)

### 7.1 Recommended Section Tiers

| Tier | Desktop | Mobile | Use Case |
|------|---------|--------|----------|
| **Spacious** | `--sp-30` (120px) | `--sp-20` (80px) | Standard content sections |
| **Standard** | `--sp-20` (80px) | `--sp-12` (48px) | Utility/filler sections |
| **Tight** | `--sp-12` (48px) | `--sp-8` (32px) | Transitional sections |

### 7.2 Current Mapping to Tiers

| Section | Current | Proposed Tier |
|---------|---------|---------------|
| WhatWeBuild | sp-30 / sp-20 | Spacious (no change) |
| Process | sp-30 / sp-20 | Spacious (no change) |
| Team | sp-30 / sp-20 | Spacious (no change) |
| Contact | sp-30 / sp-20 | Spacious (no change) |
| Technologies | sp-20 / sp-12 | Standard (no change) |
| Portfolio | sp-12→sp-30 / sp-8→sp-20 | Asymmetric — keep as-is or standardize |
| Hero | arbitrary 80px | Special — positioning-driven |
| Footer | arbitrary 40px | Tight (convert to `--sp-10`) |
| Problem | sp-20 / sp-30 (variant-dependent) | Spacious for desktop, Standard for mobile |

### 7.3 Symmetric vs Asymmetric Rules

- **Default:** Symmetric padding (pt == pb) using tier token.
- **Asymmetric allowed when:** Section has visual anchoring (e.g., Portfolio: tight top because heading anchors to previous divider, spacious bottom for breathing room).
- **Hero:** Exempt from tier system — uses scroll-driven positioning.

### 7.4 Recommended Actions

1. **Fix bug:** Define `--sp-24: 96px` in `index.css` or change team card offsets to use an existing token.
2. **Token adoption:** Replace all arbitrary values that match existing tokens (5 instances across 3 files).
3. **New tokens:** Add `--sp-40: 160px` and `--sp-50: 200px` if those values are intentional. Otherwise, round to nearest existing token.
4. **Hero tokenization:** Convert `80px` literals to `var(--sp-20)`.
5. **Footer tokenization:** Convert `40px` literals to `var(--sp-10)`.
6. **Tailwind default cleanup:** Replace `mx-10` with `mx-[var(--sp-10)]` in Technologies.

---

## 8. Validation Checklist

- [x] No files modified
- [x] No spacing values changed
- [x] Full inventory created (10 sections + 2 decorative elements + App layout)
- [x] Patterns identified (dominant tier, symmetric/asymmetric, clusters)
- [x] System classified (semi-cohesive)
- [x] Violations flagged (1 bug, 5 token-equivalent arbitraries, 3 untokenized values, 1 Tailwind default)
- [x] Normalization strategy proposed

---

## 9. Next Steps

Implementation should be done on a separate branch (`refactor/section-vertical-spacing-normalize`):

1. Add missing tokens (`--sp-24`, optionally `--sp-40`, `--sp-50`)
2. Replace arbitrary values with token equivalents (zero visual change)
3. Tokenize Hero and Footer spacing
4. Replace Tailwind default `mx-10` in Technologies
5. Validate no visual regressions via screenshot comparison
