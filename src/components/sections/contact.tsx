import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
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

  // Fill: bg-opaque → white (opaque fill covers internal stroke overlaps via paint-order)
  const fillColor = useTransform(progress, [animStart, animEnd], [BG, "#ffffff"])
  // Glow per letter: starts before fill, peaks mid-transition then settles
  const glowStart = Math.max(0, animStart - 0.06)
  const glowAlpha = useTransform(progress, [glowStart, animStart, animEnd, animEnd + 0.03], [0, 0.15, 0.2, 0])
  const textShadow = useTransform(glowAlpha, (a) =>
    a > 0.01 ? `0 0 25px rgba(255,255,255,${a}), 0 0 60px rgba(255,255,255,${a * 0.3})` : "none"
  )

  return (
    <motion.span
      className="inline-block"
      style={{ WebkitTextFillColor: fillColor as any, textShadow, paintOrder: "stroke fill" }}
    >
      {char}
    </motion.span>
  )
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end end"],
  })

  // 1. Letter fill reveal
  const letterProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  // 2. Body + CTA after letters
  const bodyOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])
  const bodyY = useTransform(scrollYProgress, [0.4, 0.5], [20, 0])


  return (
    <section ref={sectionRef} id="contacto" className="relative z-20 h-[250vh]">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] w-full">
          <h2 className="sr-only">Contacto — Hablemos sobre tu operación</h2>
          <p className="type-display-2 type-stroke" aria-hidden="true">
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
          </p>

          <motion.div style={{ opacity: bodyOpacity, y: bodyY }}>
            <p className="font-[var(--font-body)] text-[length:24px] text-[var(--color-fg-subtle)] leading-[1.7] max-w-[700px] mt-[var(--sp-8)]">
              La primera conversación es para entender el problema.
              <br />
              Sin compromiso, sin presentación de 40 slides.
            </p>
            <div className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] max-md:flex-col max-md:items-stretch">
              <Button asChild size="xl">
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
            className="mt-[var(--sp-20)] pt-[var(--sp-20)] pb-[var(--sp-20)] text-[length:var(--text-caption)] text-[var(--color-fg-disabled)]"
            style={{ opacity: bodyOpacity }}
          >
            &copy; {new Date().getFullYear()}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
