import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"

const TITLE = "Contanos qué proceso querés automatizar."
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
  const reducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end end"],
  })

  // 1. Letter fill reveal — spread across first 55% for the compressed section
  const letterProgress = useTransform(scrollYProgress, [0, 0.55], [0, 1])

  // 2. Body + CTA after letters
  const bodyOpacity = useTransform(scrollYProgress, [0.55, 0.70], [0, 1])
  const bodyY = useTransform(scrollYProgress, [0.55, 0.70], [20, 0])

  /* Mobile OR reduced motion: static layout, letters pre-filled, body visible */
  if (reducedMotion || isMobile) {
    return (
      <section id="contacto" className="relative z-30 pt-[var(--sp-30)] pb-[var(--sp-10)] max-md:pt-[var(--sp-20)] max-md:pb-[var(--sp-10)]">
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] w-full">
          <h2 className="sr-only">Contacto — Hablemos sobre tu operación</h2>
          <p className="type-display-2 text-[var(--color-fg)]">
            {TITLE}
          </p>

          <div>
            <p className="font-[var(--font-body)] text-[length:24px] max-md:text-[length:var(--text-body-lg)] text-[var(--color-fg-subtle)] leading-[1.7] max-w-[700px] mt-[var(--sp-8)]">
              La primera conversación es para entender tu operación.
              <br />
              Sin compromiso, sin presentación de 40 slides.
            </p>
            <div className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] max-md:mt-[var(--sp-8)] max-md:flex-col max-md:items-start">
              <Button asChild size={isMobile ? "md" : "xl"} className={isMobile ? "h-[var(--sp-12)] py-0" : ""}>
                <a href="mailto:hola@kij.dev">
                  Charlemos
                </a>
              </Button>
            </div>
          </div>

          <p className="mt-[var(--sp-20)] max-md:mt-[var(--sp-12)] pt-[var(--sp-20)] max-md:pt-[var(--sp-12)] pb-0 text-[length:var(--text-caption)] text-[var(--color-fg-disabled)]">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="contacto" className="relative z-30 h-[150vh]">
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
              La primera conversación es para entender tu operación.
              <br />
              Sin compromiso, sin presentación de 40 slides.
            </p>
            <div className="flex gap-[var(--sp-4)] mt-[var(--sp-10)] max-md:flex-col max-md:items-start">
              <Button asChild size="xl">
                <a href="mailto:hola@kij.dev">
                  Charlemos
                </a>
              </Button>
            </div>
          </motion.div>

        </div>
        <motion.p
          className="absolute bottom-[var(--sp-20)] left-0 right-0 max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] text-left text-[length:var(--text-caption)] text-[var(--color-fg-disabled)]"
          style={{ opacity: bodyOpacity }}
        >
          &copy; {new Date().getFullYear()}
        </motion.p>
      </div>
    </section>
  )
}
