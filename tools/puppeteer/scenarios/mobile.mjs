export const name = 'Mobile Layout';
export const suite = 'mobile';

/** Only runs on viewports narrower than 768px. */
export async function check(page, viewport) {
  if (viewport.width >= 768) return [];

  return page.evaluate((vw) => {
    const findings = [];
    const all = document.querySelectorAll('body *');
    const flagged = new Set();

    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;

      const style = window.getComputedStyle(el);
      const s = sel(el);

      // Fixed pixel widths wider than viewport
      const widthVal = style.width;
      if (widthVal.endsWith('px')) {
        const px = parseFloat(widthVal);
        if (px > vw && !flagged.has('fw:' + s)) {
          flagged.add('fw:' + s);
          findings.push({
            level: 'error',
            message: 'Fixed width exceeds mobile viewport',
            selector: s,
            detail: `width: ${widthVal} (viewport: ${vw}px)`,
          });
        }
      }

      // min-width wider than viewport
      const minW = style.minWidth;
      if (minW.endsWith('px')) {
        const px = parseFloat(minW);
        if (px > vw && !flagged.has('mw:' + s)) {
          flagged.add('mw:' + s);
          findings.push({
            level: 'warning',
            message: 'min-width exceeds mobile viewport',
            selector: s,
            detail: `min-width: ${minW} (viewport: ${vw}px)`,
          });
        }
      }

      // Touch targets too small (interactive elements)
      const tag = el.tagName.toLowerCase();
      const isInteractive = tag === 'a' || tag === 'button' || el.getAttribute('role') === 'button' || el.onclick;
      if (isInteractive && rect.width > 0 && rect.height > 0) {
        if (rect.height < 32 && rect.width < 32 && !flagged.has('touch:' + s)) {
          flagged.add('touch:' + s);
          findings.push({
            level: 'warning',
            message: 'Touch target may be too small',
            selector: s,
            detail: `${Math.round(rect.width)}x${Math.round(rect.height)}px (recommend >= 44x44)`,
          });
        }
      }
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
