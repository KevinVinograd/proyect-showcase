# Visual QA — Puppeteer

Automated structural layout QA for landing pages. Runs headless Chrome across a viewport matrix and reports layout issues.

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
| `npm run qa:visual` | Run all checks, auto-clean artifacts |
| `npm run qa:visual:keep` | Run all checks, preserve screenshots in `.artifacts/puppeteer/` |
| `npm run qa:visual:mobile` | Run all checks on mobile viewports only (375, 390) |
| `npm run qa:visual:grid` | Run only layout-suite checks (overflow + layout integrity) |
| `npm run qa:visual:clean` | Delete leftover artifacts without running checks |

### CLI flags

```
--keep          Preserve screenshots and artifacts after run
--mobile        Run only on mobile viewports
--suite <name>  Filter scenarios: all, layout, navigation, images, mobile
--url <url>     Target URL (default: http://localhost:5173)
--clean         Delete artifacts directory and exit
```

## Artifacts

Temporary screenshots are written to `.artifacts/puppeteer/` during execution.

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
- The dev server must be restarted for code changes to be detected by headless Chrome (Vite HMR doesn't propagate to headless sessions).

## Reuse in other repos

Copy `tools/puppeteer/`, add the `qa:*` scripts to `package.json`, ensure `.artifacts/` is gitignored, and install `puppeteer` as a devDependency.
