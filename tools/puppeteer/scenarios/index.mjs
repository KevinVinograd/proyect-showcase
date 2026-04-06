import * as overflow from './overflow.mjs';
import * as layout from './layout.mjs';
import * as navigation from './navigation.mjs';
import * as images from './images.mjs';
import * as mobile from './mobile.mjs';

const ALL_SCENARIOS = [overflow, layout, navigation, images, mobile];

/**
 * Load scenarios, optionally filtered by suite name.
 * @param {'all' | 'layout' | 'navigation' | 'images' | 'mobile'} suite
 */
export function loadScenarios(suite = 'all') {
  if (suite === 'all') return ALL_SCENARIOS;
  return ALL_SCENARIOS.filter(s => s.suite === suite);
}
