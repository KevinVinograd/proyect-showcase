#!/usr/bin/env node
/**
 * Merge-gate wrapper for the Playwright visual QA system.
 *
 * Self-contained: builds the project, starts a preview server, runs all
 * visual QA checks (Chromium + WebKit) against the production build, then
 * exits with a merge-blocking exit code if critical issues are found.
 *
 * Usage:  npm run qa:gate
 *         npm run qa:gate -- --keep   (preserve screenshots)
 */
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

// Forward extra flags (e.g. --keep, --browser webkit) to the runner
const extraArgs = process.argv.slice(2);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      stdio: opts.silent ? 'pipe' : 'inherit',
      shell: true,
      ...opts,
    });
    child.on('close', code => resolve(code));
    child.on('error', reject);
  });
}

async function waitForServer(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(url, { signal: AbortSignal.timeout(2000) });
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('\n  \u2500\u2500 Visual QA Merge Gate \u2500\u2500\n');

// Step 1: Build
console.log('  [1/3] Building production bundle...\n');
const buildCode = await run('npm', ['run', 'build']);
if (buildCode !== 0) {
  console.error('\n  \u2718 Build failed \u2014 gate cannot proceed.\n');
  process.exit(2);
}

// Step 2: Start preview server
console.log('\n  [2/3] Starting preview server...');
const preview = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT), '--strictPort'], {
  cwd: ROOT,
  stdio: 'pipe',
  shell: true,
});

const ready = await waitForServer(PREVIEW_URL);
if (!ready) {
  console.error(`\n  \u2718 Preview server did not start at ${PREVIEW_URL}\n`);
  preview.kill();
  process.exit(2);
}
console.log(`  Preview server running at ${PREVIEW_URL}\n`);

// Step 3: Run visual QA (Chromium + WebKit by default)
console.log('  [3/3] Running visual QA checks...\n');
const qaCode = await run('node', [
  'tools/playwright/runner.mjs',
  '--url', PREVIEW_URL,
  ...extraArgs,
]);

// Teardown
preview.kill();

// Report gate result
console.log('\n  \u2500\u2500 Gate Result \u2500\u2500\n');
if (qaCode === 0) {
  console.log('  \u2714 GATE PASSED \u2014 no critical issues found.');
  console.log('    Review any warnings in the report above before merging.\n');
} else if (qaCode === 1) {
  console.log('  \u2718 GATE FAILED \u2014 critical issues block merge.');
  console.log('    Fix all critical findings and re-run:  npm run qa:gate\n');
} else {
  console.log('  \u2718 GATE ERROR \u2014 runner failed (exit code ' + qaCode + ').');
  console.log('    Check the output above for details.\n');
}

process.exit(qaCode);
