# Visual QA — Playwright

Automated structural layout QA for landing pages. Runs headless **Chromium and WebKit** across a viewport matrix and reports layout issues. WebKit coverage catches Safari/iOS-specific breakage that Chromium alone misses.

**This is not visual regression testing.** It checks DOM geometry and computed styles — not rendered appearance. It does not replace manual design review.

## What it detects

| Scenario | Suite | What it checks |
|----------|-------|----------------|
| Horizontal Overflow | layout | Document-level scroll, elements wider than viewport |
| Layout Integrity | layout | Children overflowing parents, text exceeding bounds |
| Navigation | navigation | Nav wider than viewport, off-screen, internal overflow |
| Image Sizing | images | Aspect-ratio distortion (without object-fit), zero-dimension renders |
| Mobile Layout | mobile | Fixed widths exceeding viewport, min-width overflow, small touch targets |

## What it does NOT detect

- Visual regressions (pixel-level comparison)
- Color, font, or styling correctness
- Z-index stacking issues
- Opacity or visibility problems
- Content correctness or missing text
- Layout issues masked by `overflow: hidden/clip` on parent containers
- Issues that only appear after user interaction (hover, click, scroll-triggered animations)
- Performance or loading-time problems

This tool catches structural geometry problems. It is good at finding overflow, clipping, and sizing breakage. It cannot tell you whether the page looks right.

## Browser engines

| Engine | What it covers |
|--------|---------------|
| **Chromium** | Chrome, Edge, and Chromium-based browsers |
| **WebKit** | Safari on macOS and iOS — catches flexbox, grid, and rendering differences specific to the WebKit engine |

Both engines run by default. Use `--browser chromium` or `--browser webkit` to run a single engine.

## Severity model

Every finding has one of three severity levels:

| Level | Meaning | Exit behavior |
|-------|---------|---------------|
| **critical** | Page is structurally broken — horizontal scroll, elements wider than viewport, nav off-screen, broken images | Exit code 1 (hard fail) |
| **warning** | Likely a real problem worth investigating — elements past viewport edge, child overflow >50px, image distortion, hidden nav links | Exit code 0 (pass) |
| **info** | Minor or expected — small child overflow, text overflow, small touch targets | Exit code 0, capped in report to reduce noise |

**Exit code 1 means critical issues were found and must be fixed.**
**Exit code 0 means no critical issues.** Warnings and info may still be present — read the report.

## Viewport matrix

| Name | Size |
|------|------|
| iPhone SE | 375x812 |
| iPhone 14 | 390x844 |
| iPad | 768x1024 |
| Laptop | 1280x800 |
| Desktop | 1440x900 |

## Usage

Start the dev server first, then run QA:

```bash
npm run dev          # terminal 1
npm run qa:visual    # terminal 2
```

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run qa:visual` | Run all checks (Chromium + WebKit), auto-clean artifacts |
| `npm run qa:visual:keep` | Run all checks, preserve screenshots in `.artifacts/playwright/` |
| `npm run qa:visual:mobile` | Run all checks on mobile viewports only (375, 390) |
| `npm run qa:visual:grid` | Run only layout-suite checks (overflow + layout integrity) |
| `npm run qa:visual:webkit` | Run all checks on WebKit only |
| `npm run qa:visual:clean` | Delete leftover artifacts without running checks |

### CLI flags

```
--keep              Preserve screenshots and artifacts after run
--mobile            Run only on mobile viewports
--suite <name>      Filter scenarios: all, layout, navigation, images, mobile
--browser <engine>  Run single engine: chromium, webkit (default: both)
--url <url>         Target URL (default: http://localhost:5173)
--clean             Delete artifacts directory and exit
```

## Artifacts

Temporary screenshots are written to `.artifacts/playwright/` during execution. Screenshots are named `{engine}-{width}x{height}.png` (e.g. `webkit-375x812.png`).

**Default:** auto-deleted after run completes.
**`--keep`:** preserves them for debugging.
**`npm run qa:visual:clean`:** manual cleanup.

The `.artifacts/` directory is gitignored.

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | No critical issues (warnings/info may exist) |
| 1 | Critical issues found — must fix |
| 2 | Runner failure (server unreachable, bad args, crash) |

## Interpreting reports

- Report groups findings by **engine** then **viewport**
- **FAIL banner at top** = critical issues found, exit code 1
- **PASS banner** = no critical issues, exit code 0 (read warnings anyway)
- Critical and warning findings are shown in full with selectors and details
- Info findings are capped at 3 per scenario per viewport to reduce noise
- If info findings are capped, the count of hidden findings is shown

## Known limitations

- `overflow-x: clip/hidden` on `<html>` or `<body>` suppresses the document-level horizontal scroll check. Element-level width checks still work.
- Selector deduplication uses first 2 CSS classes. Multiple distinct elements with the same tag+classes are reported once.
- Touch target threshold is 32px, not the WCAG-recommended 44px.
- Lazy-loaded content depends on a scroll-through trigger. Race conditions with slow resources are possible.
- Playwright's WebKit is not identical to Safari on a real device — it is a close approximation using the WebKit engine, but minor rendering differences may exist.

## Merge gate

The visual QA system serves as a pre-merge quality gate for landing-page changes. One command runs the full pipeline against a production build:

```bash
npm run qa:gate
```

This builds the project, starts a preview server, runs all visual QA checks (Chromium + WebKit), and exits with a merge-blocking code if critical issues are found.

### Merge-blocking rule

| Finding level | Merge status |
|---------------|-------------|
| **critical** | Blocked — must fix before merge |
| **warning** | Not blocked — must be reviewed, acknowledged in PR |
| **info** | Not blocked — no action required |

### When to run

Run `npm run qa:gate` before opening or merging any PR that touches:
- Layout structure (`src/` components, pages, sections)
- Responsive behavior or viewport-dependent logic
- CSS/Tailwind changes affecting spatial layout
- Image sizing or aspect ratios
- Navigation structure

Not required for: documentation, tooling, CI config, dependency bumps, or changes with no rendered-layout impact.

### What it enforces

- Structural geometry: overflow, sizing, navigation position, image dimensions
- Across 5 viewports from mobile (375px) to desktop (1440px)
- Across 2 engines: Chromium and WebKit
- Against a real production build, not a dev server

### What it does NOT enforce

- Visual correctness (colors, fonts, spacing aesthetics)
- Interaction behavior (hover states, animations, scroll effects)
- Content correctness
- Performance

This is structural layout QA, not full visual QA. It catches breakage, not design drift.

### Current enforcement level

The gate is enforced locally and through PR visibility:
- `npm run qa:gate` — self-contained command, merge-blocking exit code
- PR template — checklist makes the gate requirement visible during review

**CI enforcement is not yet active.** Adding automated CI enforcement is a pending follow-up.

### Debugging a failure

1. Run `npm run qa:gate -- --keep` to preserve screenshots
2. Check `.artifacts/playwright/` for full-page screenshots at each engine + viewport
3. Read the terminal report — critical findings include the CSS selector and description
4. If the issue is WebKit-only, run `npm run qa:visual:webkit --keep` against dev server for faster iteration
5. Fix the structural issue and re-run

## Browser installation

Playwright requires browser binaries. Install them once:

```bash
npx playwright install chromium webkit
```

This downloads Chromium and WebKit binaries to a shared cache. They do not live in the repo.

## Reuse in other repos

Copy `tools/playwright/`, add the `qa:*` scripts to `package.json`, ensure `.artifacts/` is gitignored, install `playwright` as a devDependency, and run `npx playwright install chromium webkit`.
