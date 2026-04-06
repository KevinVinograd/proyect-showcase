const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

function c(color, text) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };
const SEVERITY_ICON = {
  critical: c('red', '\u2718'),
  warning: c('yellow', '\u26A0'),
  info: c('dim', '\u2022'),
};
const SEVERITY_LABEL = {
  critical: c('red', 'CRITICAL'),
  warning: c('yellow', 'WARNING'),
  info: c('dim', 'INFO'),
};

const MAX_INFO_PER_SCENARIO = 3;

/**
 * Print a structured terminal report from QA results.
 * Groups by engine, then viewport, sorts by severity, deduplicates info-level noise.
 */
export function printReport(results, url) {
  const allFindings = results.flatMap(r => r.findings);
  const criticalCount = allFindings.filter(f => f.level === 'critical').length;
  const warningCount = allFindings.filter(f => f.level === 'warning').length;
  const infoCount = allFindings.filter(f => f.level === 'info').length;
  const totalFindings = allFindings.length;

  const engineNames = [...new Set(results.map(r => r.engine))];
  const viewportNames = [...new Set(results.map(r => r.viewport))];
  const scenarioNames = [...new Set(results.map(r => r.scenario))];

  // Group results by engine then viewport
  const byEngine = new Map();
  for (const r of results) {
    if (!byEngine.has(r.engine)) byEngine.set(r.engine, new Map());
    const byViewport = byEngine.get(r.engine);
    if (!byViewport.has(r.viewport)) byViewport.set(r.viewport, []);
    byViewport.get(r.viewport).push(r);
  }

  console.log('');
  console.log(c('bold', '  Visual QA Report'));
  console.log(c('dim', `  ${'\u2500'.repeat(54)}`));
  console.log(`  URL:       ${c('cyan', url)}`);
  console.log(`  Date:      ${new Date().toISOString()}`);
  console.log(`  Engines:   ${engineNames.join(', ')}  |  Viewports: ${viewportNames.length}  |  Scenarios: ${scenarioNames.length}`);
  console.log(c('dim', `  ${'\u2500'.repeat(54)}`));

  // Verdict banner
  if (criticalCount > 0) {
    console.log(`  ${c('red', c('bold', `  \u2718  FAIL \u2014 ${criticalCount} critical issue${criticalCount !== 1 ? 's' : ''} found`))}`);
  } else if (totalFindings === 0) {
    console.log(`  ${c('green', '  \u2713  PASS \u2014 all checks passed')}`);
  } else {
    console.log(`  ${c('green', '  \u2713  PASS')} ${c('dim', `\u2014 ${warningCount} warning${warningCount !== 1 ? 's' : ''}, ${infoCount} info`)}`);
  }
  console.log(c('dim', `  ${'\u2500'.repeat(54)}`));

  for (const [engineName, viewportMap] of byEngine) {
    console.log('');
    console.log(`  ${c('magenta', c('bold', `\u25B8 ${engineName}`))}`);

    for (const [viewport, entries] of viewportMap) {
      console.log('');
      console.log(`    ${c('bold', viewport)}`);

      for (const entry of entries) {
        if (entry.findings.length === 0) {
          console.log(`      ${c('green', '\u2713')} ${entry.scenario}`);
          continue;
        }

        // Sort findings: critical first, then warning, then info
        const sorted = [...entry.findings].sort(
          (a, b) => (SEVERITY_ORDER[a.level] ?? 9) - (SEVERITY_ORDER[b.level] ?? 9),
        );

        const crits = sorted.filter(f => f.level === 'critical');
        const warns = sorted.filter(f => f.level === 'warning');
        const infos = sorted.filter(f => f.level === 'info');

        const hasCrit = crits.length > 0;
        const scenarioIcon = hasCrit ? c('red', '\u2718') : c('yellow', '\u25CB');
        const countParts = [];
        if (crits.length) countParts.push(c('red', `${crits.length} critical`));
        if (warns.length) countParts.push(c('yellow', `${warns.length} warning`));
        if (infos.length) countParts.push(c('dim', `${infos.length} info`));

        console.log(`      ${scenarioIcon} ${entry.scenario} \u2014 ${countParts.join(', ')}`);

        // Print critical and warning findings in full
        for (const f of [...crits, ...warns]) {
          console.log(`        ${SEVERITY_ICON[f.level]} ${SEVERITY_LABEL[f.level]}  ${f.message}`);
          if (f.selector) console.log(`          ${c('dim', f.selector)}`);
          if (f.detail) console.log(`          ${c('dim', f.detail)}`);
        }

        // Print info findings with cap
        if (infos.length > 0) {
          const shown = infos.slice(0, MAX_INFO_PER_SCENARIO);
          for (const f of shown) {
            console.log(`        ${SEVERITY_ICON.info} ${f.message}`);
            if (f.selector) console.log(`          ${c('dim', f.selector)}`);
            if (f.detail) console.log(`          ${c('dim', f.detail)}`);
          }
          const hidden = infos.length - shown.length;
          if (hidden > 0) {
            console.log(`        ${c('dim', `  \u2026 and ${hidden} more info-level finding${hidden !== 1 ? 's' : ''}`)}`);
          }
        }
      }
    }
  }

  // Summary
  console.log('');
  console.log(c('dim', `  ${'\u2500'.repeat(54)}`));
  if (totalFindings === 0) {
    console.log(`  ${c('green', 'All checks passed.')}`);
  } else {
    const parts = [];
    if (criticalCount) parts.push(c('red', `${criticalCount} critical`));
    if (warningCount) parts.push(c('yellow', `${warningCount} warning${warningCount !== 1 ? 's' : ''}`));
    if (infoCount) parts.push(c('dim', `${infoCount} info`));
    console.log(`  ${parts.join('  |  ')}`);
    if (criticalCount > 0) {
      console.log(`  ${c('red', 'Exit code 1 \u2014 critical issues must be fixed before deploy.')}`);
    }
  }
  console.log('');
}
