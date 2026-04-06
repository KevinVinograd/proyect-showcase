import { existsSync, rmSync } from 'node:fs';

/**
 * Remove Puppeteer-generated temporary artifacts.
 * Only touches .artifacts/puppeteer — never deletes unrelated files.
 */
export function cleanArtifacts(artifactsDir) {
  if (existsSync(artifactsDir)) {
    rmSync(artifactsDir, { recursive: true, force: true });
    console.log(`  Cleaned artifacts: ${artifactsDir}`);
  }
}
