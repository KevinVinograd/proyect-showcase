import { useRef } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"

const TITLE = "Si todos los días repetís algo que debería estar automatizado, escribinos."
const BG = "#080c16"

const ANIM_DUR = 0.12

// Pre-compute word/character indices for staggered reveal
const words = TITLE.split(" ")
let _idx = 0
const wordData = words.map((word) =>
  word.split("").map((char) => ({ char, index: _idx++ }))
)
const TOTAL_CHARS = _idx

function AnimatedLetter({
  char,
  index,
  progress,
}: {
  char: string
  index: number
  progress: MotionValue<number>
}) {
  const animStart = (index / TOTAL_CHARS) * (1 - ANIM_DUR)
  const animEnd = animStart + ANIM_DUR

  // Fill: background color → white (stroke always visible via parent)
  const fillColor = useTransform(progress, [animStart, animEnd], [BG, "#ffffff"])

  return (
    <motion.span
      className="inline-block"
      style={{ WebkitTextFillColor: fillColor as any }}
    >
      {char}
    </motion.span>
  )
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // 1. Letter fill reveal
  const letterProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  // 2. Body + CTA after letters
  const bodyOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])
  const bodyY = useTransform(scrollYProgress, [0.4, 0.5], [20, 0])

  // 3. Fade out
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.92], [1, 0])
  const exitY = useTransform(scrollYProgress, [0.75, 0.92], [0, -80])

  // 4. Subtle glow after all letters filled
  const glowProgress = useTransform(scrollYProgress, [0.38, 0.48], [0, 1])

  useMotionValueEvent(glowProgress, "change", (v) => {
    const el = headingRef.current
    if (!el) return
    const g = v * 0.15
    el.style.textShadow =
      g > 0.01
        ? `0 0 30px rgba(255,255,255,${g}), 0 0 80px rgba(255,255,255,${g * 0.25})`
        : "none"
  })

  return (
    <section ref={sectionRef} id="contacto" className="relative z-20 h-[250vh]">
      <div className="sticky top-0 h-screen flex items-center">
        <motion.div
          className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] w-full"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          <h2 ref={headingRef} className="type-display-2 type-stroke">
            {wordData.map((chars, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap mr-[0.3em]">
                {chars.map(({ char, index }) => (
                  <AnimatedLetter
                    key={index}
                    char={char}
                    index={index}
                    progress={letterProgress}
                  />
                ))}
              </span>
            ))}
          </h2>

          <motion.div style={{ opacity: bodyOpacity, y: bodyY }}>
            <p className="font-[var(--font-body)] text-[length:var(--text-body-lg)] text-[var(--color-fg-subtle)] leading-[1.7] max-w-[var(--container-contact-sub)] mt-[var(--sp-8)]">
              La primera conversación es para entender el problema.
              <br />
              Sin compromiso, sin presentación de 40 slides.
            </p>
            <div className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] max-md:flex-col max-md:items-stretch">
              <Button asChild>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribinos por LinkedIn
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.p
            className="mt-[var(--sp-20)] text-[length:var(--text-caption)] text-[var(--color-fg-disabled)]"
            style={{ opacity: bodyOpacity }}
          >
            &copy; {new Date().getFullYear()}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
