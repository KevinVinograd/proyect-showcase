export const name = 'Image Sizing';
export const suite = 'images';

export async function check(page, viewport) {
  return page.evaluate(() => {
    const findings = [];
    const images = document.querySelectorAll('img');

    for (const img of images) {
      const rect = img.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (!img.naturalWidth || !img.naturalHeight) continue;

      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const renderedRatio = rect.width / rect.height;
      const ratioDiff = Math.abs(naturalRatio - renderedRatio) / naturalRatio;

      const style = window.getComputedStyle(img);
      const objectFit = style.objectFit;

      if (ratioDiff > 0.08 && objectFit === 'fill') {
        findings.push({
          level: 'warning',
          message: 'Image may be distorted (aspect ratio mismatch, no object-fit)',
          selector: imgSelector(img),
          detail: `natural: ${img.naturalWidth}x${img.naturalHeight} (${naturalRatio.toFixed(2)}) \u2192 rendered: ${Math.round(rect.width)}x${Math.round(rect.height)} (${renderedRatio.toFixed(2)})`,
        });
      }

      // Zero-dimension render — image is broken
      if ((rect.width < 1 || rect.height < 1) && img.naturalWidth > 0) {
        findings.push({
          level: 'critical',
          message: 'Image rendered with zero dimension',
          selector: imgSelector(img),
          detail: `rendered: ${Math.round(rect.width)}x${Math.round(rect.height)}`,
        });
      }
    }

    return findings;

    function imgSelector(img) {
      if (img.id) return `#${img.id}`;
      const alt = img.alt ? `[alt="${img.alt.slice(0, 30)}"]` : '';
      const src = img.src ? img.src.split('/').pop().slice(0, 30) : '';
      return `img${alt || (src ? `[src*="${src}"]` : '')}`;
    }
  });
}
