import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const members = [
  {
    name: "Ian",
    role: "Diseño de sistemas y experiencia",
    description:
      "Entiende el problema, define la solución y estructura cómo se usa.",
    image: "/Ian.png",
  },
  {
    name: "Kevin",
    role: "Desarrollo y arquitectura",
    description: "Construye el sistema. Backend, lógica, escalabilidad.",
    image: "/KV.png",
  },
  {
    name: "Juan Cruz",
    role: "Operación y negocio",
    description:
      "Trae el contexto real. Asegura que lo que se construye funcione en la práctica.",
    image: "/JC.png",
  },
]

export function Team() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const sectionOpacity = useTransform(scrollYProgress, [0.94, 1], [1, 0])
  const sectionY = useTransform(scrollYProgress, [0.94, 1], [0, -40])

  // Fade-out escalonado por card
  const c0Y = useTransform(scrollYProgress, [0.94, 1], [0, -50])
  const c1Y = useTransform(scrollYProgress, [0.95, 1], [0, -70])
  const c2Y = useTransform(scrollYProgress, [0.96, 1], [0, -90])
  const cardYs = [c0Y, c1Y, c2Y]

  return (
    <section ref={sectionRef} id="equipo" className="relative z-10 h-[200vh] max-md:h-[250vh]">
      <motion.div
        className="sticky top-0 h-screen flex flex-col justify-center max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)]"
        style={{ opacity: sectionOpacity, y: sectionY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="type-overline text-shadow-smooth mb-[var(--sp-3)]">Quiénes somos</p>
          <h2 className="font-[var(--font-heading)] text-[length:var(--text-h2)] max-md:text-[length:var(--text-h3)] font-[800] text-[var(--color-fg)] tracking-[-0.02em] mb-[var(--sp-3)] leading-[60px] max-md:leading-[52px] text-shadow-smooth">
            Tres roles, una misma mesa
          </h2>
          <div className="mb-[var(--sp-12)]" />
        </motion.div>
        <div className="grid grid-cols-3 gap-[var(--sp-10)] max-md:grid-cols-1 max-md:gap-[var(--sp-6)]">
          {members.map((member, i) => {
            const offsets = ["mt-0", "mt-[var(--sp-12)]", "mt-[var(--sp-24)]"]
            return (
              <motion.div
                key={member.name}
                className={`${offsets[i]} max-md:mt-0`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-60px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
                style={{ y: cardYs[i] }}
              >
                <div className="aspect-[4/5] rounded-sm bg-[var(--color-surface-flat)] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
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
        </div>
      </motion.div>
    </section>
  )
}
