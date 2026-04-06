/**
 * Scroll through the full page to trigger lazy-loaded sections,
 * then return to the top.
 */
export async function triggerLazyContent(page) {
  await page.evaluate(async () => {
    const step = 400;
    const pause = 100;
    const maxHeight = document.body.scrollHeight;
    let y = 0;
    while (y < maxHeight) {
      window.scrollBy(0, step);
      y += step;
      await new Promise(r => setTimeout(r, pause));
    }
  });
  // Let final lazy sections render
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 300));
}
