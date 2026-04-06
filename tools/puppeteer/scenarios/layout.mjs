export const name = 'Layout Integrity';
export const suite = 'layout';

const MAJOR_OVERFLOW_PX = 50;

export async function check(page, viewport) {
  return page.evaluate((vw, majorPx) => {
    const findings = [];

    // Check containers for children overflowing parents
    const containers = document.querySelectorAll('section, main, [class*="container"], [class*="grid"], [class*="flex"]');

    for (const container of containers) {
      const cRect = container.getBoundingClientRect();
      if (cRect.width === 0 || cRect.height === 0) continue;

      for (const child of container.children) {
        const chRect = child.getBoundingClientRect();
        if (chRect.width === 0 && chRect.height === 0) continue;

        const overflowRight = chRect.right - cRect.right;
        const overflowLeft = cRect.left - chRect.left;
        const overflow = Math.max(overflowRight, overflowLeft);

        if (overflow > 4) {
          const cStyle = window.getComputedStyle(container);
          const ovf = cStyle.overflow + cStyle.overflowX;
          if (ovf.includes('hidden') || ovf.includes('clip')) continue;

          findings.push({
            level: overflow > majorPx ? 'warning' : 'info',
            message: 'Child overflows parent container',
            selector: `${sel(container)} > ${sel(child)}`,
            detail: `overflow: ${overflow.toFixed(0)}px`,
          });
        }
      }
    }

    // Check text content blocks for overflow
    const textEls = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a');
    const checked = new Set();

    for (const el of textEls) {
      if (el.scrollWidth <= el.clientWidth + 1) continue;
      const s = sel(el);
      if (checked.has(s)) continue;
      checked.add(s);

      const style = window.getComputedStyle(el);
      if (style.textOverflow === 'ellipsis') continue;
      if (style.overflow === 'hidden' || style.overflowX === 'hidden') continue;

      findings.push({
        level: 'info',
        message: 'Text content overflows its container',
        selector: s,
        detail: `scrollWidth ${el.scrollWidth}px > clientWidth ${el.clientWidth}px`,
      });
    }

    return findings;

    function sel(el) {
      if (el.id) return `#${el.id}`;
      const tag = el.tagName.toLowerCase();
      const cls = [...el.classList].slice(0, 2).join('.');
      return `${tag}${cls ? '.' + cls : ''}`;
    }
  }, viewport.width, MAJOR_OVERFLOW_PX);
}
