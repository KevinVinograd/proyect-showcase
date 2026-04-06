export const name = 'Navigation';
export const suite = 'navigation';

export async function check(page, viewport) {
  return page.evaluate((vw) => {
    const findings = [];

    const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    if (!nav) {
      findings.push({ level: 'warning', message: 'No <nav> element found on page' });
      return findings;
    }

    const navRect = nav.getBoundingClientRect();

    // Nav wider than viewport — structural breakage
    if (navRect.width > vw + 1) {
      findings.push({
        level: 'critical',
        message: 'Navigation wider than viewport',
        selector: sel(nav),
        detail: `${Math.round(navRect.width)}px (viewport: ${vw}px)`,
      });
    }

    // Nav extending beyond right edge
    if (navRect.right > vw + 2) {
      findings.push({
        level: 'critical',
        message: 'Navigation extends beyond right viewport edge',
        selector: sel(nav),
        detail: `right: ${Math.round(navRect.right)}px`,
      });
    }

    // Nav positioned off-screen entirely
    if (navRect.right < 0 || navRect.bottom < 0) {
      findings.push({
        level: 'critical',
        message: 'Navigation is positioned off-screen',
        selector: sel(nav),
        detail: `rect: ${Math.round(navRect.left)},${Math.round(navRect.top)} ${Math.round(navRect.width)}x${Math.round(navRect.height)}`,
      });
    }

    // All nav links invisible
    const links = nav.querySelectorAll('a, button');
    let hiddenCount = 0;
    for (const link of links) {
      const r = link.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) hiddenCount++;
    }
    if (hiddenCount > 0 && hiddenCount === links.length && links.length > 0) {
      findings.push({
        level: 'warning',
        message: `All ${links.length} nav links have zero dimensions`,
        selector: sel(nav),
      });
    }

    // Nav internal overflow
    if (nav.scrollWidth > nav.clientWidth + 1) {
      const style = window.getComputedStyle(nav);
      if (!style.overflow.includes('hidden') && !style.overflowX.includes('hidden')) {
        findings.push({
          level: 'warning',
          message: 'Navigation content overflows its container',
          selector: sel(nav),
          detail: `scrollWidth ${nav.scrollWidth}px > clientWidth ${nav.clientWidth}px`,
        });
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
