const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

function c(color, text) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

/**
 * Print a structured terminal report from QA results.
 * @param {Array<{viewport: string, scenario: string, findings: Array}>} results
 * @param {string} url
 */
export function printReport(results, url) {
  const totalFindings = results.reduce((sum, r) => sum + r.findings.length, 0);
  const errorCount = results.reduce(
    (sum, r) => sum + r.findings.filter(f => f.level === 'error').length, 0,
  );
  const warnCount = totalFindings - errorCount;

  // Group results by viewport
  const byViewport = new Map();
  for (const r of results) {
    if (!byViewport.has(r.viewport)) byViewport.set(r.viewport, []);
    byViewport.get(r.viewport).push(r);
  }

  console.log('');
  console.log(c('bold', '  Visual QA Report'));
  console.log(c('dim', `  ${'-'.repeat(50)}`));
  console.log(`  URL:       ${c('cyan', url)}`);
  console.log(`  Date:      ${new Date().toISOString()}`);
  console.log(`  Viewports: ${byViewport.size}  |  Scenarios: ${new Set(results.map(r => r.scenario)).size}  |  Findings: ${totalFindings}`);
  console.log(c('dim', `  ${'-'.repeat(50)}`));

  for (const [viewport, entries] of byViewport) {
    console.log('');
    console.log(`  ${c('bold', viewport)}`);

    for (const entry of entries) {
      if (entry.findings.length === 0) {
        console.log(`    ${c('green', '\u2713')} ${entry.scenario}`);
      } else {
        console.log(`    ${c('red', '\u2717')} ${entry.scenario} \u2014 ${entry.findings.length} issue${entry.findings.length > 1 ? 's' : ''}`);
        for (const f of entry.findings) {
          const icon = f.level === 'error' ? c('red', '\u2718') : c('yellow', '\u26A0');
          console.log(`      ${icon} ${f.message}`);
          if (f.selector) console.log(`        ${c('dim', f.selector)}`);
          if (f.detail) console.log(`        ${c('dim', f.detail)}`);
        }
      }
    }
  }

  console.log('');
  console.log(c('dim', `  ${'-'.repeat(50)}`));
  if (totalFindings === 0) {
    console.log(`  ${c('green', 'All checks passed.')}`);
  } else {
    console.log(`  ${c('red', `${errorCount} error${errorCount !== 1 ? 's' : ''}`)}, ${c('yellow', `${warnCount} warning${warnCount !== 1 ? 's' : ''}`)}`);
  }
  console.log('');
}
