/**
 * Post-build prerender script.
 *
 * 1. Imports the Vite SSR bundle (entry-server.tsx compiled to JS)
 * 2. Calls render() → returns the app's HTML string
 * 3. Injects it into dist/index.html so crawlers see real content
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, "../dist")

// ── Minimal browser globals so libraries (framer-motion, lenis, etc.)
//    can be imported in Node without crashing. Only the absolute minimum
//    needed for a renderToString pass — no full jsdom.
const noop = () => {}
const noopObj = { matches: false, addEventListener: noop }

// Helper: safely set a global, working around read-only properties in Node 22+
function setGlobal(name, value) {
  if (!(name in globalThis)) {
    try {
      Object.defineProperty(globalThis, name, { value, writable: true, configurable: true })
    } catch {
      // Already defined and non-configurable — skip
    }
  }
}

const windowShim = {
  innerWidth: 1280,
  innerHeight: 900,
  scrollY: 0,
  addEventListener: noop,
  removeEventListener: noop,
  requestAnimationFrame: noop,
  cancelAnimationFrame: noop,
  getComputedStyle: () => ({ paddingLeft: "0" }),
  matchMedia: () => noopObj,
  navigator: globalThis.navigator || { userAgent: "" },
}

const documentShim = {
  hidden: false,
  addEventListener: noop,
  removeEventListener: noop,
  createElement: () => ({ getContext: () => null, style: {} }),
  documentElement: { scrollHeight: 0, style: {} },
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  head: { appendChild: noop },
  body: { appendChild: noop },
}

setGlobal("window", windowShim)
setGlobal("document", documentShim)
setGlobal("requestAnimationFrame", noop)
setGlobal("cancelAnimationFrame", noop)
setGlobal("getComputedStyle", () => ({ paddingLeft: "0" }))
setGlobal("HTMLElement", class {})
setGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} })
setGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} })

// ── Import SSR bundle and render ──
const entryPath = pathToFileURL(path.resolve(distDir, "server/entry-server.js")).href
const { render } = await import(entryPath)
const appHtml = render()

// ── Inject into the client HTML shell ──
const indexPath = path.resolve(distDir, "index.html")
const template = fs.readFileSync(indexPath, "utf-8")
const output = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`,
)
fs.writeFileSync(indexPath, output)

console.log("✓ Prerendered index.html with static content")
