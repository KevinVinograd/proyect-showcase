import { useSpring, useTransform, type MotionValue } from "framer-motion"

/**
 * Viewport margin buckets (semantic):
 *   heading    — section headings, intros
 *   content    — cards, content blocks, simple reveals
 *   decorative — SVG strokes, flourishes, dividers
 */
export const VIEWPORT_MARGIN = {
  heading: "-100px",
  content: "-60px",
  decorative: "-80px",
} as const

/** Shared spring — natural deceleration feel used across scroll-driven reveals. */
export const SCROLL_SPRING = { stiffness: 80, damping: 22 } as const

/**
 * Scroll-driven fade-in: opacity 0→1, y 20→0 with spring physics.
 * Takes a scroll progress MotionValue and the [start, end] range
 * within that progress where the fade should occur.
 */
export function useScrollFadeIn(
  progress: MotionValue<number>,
  range: [number, number],
) {
  const opacity = useSpring(useTransform(progress, range, [0, 1]), SCROLL_SPRING)
  const y = useSpring(useTransform(progress, range, [20, 0]), SCROLL_SPRING)
  return { opacity, y }
}
