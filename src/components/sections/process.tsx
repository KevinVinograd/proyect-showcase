import { useRef, useState, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"

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
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)

  useLayoutEffect(() => {
    function measure() {
      if (!trackRef.current) return
      const trackW = trackRef.current.scrollWidth
      const viewW = window.innerWidth
      setTravel(Math.max(0, trackW - viewW + 80))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0.1, 0.9], [0, -travel])

  // Track which cards are visible based on scroll
  const [visibleCount, setVisibleCount] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const thresholds = [0.05, 0.22, 0.32, 0.42]
    let count = 0
    for (const t of thresholds) {
      if (v >= t) count++
    }
    setVisibleCount(count)
  })

  return (
    <section ref={sectionRef} id="proceso" className="h-[300vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <motion.div
          className="max-w-[var(--container-hero)] mx-auto w-full px-[var(--sp-6)] mb-[40px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Cómo trabajamos</p>
          <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] leading-[60px] max-md:leading-[52px] text-shadow-smooth">
            De problema a sistema en cuatro pasos
          </h2>
        </motion.div>

        <motion.div
          ref={trackRef}
          className="flex gap-[24px] pl-[max(var(--sp-6),calc((100vw-var(--container-hero))/2+var(--sp-6)))] pr-[80px]"
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
              transition={{ duration: 0.5, ease: "easeOut" }}
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
