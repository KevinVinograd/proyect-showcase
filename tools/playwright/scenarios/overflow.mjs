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
        level: 'critical',
        message: `Page has horizontal scroll: ${docWidth}px content in ${clientWidth}px viewport (+${docWidth - clientWidth}px)`,
      });
    }

    // Check if root elements clip overflow (common with Tailwind)
    const rootClips = (() => {
      for (const el of [document.documentElement, document.body]) {
        const s = window.getComputedStyle(el);
        const ovf = s.overflow + ' ' + s.overflowX;
        if (ovf.includes('hidden') || ovf.includes('clip')) return true;
      }
      return false;
    })();

    // Find individual elements wider than viewport
    const seen = new Set();
    const els = document.querySelectorAll('body *');

    for (const el of els) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;

      const s = shortSelector(el);

      if (rect.width > vw + 1 && !seen.has('wide:' + s)) {
        seen.add('wide:' + s);
        const clipped = hasClippingAncestor(el) || rootClips;
        findings.push({
          level: clipped ? 'info' : 'critical',
          message: clipped
            ? 'Element wider than viewport (clipped by ancestor)'
            : 'Element wider than viewport',
          selector: s,
          detail: `${Math.round(rect.width)}px wide (viewport: ${vw}px)`,
        });
      }

      if (rect.right > vw + 2 && rect.left >= 0 && !seen.has('right:' + s)) {
        seen.add('right:' + s);
        if (el.parentElement && seen.has('right:' + shortSelector(el.parentElement))) continue;
        const clipped = hasClippingAncestor(el) || rootClips;
        if (clipped) continue;
        findings.push({
          level: 'warning',
          message: 'Element extends beyond right viewport edge',
          selector: s,
          detail: `right edge at ${Math.round(rect.right)}px`,
        });
      }
    }

    return findings;

    function hasClippingAncestor(el) {
      let parent = el.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        const style = window.getComputedStyle(parent);
        const ovf = style.overflow + ' ' + style.overflowX;
        if (ovf.includes('hidden') || ovf.includes('clip') || ovf.includes('auto')) {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    }

    function shortSelector(el) {
      if (el.id) return `#${el.id}`;
      const tag = el.tagName.toLowerCase();
      const cls = [...el.classList].slice(0, 2).join('.');
      return `${tag}${cls ? '.' + cls : ''}`;
    }
  }, viewport.width);
}
