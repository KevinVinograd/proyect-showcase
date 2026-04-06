#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VIEWPORTS, MOBILE_VIEWPORTS } from './utils/viewports.mjs';
import { printReport } from './utils/report.mjs';
import { cleanArtifacts } from './utils/cleanup.mjs';
import { triggerLazyContent } from './utils/scroll.mjs';
import { loadScenarios } from './scenarios/index.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const ARTIFACTS_DIR = resolve(ROOT, '.artifacts/puppeteer');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

function flag(name) { return args.includes(`--${name}`); }
function option(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
}

const keepArtifacts = flag('keep');
const mobileOnly = flag('mobile');
const cleanOnly = flag('clean');
const suiteName = option('suite') || 'all';
const targetUrl = option('url') || 'http://localhost:5173';

// ---------------------------------------------------------------------------
// Clean-only mode
// ---------------------------------------------------------------------------
if (cleanOnly) {
  cleanArtifacts(ARTIFACTS_DIR);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  mkdirSync(ARTIFACTS_DIR, { recursive: true });

  // Verify server is reachable
  try {
    await fetch(targetUrl, { signal: AbortSignal.timeout(5000) });
  } catch {
    console.error(`\n  \u2717 Cannot reach ${targetUrl}`);
    console.error('    Start the dev server first:  npm run dev\n');
    process.exit(2);
  }

  const viewports = mobileOnly ? MOBILE_VIEWPORTS : VIEWPORTS;
  const scenarios = loadScenarios(suiteName);

  if (scenarios.length === 0) {
    console.error(`\n  \u2717 No scenarios found for suite "${suiteName}"\n`);
    process.exit(2);
  }

  console.log(`\n  Running ${scenarios.length} scenario${scenarios.length > 1 ? 's' : ''} across ${viewports.length} viewport${viewports.length > 1 ? 's' : ''}...`);

  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  try {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Scroll through page to trigger lazy-loaded sections
      await triggerLazyContent(page);

      // Take viewport screenshot (artifact)
      const screenshotPath = resolve(ARTIFACTS_DIR, `${vp.width}x${vp.height}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      for (const scenario of scenarios) {
        try {
          const findings = await scenario.check(page, vp);
          results.push({
            viewport: `${vp.name} (${vp.width}\u00D7${vp.height})`,
            scenario: scenario.name,
            findings: findings || [],
          });
        } catch (err) {
          results.push({
            viewport: `${vp.name} (${vp.width}\u00D7${vp.height})`,
            scenario: scenario.name,
            findings: [{
              level: 'error',
              message: `Scenario crashed: ${err.message}`,
            }],
          });
        }
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }

  // Report
  printReport(results, targetUrl);

  // Artifacts
  if (keepArtifacts) {
    console.log(`  Artifacts preserved at: ${ARTIFACTS_DIR}\n`);
  } else {
    cleanArtifacts(ARTIFACTS_DIR);
  }

  const hasErrors = results.some(r => r.findings.some(f => f.level === 'error'));
  process.exit(hasErrors ? 1 : 0);
}

main().catch(err => {
  console.error(`\n  Fatal: ${err.message}\n`);
  cleanArtifacts(ARTIFACTS_DIR);
  process.exit(2);
});
