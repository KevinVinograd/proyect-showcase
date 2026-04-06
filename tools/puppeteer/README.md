# Visual QA — Puppeteer

Automated layout and visual QA for landing pages. Runs headless Chrome across a viewport matrix and reports layout issues.

## What it checks

| Scenario | Suite | What it detects |
|----------|-------|-----------------|
| Horizontal Overflow | layout | Document-level scroll, elements wider than viewport, right-edge overflow |
| Layout Integrity | layout | Children overflowing containers, text content exceeding bounds |
| Navigation | navigation | Nav wider than viewport, off-screen nav, internal overflow, hidden links |
| Image Sizing | images | Aspect-ratio distortion (without object-fit), zero-dimension renders |
| Mobile Layout | mobile | Fixed widths exceeding viewport, min-width overflow, small touch targets |

## Viewport matrix

| Name | Size |
|------|------|
| iPhone SE | 375×812 |
| iPhone 14 | 390×844 |
| iPad | 768×1024 |
| Laptop | 1280×800 |
| Desktop | 1440×900 |

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

Temporary files (screenshots per viewport) are written to `.artifacts/puppeteer/` during execution.

**Default behavior:** artifacts are auto-deleted after the run completes.

Use `--keep` to preserve them for debugging. Use `npm run qa:visual:clean` to manually remove leftovers.

The `.artifacts/` directory is gitignored.

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | All checks passed |
| 1 | Errors found |
| 2 | Runner failure (server unreachable, bad args, crash) |

## Limitations

- Layout checks rely on computed DOM geometry — CSS `overflow: hidden` containers mask issues by design.
- Image distortion detection only flags images without `object-fit`. Images with `object-fit: cover/contain` are assumed intentional.
- Touch target warnings use 32×32px threshold; WCAG recommends 44×44px.
- Cannot detect visual regressions (pixel comparison) — this checks structure, not appearance.

## Reuse in other landing repos

Copy the `tools/puppeteer/` directory, add the `qa:*` scripts to `package.json`, ensure `.artifacts/` is gitignored, and install `puppeteer` as a devDependency.
