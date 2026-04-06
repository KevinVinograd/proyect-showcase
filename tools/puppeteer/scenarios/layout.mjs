export const name = 'Layout Integrity';
export const suite = 'layout';

export async function check(page, viewport) {
  return page.evaluate((vw) => {
    const findings = [];

    // Check sections and major containers for children overflowing parents
    const containers = document.querySelectorAll('section, main, [class*="container"], [class*="grid"], [class*="flex"]');

    for (const container of containers) {
      const cRect = container.getBoundingClientRect();
      if (cRect.width === 0 || cRect.height === 0) continue;

      // Check if any direct children overflow the container horizontally
      for (const child of container.children) {
        const chRect = child.getBoundingClientRect();
        if (chRect.width === 0 && chRect.height === 0) continue;

        const overflowRight = chRect.right - cRect.right;
        const overflowLeft = cRect.left - chRect.left;

        // Only flag significant overflow (> 4px to avoid subpixel noise)
        if (overflowRight > 4 || overflowLeft > 4) {
          const cStyle = window.getComputedStyle(container);
          const overflow = cStyle.overflow + cStyle.overflowX;
          // Skip if parent explicitly hides overflow
          if (overflow.includes('hidden') || overflow.includes('clip')) continue;

          findings.push({
            level: 'warning',
            message: 'Child overflows parent container',
            selector: `${sel(container)} > ${sel(child)}`,
            detail: `overflow: ${Math.max(overflowRight, overflowLeft).toFixed(0)}px`,
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
      // Skip if text-overflow is intentionally handled
      if (style.textOverflow === 'ellipsis') continue;
      if (style.overflow === 'hidden' || style.overflowX === 'hidden') continue;

      findings.push({
        level: 'warning',
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
  }, viewport.width);
}
