export const name = 'Horizontal Overflow';
export const suite = 'layout';

export async function check(page, viewport) {
  return page.evaluate((vw) => {
    const findings = [];

    // Document-level horizontal overflow
    const docWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    if (docWidth > clientWidth + 1) {
      findings.push({
        level: 'error',
        message: `Page has horizontal scroll: ${docWidth}px content in ${clientWidth}px viewport (+${docWidth - clientWidth}px)`,
      });
    }

    // Find individual elements wider than viewport or extending past right edge
    const seen = new Set();
    const els = document.querySelectorAll('body *');

    for (const el of els) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;

      const sel = shortSelector(el);

      if (rect.width > vw + 1 && !seen.has('wide:' + sel)) {
        seen.add('wide:' + sel);
        findings.push({
          level: 'error',
          message: 'Element wider than viewport',
          selector: sel,
          detail: `${Math.round(rect.width)}px wide (viewport: ${vw}px)`,
        });
      }

      if (rect.right > vw + 2 && rect.left >= 0 && !seen.has('right:' + sel)) {
        seen.add('right:' + sel);
        // Skip if parent already flagged
        if (el.parentElement && seen.has('right:' + shortSelector(el.parentElement))) continue;
        findings.push({
          level: 'warning',
          message: 'Element extends beyond right viewport edge',
          selector: sel,
          detail: `right edge at ${Math.round(rect.right)}px`,
        });
      }
    }

    return findings;

    function shortSelector(el) {
      if (el.id) return `#${el.id}`;
      const tag = el.tagName.toLowerCase();
      const cls = [...el.classList].slice(0, 2).join('.');
      return `${tag}${cls ? '.' + cls : ''}`;
    }
  }, viewport.width);
}
