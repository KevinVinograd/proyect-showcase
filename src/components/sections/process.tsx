import { useRef, useState, useEffect, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion"
import { useScrollFadeIn, CARD_TWEEN } from "@/lib/motion"

const steps = [
  {
    number: 1,
    title: "Entendemos la operación",
    body: "Nos sentamos con el equipo que opera, no con un brief. Si no vemos la fricción real, no construimos.",
  },
  {
    number: 2,
    title: "Separamos software de proceso",
    body: "No todo se resuelve con código. Distinguir eso al principio ahorra meses.",
  },
  {
    number: 3,
    title: "Entregamos en partes útiles",
    body: "Cada entrega funciona. Si lo primero no sirve, lo sabemos antes de construir todo.",
  },
  {
    number: 4,
    title: "Iteramos con uso real",
    body: "Cuando el equipo usa el sistema aparecen cosas que nadie anticipó. Ajustamos con datos.",
  },
]

export function Process() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useLayoutEffect(() => {
    if (isMobile) return
    function measure() {
      if (!trackRef.current) return
      const trackW = trackRef.current.scrollWidth
      const viewW = window.innerWidth
      setTravel(Math.max(0, trackW - viewW + 80))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const { scrollYProgress: approachProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })
  const { opacity: headingO, y: headingY } = useScrollFadeIn(approachProgress, [0.4, 0.7])

  const x = useTransform(scrollYProgress, [0.1, 0.9], [0, -travel])

  // Track which cards are visible based on scroll
  const [visibleCount, setVisibleCount] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const thresholds = [0.10, 0.35, 0.55, 0.75]
    let count = 0
    for (const t of thresholds) {
      if (v >= t) count++
    }
    setVisibleCount(count)
  })

  /* Mobile: vertical stack, simple entry animations, no horizontal scroll */
  if (isMobile) {
    return (
      <section id="proceso" className="relative py-[var(--sp-20)]">
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
          <div className="mb-[var(--sp-8)]">
            <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Cómo trabajamos</p>
            <h2 className="type-h3 text-[var(--color-fg)] text-shadow-smooth">
              De problema a sistema en cuatro pasos
            </h2>
          </div>
          <div className="flex flex-col gap-[var(--sp-6)]">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div
                  className="rounded-sm p-[var(--sp-6)] bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)] h-full"
                  style={{
                    maskImage: "radial-gradient(circle 22px at 46px 46px, transparent 100%, black 100%)",
                    WebkitMaskImage: "radial-gradient(circle 22px at 46px 46px, transparent 100%, black 100%)",
                  }}
                >
                  <div className="h-[var(--step-number-size)] mb-[var(--sp-5)]" />
                  <p className="type-h5 text-left text-[var(--color-fg-reverse)] mb-[var(--sp-2)]">
                    {step.title}
                  </p>
                  <p className="text-[length:var(--text-body-lg)] text-left text-[var(--color-fg-reverse)] opacity-60 leading-[1.5] tracking-[0]">
                    {step.body}
                  </p>
                </div>
                <div className="absolute top-[var(--sp-6)] left-[var(--sp-6)] w-[var(--step-number-size)] h-[var(--step-number-size)] flex items-center justify-center font-[var(--font-heading)] text-[length:var(--text-body-md)] font-[800] text-[var(--color-fg)] border border-white/25 rounded-full">
                  {step.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* Reduced motion: static grid, all cards visible, no horizontal scroll */
  if (reducedMotion) {
    return (
      <section id="proceso" className="relative py-[var(--sp-30)] max-md:py-[var(--sp-20)]">
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
          <div className="mb-[var(--sp-10)]">
            <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Cómo trabajamos</p>
            <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] leading-[60px] max-md:leading-[40px] text-shadow-smooth">
              De problema a sistema en cuatro pasos
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-[var(--sp-6)] max-md:grid-cols-1">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div
                  className="rounded-sm p-[var(--sp-6)] bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)] h-full"
                  style={{
                    maskImage: "radial-gradient(circle 22px at 46px 46px, transparent 100%, black 100%)",
                    WebkitMaskImage: "radial-gradient(circle 22px at 46px 46px, transparent 100%, black 100%)",
                  }}
                >
                  <div className="h-[var(--step-number-size)] mb-[var(--sp-5)]" />
                  <p className="type-h5 text-left text-[var(--color-fg-reverse)] mb-[var(--sp-2)]">
                    {step.title}
                  </p>
                  <p className="text-[length:var(--text-body-lg)] text-left text-[var(--color-fg-reverse)] opacity-60 leading-[1.5] tracking-[0]">
                    {step.body}
                  </p>
                </div>
                <div className="absolute top-[var(--sp-6)] left-[var(--sp-6)] w-[var(--step-number-size)] h-[var(--step-number-size)] flex items-center justify-center font-[var(--font-heading)] text-[length:var(--text-body-md)] font-[800] text-[var(--color-fg)] border border-white/25 rounded-full">
                  {step.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="proceso" className="h-[220vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <motion.div
          className="max-w-[var(--container-hero)] mx-auto w-full px-[var(--sp-6)] mb-[var(--sp-10)]"
          style={{ opacity: headingO, y: headingY }}
        >
          <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Cómo trabajamos</p>
          <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] leading-[60px] max-md:leading-[40px] text-shadow-smooth">
            De problema a sistema en cuatro pasos
          </h2>
        </motion.div>

        <motion.div
          ref={trackRef}
          className="flex gap-[var(--sp-6)] pl-[max(var(--sp-6),calc((100vw-var(--container-hero))/2+var(--sp-6)))] pr-[var(--sp-20)]"
          style={{ x }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative shrink-0 w-[380px] max-md:w-[300px]"
              animate={i < visibleCount
                ? { opacity: 1, y: 0, rotate: 0 }
                : { opacity: 0, y: 80, rotate: 5 }
              }
              transition={CARD_TWEEN}
            >
              {/* Card with mask hole for the number circle */}
              <div
                className="rounded-sm p-[var(--sp-6)] bg-[var(--color-surface-flat)] shadow-[var(--shadow-soft)] h-full"
                style={{
                  maskImage: "radial-gradient(circle 22px at 46px 46px, transparent 100%, black 100%)",
                  WebkitMaskImage: "radial-gradient(circle 22px at 46px 46px, transparent 100%, black 100%)",
                }}
              >
                {/* Invisible spacer for the number area */}
                <div className="h-[var(--step-number-size)] mb-[var(--sp-5)]" />
                <p className="type-h5 text-left text-[var(--color-fg-reverse)] mb-[var(--sp-2)]">
                  {step.title}
                </p>
                <p className="text-[length:var(--text-body-lg)] text-left text-[var(--color-fg-reverse)] opacity-60 leading-[1.5] tracking-[0]">
                  {step.body}
                </p>
              </div>

              {/* Number overlay — sits on the mask hole, gradient shows through */}
              <div className="absolute top-[var(--sp-6)] left-[var(--sp-6)] w-[var(--step-number-size)] h-[var(--step-number-size)] flex items-center justify-center font-[var(--font-heading)] text-[length:var(--text-body-md)] font-[800] text-[var(--color-fg)] border border-white/25 rounded-full">
                {step.number}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
