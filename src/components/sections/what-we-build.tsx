import { useRef } from "react"
import { motion, useScroll, useReducedMotion } from "framer-motion"
import { useScrollFadeIn, VIEWPORT_MARGIN, CARD_TWEEN } from "@/lib/motion"

/* ─── Starburst mask — punches a hole through the card so the shader BG shows ─── */
const STARBURST_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 0 38 22 60 12 42 28 64 32 42 36 60 52 38 42 32 64 26 42 4 52 22 36 0 32 22 28 4 12 26 22Z" fill="black"/></svg>'
)
const STARBURST_MASK = `url("data:image/svg+xml,${STARBURST_SVG}")`

const CARD_MASK: React.CSSProperties = {
  WebkitMaskImage: `${STARBURST_MASK}, linear-gradient(black, black)`,
  WebkitMaskSize: "40px 40px, 100% 100%",
  WebkitMaskPosition: "24px 24px, 0 0",
  WebkitMaskRepeat: "no-repeat, no-repeat",
  WebkitMaskComposite: "xor" as string,
  maskImage: `${STARBURST_MASK}, linear-gradient(black, black)`,
  maskSize: "40px 40px, 100% 100%",
  maskPosition: "24px 24px, 0 0",
  maskRepeat: "no-repeat, no-repeat",
  maskComposite: "exclude",
} as React.CSSProperties


const blocks = [
  {
    title: "Tareas repetitivas que se ejecutan solas",
    body: "Carga de datos, reportes, cruces de información — dejan de ser tareas manuales y pasan a correr automáticamente.",
  },
  {
    title: "Información dispersa en un solo lugar",
    body: "El estado real de la operación visible para todos, en tiempo real. Sin planillas, sin preguntar por WhatsApp.",
  },
  {
    title: "Sistemas que conectan lo que ya tenés",
    body: "Integramos con lo que ya funciona, construimos lo que falta. Sin reemplazar por reemplazar.",
  },
]

export function WhatWeBuild() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })
  const { opacity: headingO, y: headingY } = useScrollFadeIn(scrollYProgress, [0.3, 0.6])

  return (
    <section ref={sectionRef} id="servicios" className="py-[var(--sp-30)] max-md:py-[var(--sp-20)]">
      <div className="grid grid-cols-2 gap-[var(--sp-12)] max-md:grid-cols-1 items-start">
        <div className="sticky top-[40%] max-md:static">
          <motion.div style={{ opacity: headingO, y: headingY }}>
            <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Qué automatizamos</p>
            <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] leading-[1.15] text-shadow-smooth">
              Lo que cambia cuando dejás de operar a mano
            </h2>
          </motion.div>
        </div>
        <div className="flex flex-col gap-[var(--sp-5)]">
          {blocks.map((block, i) => (
            <motion.div
              key={block.title}
              className="rounded-sm p-[var(--sp-6)] bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)]"
              style={CARD_MASK}
              initial={reducedMotion ? false : { opacity: 0, y: 40, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: VIEWPORT_MARGIN.content }}
              transition={{ ...CARD_TWEEN, delay: i * 0.1 }}
            >
              {/* Spacer for the starburst hole */}
              <div className="h-10 mb-[var(--sp-4)]" />
              <p className="type-h5 text-left text-[var(--color-fg-reverse)] mb-[var(--sp-2)]">
                {block.title}
              </p>
              <p className="text-[length:var(--text-body-lg)] text-left text-[var(--color-fg-reverse)] opacity-60 leading-[1.5] tracking-[0]">
                {block.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
