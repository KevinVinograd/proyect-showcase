import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion"
import { useScrollFadeIn, SCROLL_SPRING } from "@/lib/motion"

const members = [
  {
    name: "Ian",
    role: "Diseño de sistemas y experiencia",
    description:
      "Entiende el problema, define la solución y estructura cómo se usa.",
    image: "/Ian.webp",
  },
  {
    name: "Kevin",
    role: "Desarrollo y arquitectura",
    description: "Construye el sistema. Backend, lógica, escalabilidad.",
    image: "/KV.webp",
  },
  {
    name: "Juan Cruz",
    role: "Operación y negocio",
    description:
      "Trae el contexto real. Asegura que lo que se construye funcione en la práctica.",
    image: "/JC.webp",
  },
]

export function Team() {
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
    offset: ["start start", "end end"],
  })

  const { scrollYProgress: approachProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })

  const { opacity: titleO, y: titleY } = useScrollFadeIn(approachProgress, [0.4, 0.7])

  const c0O = useSpring(useTransform(scrollYProgress, [0.15, 0.30], [0, 1]), SCROLL_SPRING)
  const c0Y = useSpring(useTransform(scrollYProgress, [0.15, 0.30], [40, 0]), SCROLL_SPRING)
  const c1O = useSpring(useTransform(scrollYProgress, [0.30, 0.45], [0, 1]), SCROLL_SPRING)
  const c1Y = useSpring(useTransform(scrollYProgress, [0.30, 0.45], [40, 0]), SCROLL_SPRING)
  const c2O = useSpring(useTransform(scrollYProgress, [0.45, 0.60], [0, 1]), SCROLL_SPRING)
  const c2Y = useSpring(useTransform(scrollYProgress, [0.45, 0.60], [40, 0]), SCROLL_SPRING)

  // Gentle collective settle after all cards are in — keeps scroll rewarding until unpin
  const settleY = useSpring(useTransform(scrollYProgress, [0.60, 0.90], [0, -20]), SCROLL_SPRING)
  const cardYs = [c0Y, c1Y, c2Y]
  const cardOs = [c0O, c1O, c2O]

  /* Mobile: compact vertical stack, no motion, no descriptions */
  if (isMobile) {
    return (
      <section id="equipo" className="relative z-20 py-[var(--sp-12)]">
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
          <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Quiénes somos</p>
          <h2 className="type-h3 text-[var(--color-fg)] text-shadow-smooth mb-[var(--sp-8)]">
            Tres roles, una misma mesa
          </h2>
          <div className="flex flex-col gap-[var(--sp-5)]">
            {members.map((member) => (
              <div key={member.name}>
                <div className="aspect-[3/2] rounded-sm bg-[var(--color-surface-flat)] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    width={480}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-[var(--sp-3)]">
                  <h3 className="font-[var(--font-heading)] text-[length:var(--text-body-lg)] font-[800] text-[var(--color-fg)] mb-[var(--sp-1)] leading-[1.2] tracking-[0]">
                    {member.name}
                  </h3>
                  <div className="font-[var(--font-body)] text-[length:var(--text-caption)] font-[600] text-[var(--color-fg-disabled)] uppercase tracking-[0.06em]">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* Reduced motion: static layout, no scroll-linked cascade */
  if (reducedMotion) {
    return (
      <section id="equipo" className="relative z-20 py-[var(--sp-30)] max-md:py-[var(--sp-20)]">
        <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]">
          <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Quiénes somos</p>
          <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] mb-[var(--sp-3)] leading-[60px] max-md:leading-[40px] text-shadow-smooth">
            Tres roles, una misma mesa
          </h2>
          <div className="mb-[var(--sp-12)]" />
          <div className="grid grid-cols-3 gap-[var(--sp-10)] max-md:grid-cols-1 max-md:gap-[var(--sp-6)]">
            {members.map((member, i) => {
              const offsets = ["mt-0", "mt-[var(--sp-12)]", "mt-[var(--sp-24)]"]
              return (
                <div key={member.name} className={`${offsets[i]} max-md:mt-0`}>
                  <div className="aspect-[4/5] rounded-sm bg-[var(--color-surface-flat)] overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      width={480}
                      height={480}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative rounded-sm py-[var(--sp-5)]">
                    <div
                      className="absolute inset-0 rounded-sm backdrop-blur-[6px] bg-white/[0.03]"
                      style={{ maskImage: "linear-gradient(to bottom, black, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black, transparent)" }}
                    />
                    <div className="relative z-10">
                      <h3 className="font-[var(--font-heading)] text-[length:var(--text-body-lg)] font-[800] text-[var(--color-fg)] mb-[var(--sp-1)] leading-[1.2] tracking-[0]">
                        {member.name}
                      </h3>
                      <div className="font-[var(--font-body)] text-[length:var(--text-caption)] font-[600] text-[var(--color-fg-disabled)] uppercase tracking-[0.06em] mb-[var(--sp-3)]">
                        {member.role}
                      </div>
                      <p className="font-[var(--font-body)] text-[length:var(--text-body-sm)] text-[var(--color-fg-subtle)] leading-[1.7]">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="equipo" className="relative z-20 h-[160vh] max-md:h-[200vh]">
      <div
        className="sticky top-0 h-screen flex flex-col justify-center max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]"
      >
        <motion.div style={{ opacity: titleO, y: titleY }}>
          <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Quiénes somos</p>
          <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] mb-[var(--sp-3)] leading-[60px] max-md:leading-[40px] text-shadow-smooth">
            Tres roles, una misma mesa
          </h2>
          <div className="mb-[var(--sp-12)]" />
        </motion.div>
        <motion.div className="grid grid-cols-3 gap-[var(--sp-10)] max-md:grid-cols-1 max-md:gap-[var(--sp-6)]" style={{ y: settleY }}>
          {members.map((member, i) => {
            const offsets = ["mt-0", "mt-[var(--sp-12)]", "mt-[var(--sp-24)]"]
            return (
              <motion.div
                key={member.name}
                className={`${offsets[i]} max-md:mt-0`}
                style={{ y: cardYs[i], opacity: cardOs[i] }}
              >
                <div className="aspect-[4/5] rounded-sm bg-[var(--color-surface-flat)] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    width={480}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative rounded-sm py-[var(--sp-5)]">
                  <div
                    className="absolute inset-0 rounded-sm backdrop-blur-[6px] bg-white/[0.03]"
                    style={{ maskImage: "linear-gradient(to bottom, black, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black, transparent)" }}
                  />
                  <div className="relative z-10">
                    <h3 className="font-[var(--font-heading)] text-[length:var(--text-body-lg)] font-[800] text-[var(--color-fg)] mb-[var(--sp-1)] leading-[1.2] tracking-[0]">
                      {member.name}
                    </h3>
                    <div className="font-[var(--font-body)] text-[length:var(--text-caption)] font-[600] text-[var(--color-fg-disabled)] uppercase tracking-[0.06em] mb-[var(--sp-3)]">
                      {member.role}
                    </div>
                    <p className="font-[var(--font-body)] text-[length:var(--text-body-sm)] text-[var(--color-fg-subtle)] leading-[1.7]">
                      {member.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
