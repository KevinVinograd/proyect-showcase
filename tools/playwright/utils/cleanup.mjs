import { existsSync, rmSync } from 'node:fs';

/**
 * Remove Playwright-generated temporary artifacts.
 * Only touches .artifacts/playwright — never deletes unrelated files.
 */
export function cleanArtifacts(artifactsDir) {
  if (existsSync(artifactsDir)) {
    rmSync(artifactsDir, { recursive: true, force: true });
    console.log(`  Cleaned artifacts: ${artifactsDir}`);
  }
}
