import { Component, useEffect, useRef, useState, type ReactNode } from "react"
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react"

/* ─── WebGL detection ──────────────────────────────────── */

function canWebGL() {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
}

/* ─── Error boundary ───────────────────────────────────── */

class WebGLBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/* ─── Static CSS fallback ──────────────────────────────── */

function Fallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background:
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14,42,126,0.6) 0%, rgba(126,103,14,0.15) 50%, #000 100%)",
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════
   SHADER PRESETS
   Each preset maps to a section by triggerId.
   Presets are ordered top-to-bottom matching page layout.
   The first preset is the default (no scroll trigger).
   ═══════════════════════════════════════════════════════════ */

interface ShaderProps {
  animate: "on" | "off"
  type: "sphere" | "plane" | "waterPlane"
  grain: "on" | "off"
  lightType: "env" | "3d"
  envPreset: string
  wireframe: boolean
  brightness: number
  cAzimuthAngle: number
  cDistance: number
  cPolarAngle: number
  cameraZoom: number
  fov: number
  uAmplitude: number
  uDensity: number
  uFrequency: number
  uSpeed: number
  uStrength: number
  positionX: number
  positionY: number
  positionZ: number
  rotationX: number
  rotationY: number
  rotationZ: number
  reflection: number
  color1: string
  color2: string
  color3: string
}

const NUMERIC_KEYS: (keyof ShaderProps)[] = [
  "brightness", "cAzimuthAngle", "cDistance", "cPolarAngle", "cameraZoom",
  "fov", "uAmplitude", "uDensity", "uFrequency", "uSpeed", "uStrength",
  "positionX", "positionY", "positionZ", "rotationX", "rotationY", "rotationZ",
  "reflection",
]
const COLOR_KEYS: (keyof ShaderProps)[] = ["color1", "color2", "color3"]
const DISCRETE_KEYS: (keyof ShaderProps)[] = [
  "animate", "type", "grain", "lightType", "envPreset", "wireframe",
]

/** Default values — every preset is merged with these */
const DEFAULTS: ShaderProps = {
  animate: "on",
  type: "sphere",
  brightness: 1.4,
  cAzimuthAngle: 250,
  cDistance: 1.52,
  cPolarAngle: 140,
  cameraZoom: 12.47,
  fov: 45,
  uAmplitude: 0,
  uDensity: 0.8,
  uFrequency: 5.5,
  uSpeed: 0.3,
  uStrength: 0.4,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 140,
  grain: "on",
  lightType: "env",
  envPreset: "city",
  reflection: 0.5,
  wireframe: false,
  color1: "#0E2A7E",
  color2: "#7E670E",
  color3: "#7E260E",
}

type PresetOverrides = Partial<ShaderProps> & { triggerId: string }

const PRESETS: PresetOverrides[] = [
  {
    triggerId: "hero",
    color1: "#0E2A7E",
    color2: "#7E670E",
    color3: "#7E260E",
  },
  {
    triggerId: "problems",
    color1: "#8B1A1A",
    color2: "#C62828",
    color3: "#7E260E",
  },
  {
    triggerId: "servicios",
    color1: "#1B0A2E",
    color2: "#E8562A",
    color3: "#F5A623",
  },
  {
    triggerId: "proceso",
    color1: "#0A4DA6",
    color2: "#F2E307",
    color3: "#FFFFFF",
  },
  {
    triggerId: "portfolio",
    color1: "#5B1A6E",
    color2: "#E84820",
    color3: "#F5A623",
  },
  {
    triggerId: "equipo",
    color1: "#1A237E",
    color2: "#0288D1",
    color3: "#6A1B9A",
    brightness: 0.5,
  },
  {
    triggerId: "contacto",
    color1: "#060D1F",
    color2: "#DAE2F0",
    color3: "#0F1A3A",
    brightness: 0.55,
  },
]

function resolve(preset: PresetOverrides): ShaderProps {
  const { triggerId: _, ...overrides } = preset
  return { ...DEFAULTS, ...overrides }
}

const RESOLVED: ShaderProps[] = PRESETS.map(resolve)

/* ─── Interpolation helpers ────────────────────────────── */

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parseHex(a)
  const [br, bg, bb] = parseHex(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Smooth ease-in-out curve (quintic — flatter at edges than cubic) */
function smoothstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function blendPresets(a: ShaderProps, b: ShaderProps, t: number): ShaderProps {
  const eased = smoothstep(t)
  const result = {} as ShaderProps

  for (const key of NUMERIC_KEYS) {
    ;(result as any)[key] = lerp(a[key] as number, b[key] as number, eased)
  }
  for (const key of COLOR_KEYS) {
    ;(result as any)[key] = lerpHex(a[key] as string, b[key] as string, eased)
  }
  for (const key of DISCRETE_KEYS) {
    ;(result as any)[key] = eased < 0.5 ? a[key] : b[key]
  }
  return result
}

/** 0 when section is 1× viewport below, 1 when top reaches 15% from top */
function sectionProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  const viewH = window.innerHeight
  const raw = 1 - (rect.top - viewH * 0.15) / (viewH * 1.0)
  return Math.max(0, Math.min(1, raw))
}

/* ═══════════════════════════════════════════════════════════
   SHADER BACKGROUND
   ═══════════════════════════════════════════════════════════ */

export function ShaderBackground() {
  const [glSupported] = useState(canWebGL)
  const [blended, setBlended] = useState<ShaderProps>(RESOLVED[0])

  const smoothPos = useRef(0)
  const targetPos = useRef(0)
  const elCache = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    let rafId = 0
    let running = false
    let paused = false
    let lastRenderTime = 0
    const LERP_SPEED = 0.045
    const DIST_EPSILON = 0.001
    const RENDER_INTERVAL = 1000 / 20 // ~20fps — sufficient for gradient blends

    function applyBlend() {
      const pos = smoothPos.current
      const fromIdx = Math.floor(pos)
      const toIdx = Math.min(fromIdx + 1, RESOLVED.length - 1)
      const t = pos - fromIdx
      setBlended(blendPresets(RESOLVED[fromIdx], RESOLVED[toIdx], t))
    }

    function tick(time: number) {
      if (paused) { running = false; return }

      smoothPos.current = lerp(smoothPos.current, targetPos.current, LERP_SPEED)
      const dist = Math.abs(smoothPos.current - targetPos.current)

      if (dist > DIST_EPSILON) {
        if (time - lastRenderTime >= RENDER_INTERVAL) {
          lastRenderTime = time
          applyBlend()
        }
        rafId = requestAnimationFrame(tick)
      } else {
        // Snap to target and stop
        smoothPos.current = targetPos.current
        applyBlend()
        running = false
      }
    }

    function startLoop() {
      if (running || paused) return
      running = true
      rafId = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (paused) return
      let segPos = 0
      for (let i = 1; i < PRESETS.length; i++) {
        if (!elCache.current[i]) {
          elCache.current[i] = document.getElementById(PRESETS[i].triggerId)
        }
        const el = elCache.current[i]
        if (!el) continue
        const progress = sectionProgress(el)
        if (progress > 0) {
          segPos = (i - 1) + progress
        }
      }
      targetPos.current = segPos
      startLoop()
    }

    // Pause when tab is not visible
    const onVisibility = () => {
      if (document.hidden) {
        paused = true
        cancelAnimationFrame(rafId)
        running = false
      } else {
        paused = false
        startLoop()
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!glSupported) return <Fallback />

  return (
    <WebGLBoundary fallback={<Fallback />}>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <ShaderGradientCanvas
          style={{ width: "100%", height: "100%" }}
          pixelDensity={1}
          pointerEvents="none"
        >
          <ShaderGradient {...blended as any} />
        </ShaderGradientCanvas>
      </div>
    </WebGLBoundary>
  )
}
